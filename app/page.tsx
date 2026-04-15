"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Eraser, Clock, Coffee, Headset, Save, User, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("En ligne"); // En ligne, Déjeuner, Pause, Occupé
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNextLead = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'nouveau')
      .eq('agent_id', 'Agent_1')
      .limit(1)
      .maybeSingle();
    setLead(data || null);
    setLoading(false);
  };

  useEffect(() => { fetchNextLead(); }, []);

  const handleUpdateStatus = async (newQualification: string) => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: newQualification, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id);
    if (!error) fetchNextLead();
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Connexion...</div>;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER AVEC MODES DE PAUSE */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setStatus("En ligne")} style={{ backgroundColor: status === "En ligne" ? "#059669" : "#334155", padding: '8px 15px', borderRadius: '8px', border: 'none', color: 'white' }}>● En ligne</button>
          <button onClick={() => setStatus("Pause")} style={{ backgroundColor: status === "Pause" ? "#f59e0b" : "#334155", padding: '8px 15px', borderRadius: '8px', border: 'none', color: 'white' }}><Clock size={14}/> Pause</button>
          <button onClick={() => setStatus("Déjeuner")} style={{ backgroundColor: status === "Déjeuner" ? "#3b82f6" : "#334155", padding: '8px 15px', borderRadius: '8px', border: 'none', color: 'white' }}><Coffee size={14}/> Déjeuner</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Headset color={lead ? "#10b981" : "#94a3b8"} />
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>SUPERVISEUR</Link>
          <Link href="/login" style={{ color: '#f87171', textDecoration: 'none' }}>QUITTER</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '20px' }}>
        
        {/* COLONNE GAUCHE : OUTILS & CHAT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px' }}><MessageSquare size={16}/> CHAT ÉQUIPE</h3>
            <div style={{ height: '150px', backgroundColor: '#020617', borderRadius: '10px', marginBottom: '10px', padding: '10px', fontSize: '12px', overflowY: 'auto' }}>
              <p><span style={{ color: '#7c3aed' }}>Admin:</span> Nouveau fichier chargé !</p>
            </div>
            <input type="text" placeholder="Message..." style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
          </div>

          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#2563eb', padding: '15px', borderRadius: '10px', color: 'white', border: 'none' }}>⌨️ CLAVIER MANUEL</button>
        </div>

        {/* COLONNE CENTRALE : FICHE CLIENT DÉTAILLÉE */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          {!lead ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><h2>EN ATTENTE DE PROSPECT...</h2></div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#60a5fa' }}>{lead.last_name} {lead.first_name}</h2>
                <span style={{ backgroundColor: '#1e293b', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>ID: {lead.id.slice(0,8)}</span>
              </div>

              {/* FORMULAIRE DÉTAILLÉ */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>DATE DE NAISSANCE</label>
                  <input type="text" defaultValue={lead.birth_date} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>EMAIL</label>
                  <input type="text" defaultValue={lead.email} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>ADRESSE COMPLÈTE (CP / VILLE)</label>
                  <input type="text" defaultValue={lead.address} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
                </div>
              </div>

              <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '25px', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '32px', letterSpacing: '2px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>{lead.phone}</div>
                <button onClick={() => window.location.href=`tel:${lead.phone}`} style={{ backgroundColor: '#f59e0b', padding: '15px 40px', borderRadius: '50px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>APPELER LE CLIENT</button>
              </div>

              {/* QUALIFICATIONS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button onClick={() => handleUpdateStatus('vente')} style={{ backgroundColor: '#059669', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>VENTE ✅</button>
                <button onClick={() => handleUpdateStatus('rappel')} style={{ backgroundColor: '#2563eb', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>RDV / RAPPEL 📞</button>
                <button onClick={() => handleUpdateStatus('nrp')} style={{ backgroundColor: '#475569', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>NRP 📵</button>
                <button onClick={() => handleUpdateStatus('hors_cible')} style={{ backgroundColor: '#991b1b', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>HORS CIBLE 🚫</button>
                <button onClick={() => handleUpdateStatus('refus')} style={{ backgroundColor: '#dc2626', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>REFUS ❌</button>
                <button onClick={() => handleUpdateStatus('doublon')} style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold' }}>DOUBLON</button>
              </div>
            </>
          )}
        </div>

        {/* COLONNE DROITE : COMMENTAIRES & ENREGISTREMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b', flexGrow: 1 }}>
            <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px' }}>COMMENTAIRES / NOTES</h3>
            <textarea style={{ width: '100%', height: '200px', backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '10px', color: 'white', padding: '10px', fontSize: '13px' }} placeholder="Saisir les détails de l'appel..."></textarea>
            <button style={{ width: '100%', marginTop: '10px', backgroundColor: '#10b981', padding: '10px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Save size={18}/> ENREGISTRER FICHE
            </button>
          </div>
          
          <div style={{ backgroundColor: '#991b1b', padding: '15px', borderRadius: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
            🔴 ENREGISTREMENT AUDIO ACTIF
          </div>
        </div>
      </div>
    </div>
  );
}