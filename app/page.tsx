"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Clock, Headset, Save, Send, ChevronDown, Eraser } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rdvDate, setRdvDate] = useState("");
  const [comment, setComment] = useState("");

  // Formulaire local
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', birth_date: '', address: '', city: '', zip: ''
  });

  const statusOptions = ["En ligne", "Pause", "Occupé", "Déjeuner"];

  // 1. CHARGER LE CLIENT SUIVANT
  const fetchNextLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'nouveau')
      .eq('agent_id', 'Agent_1')
      .limit(1)
      .maybeSingle();

    if (data) {
      setLead(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        birth_date: data.birth_date || '',
        address: data.address || '',
        city: data.ville || '',
        zip: data.code_postal || ''
      });
      setComment(data.commentaire || "");
    } else {
      setLead(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNextLead(); }, []);

  // 2. QUALIFIER ET PASSER AU SUIVANT
  const handleQualify = async (qualif: string) => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: qualif, 
        rdv_date: qualif === 'rappel' ? rdvDate : null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id);

    if (!error) {
      setShowCalendar(false);
      fetchNextLead();
    } else {
      alert("Erreur lors de la qualification");
    }
  };

  // 3. ENREGISTRER LES MODIFICATIONS DU FORMULAIRE
  const saveLeadData = async () => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        birth_date: formData.birth_date,
        address: formData.address,
        ville: formData.city,
        code_postal: formData.zip,
        commentaire: comment
      })
      .eq('id', lead.id);

    if (!error) alert("Fiche mise à jour !");
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement du CRM...</div>;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 30px 10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '12px' }} />
          </div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Session: 02h 15m</span>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Headset color={lead ? "#10b981" : "#ef4444"} />
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>ADMIN</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '20px' }}>
        
        {/* COLONNE GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={16}/> CHAT ÉQUIPE</h3>
            <div style={{ height: '150px', backgroundColor: '#020617', borderRadius: '8px', padding: '10px', fontSize: '12px', overflowY: 'auto', marginBottom: '10px' }}>
              <p><span style={{ color: '#7c3aed' }}>Système:</span> Bienvenue Agent_1</p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input type="text" placeholder="Message..." style={{ flex: 1, padding: '8px', borderRadius: '5px', backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
              <button style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '5px', padding: '8px' }}><Send size={14} color="white"/></button>
            </div>
          </div>
          
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>⌨️ CLAVIER MANUEL</button>
          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', textAlign: 'center', border: '1px solid #3b82f6' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px', color: '#10b981' }}>{phoneNumber || "---"}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} style={{ padding: '12px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '5px' }}>{n}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <button onClick={() => setPhoneNumber("")} style={{ flex: 1, backgroundColor: '#334155', padding: '10px', border: 'none', color: 'white', borderRadius: '5px' }}><Eraser size={14}/></button>
                <button onClick={() => window.location.href=`tel:${phoneNumber}`} style={{ flex: 2, backgroundColor: '#059669', padding: '10px', border: 'none', color: 'white', borderRadius: '5px', fontWeight: 'bold' }}>APPELER</button>
              </div>
            </div>
          )}
        </div>

        {/* COLONNE CENTRALE */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          {!lead ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2 style={{ color: '#94a3b8' }}>AUCUN PROSPECT DISPONIBLE</h2>
              <p>Attendez que l'admin injecte des fiches.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#60a5fa', margin: 0 }}>{formData.last_name} {formData.first_name}</h2>
                <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>{lead.phone}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>PRÉNOM</label>
                  <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>NOM</label>
                  <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>DATE DE NAISSANCE</label>
                  <input type="text" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>EMAIL</label>
                  <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>ADRESSE</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                </div>
              </div>

              <button onClick={() => window.location.href=`tel:${lead.phone}`} style={{ width: '100%', backgroundColor: '#f59e0b', color: 'white', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '18px', margin: '25px 0', cursor: 'pointer' }}>
                📞 APPELER LE PROSPECT
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button onClick={() => handleQualify('vente')} style={{ backgroundColor: '#059669', padding: '15px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px' }}>VENTE ✅</button>
                <button onClick={() => setShowCalendar(!showCalendar)} style={{ backgroundColor: '#2563eb', padding: '15px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px' }}>RAPPEL 📞</button>
                <button onClick={() => handleQualify('refus')} style={{ backgroundColor: '#dc2626', padding: '15px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px' }}>REFUS ❌</button>
                <button onClick={() => handleQualify('nrp')} style={{ backgroundColor: '#475569', padding: '15px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px' }}>NRP 📵</button>
                <button onClick={() => handleQualify('hors_cible')} style={{ backgroundColor: '#991b1b', padding: '15px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px' }}>HORS CIBLE</button>
              </div>

              {showCalendar && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px', border: '1px solid #3b82f6' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Fixer une date de rappel :</p>
                  <input type="datetime-local" value={rdvDate} onChange={e => setRdvDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }} />
                  <button onClick={() => handleQualify('rappel')} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Valider le Rappel</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* COLONNE DROITE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b', flexGrow: 1 }}>
            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>COMMENTAIRES / NOTES</h3>
            <textarea 
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ width: '100%', height: '250px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '10px', resize: 'none' }}
              placeholder="Saisir les détails de l'appel ici..."
            ></textarea>
            <button onClick={saveLeadData} style={{ width: '100%', marginTop: '10px', backgroundColor: '#10b981', padding: '12px', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={18}/> ENREGISTRER FICHE
            </button>
          </div>
          <div style={{ backgroundColor: '#991b1b', color: 'white', padding: '12px', borderRadius: '10px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
            🔴 ENREGISTREMENT AUDIO ACTIF
          </div>
        </div>
      </div>
    </div>
  );
}