"use client";
import React, { useState, useEffect } from 'react';
import { 
  Phone, Calendar, MessageSquare, Clock, Headset, Save, Send, 
  ChevronDown, Eraser, LogOut, Mic, Keyboard 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Device } from '@twilio/voice-sdk';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(false); 
  const [status, setStatus] = useState("En ligne");
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rdvDate, setRdvDate] = useState("");
  const [comment, setComment] = useState("");
  
  const [device, setDevice] = useState<Device | null>(null);
  const [callStatus, setCallStatus] = useState("Initialisation..."); 
  const [messages, setMessages] = useState<any[]>([]);
  const [agentId] = useState("Agent_1");

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', birth_date: '', address: '', city: '', zip: ''
  });

  const statusOptions = ["En ligne", "Pause", "Occupé", "Déjeuner"];

  // --- LOGIQUE TWILIO STABILISÉE POUR CASABLANCA ELITE SERVICES ---
  useEffect(() => {
    let currentDevice: Device | null = null;

    const setupTwilio = async () => {
      try {
        const response = await fetch('/api/voip/token');
        const data = await response.json();
        
        if (!data.token) {
          setCallStatus("Erreur Token");
          return;
        }

        // Configuration stable avec serveurs européens
        currentDevice = new Device(data.token, {
          tokenRefreshMs: 10000,
          edge: ['frankfurt', 'dublin'], 
        });

        // Gestionnaire d'enregistrement
        currentDevice.on('registered', () => {
          console.log('Twilio Device Registered');
          setCallStatus("Prêt");
        });

        // Gestionnaire d'erreurs (Correction Erreur 53000)
        currentDevice.on('error', (error) => {
          console.error('Twilio Error:', error);
          if (error.code === 53000) {
            setCallStatus("Erreur Réseau");
          } else {
            setCallStatus(`Erreur ${error.code}`);
          }
        });

        await currentDevice.register();
        setDevice(currentDevice);

      } catch (err) {
        console.error('Setup Error:', err);
        setCallStatus("Erreur Connexion");
      }
    };

    setupTwilio();

    // NETTOYAGE CRUCIAL : Détruit l'instance au rafraîchissement ou fermeture
    return () => {
      if (currentDevice) {
        console.log("Destroying Twilio Device...");
        currentDevice.destroy();
      }
    };
  }, []);

  const startCall = async (numberToCall: string) => {
    if (!device || callStatus !== "Prêt") return alert("Le système VoIP n'est pas prêt.");
    let cleanNumber = numberToCall.replace(/\s+/g, '');
    if (cleanNumber.startsWith('0')) cleanNumber = '+33' + cleanNumber.substring(1); 

    try {
      setCallStatus("Appel...");
      const call = await device.connect({ params: { To: cleanNumber } });
      call.on('disconnect', () => setCallStatus("Prêt"));
    } catch (err) {
      console.error('Call Error:', err);
      setCallStatus("Prêt");
    }
  };

  // --- LOGIQUE SUPABASE ---
  const fetchNextLead = async () => {
    const { data } = await supabase.from('leads').select('*').eq('status', 'nouveau').limit(1).maybeSingle();

    if (data) {
      setLead(data);
      setFormData({
        first_name: data.first_name || '', last_name: data.last_name || '',
        email: data.email || '', birth_date: data.birth_date || '',
        address: data.address || '', city: data.ville || '', zip: data.code_postal || ''
      });
      setComment(data.commentaire || "");
    } else {
      setLead(null);
    }
  };

  useEffect(() => {
    fetchNextLead();
    const channel = supabase.channel('chat-agent')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleQualify = async (qualif: string) => {
    if (!lead) return;
    const { error } = await supabase.from('leads').update({ 
      status: qualif, 
      rdv_date: qualif === 'rappel' ? rdvDate : null,
      updated_at: new Date().toISOString() 
    }).eq('id', lead.id);
    if (!error) { setShowCalendar(false); fetchNextLead(); }
  };

  const saveLeadData = async () => {
    if (!lead) return;
    const { error } = await supabase.from('leads').update({
      first_name: formData.first_name, last_name: formData.last_name,
      email: formData.email, commentaire: comment
    }).eq('id', lead.id);
    if (!error) alert("Données enregistrées !");
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER PROFESSIONNEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '20px', alignItems: 'center', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', color: '#60a5fa' }}>CASABLANCA ELITE SERVICES</h1>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <span style={{ color: callStatus === "Prêt" ? "#10b981" : "#ef4444", fontWeight: 'bold', fontSize: '14px' }}>
            ● VoIP: {callStatus}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '8px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>ADMIN</Link>
          <button onClick={() => window.location.href = '/login'} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>DÉCONNEXION</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '20px' }}>
        
        {/* CHAT D'ÉQUIPE */}
        <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', height: '600px', display: 'flex', flexDirection: 'column', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#94a3b8', textTransform: 'uppercase' }}>Chat Équipe</h3>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.sender_id === agentId ? 'right' : 'left', marginBottom: '10px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: m.sender_id === agentId ? '#2563eb' : '#1e293b', display: 'inline-block', fontSize: '13px', maxWidth: '80%' }}>{m.content}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ marginTop: '15px', width: '100%', padding: '12px', backgroundColor: '#334155', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' }}>⌨️ CLAVIER NUMÉRIQUE</button>
        </div>

        {/* ZONE PRINCIPALE LEAD */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          {lead ? (
            <>
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ color: '#60a5fa', fontSize: '24px', marginBottom: '5px' }}>{formData.first_name} {formData.last_name}</h2>
                <div style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold' }}>{lead.phone}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Prénom</label>
                  <input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Nom</label>
                  <input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
              </div>

              <button onClick={() => startCall(lead.phone)} style={{ width: '100%', backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '25px', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}>
                📞 LANCER L'APPEL
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <button onClick={() => handleQualify('vente')} style={{ backgroundColor: '#059669', padding: '18px', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>VENTE ✅</button>
                <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '18px', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>RAPPEL 📞</button>
                <button onClick={() => handleQualify('refus')} style={{ backgroundColor: '#dc2626', padding: '18px', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>REFUS ❌</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Aucun prospect en attente dans la file.</p>
              <button onClick={fetchNextLead} style={{ background: '#2563eb', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Actualiser la liste</button>
            </div>
          )}
        </div>

        {/* NOTES ET ENREGISTREMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', flex: 1, border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '12px', marginBottom: '15px', color: '#94a3b8', textTransform: 'uppercase' }}>Notes d'appel</h3>
            <textarea 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              placeholder="Saisissez le compte-rendu ici..."
              style={{ width: '100%', flex: 1, backgroundColor: '#020617', border: '1px solid #334155', color: 'white', padding: '15px', borderRadius: '10px', resize: 'none', marginBottom: '15px' }} 
            />
            <button onClick={saveLeadData} style={{ width: '100%', backgroundColor: '#10b981', padding: '14px', border: 'none', color: 'white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> ENREGISTRER
            </button>
          </div>
          <div style={{ backgroundColor: '#991b1b', padding: '12px', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', border: '1px solid #ef4444' }}>
            🔴 ENREGISTREMENT LÉGAL ACTIF
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', width: '400px', border: '1px solid #334155' }}>
            <h3 style={{ marginBottom: '20px' }}>Planifier un rappel</h3>
            <input type="datetime-local" value={rdvDate} onChange={e => setRdvDate(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#020617', color: 'white' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleQualify('rappel')} style={{ flex: 1, backgroundColor: '#2563eb', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' }}>Confirmer</button>
              <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#334155', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}