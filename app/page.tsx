"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Eraser, Clock, Coffee, Headset, Save, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const fetchNextLead = async () => {
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').eq('status', 'nouveau').eq('agent_id', 'Agent_1').limit(1).maybeSingle();
    setLead(data || null);
    setLoading(false);
  };

  useEffect(() => { fetchNextLead(); }, []);

  const handleUpdateStatus = async (qualif: string, rdvDate: string | null = null) => {
    if (!lead) return;
    const { error } = await supabase.from('leads').update({ status: qualif, rdv_date: rdvDate, updated_at: new Date().toISOString() }).eq('id', lead.id);
    if (!error) { fetchNextLead(); setShowCalendar(false); }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement...</div>;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px' }}>
      {/* HEADER - MODES ET NAVIGATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setStatus("En ligne")} style={{ backgroundColor: status === "En ligne" ? "#059669" : "#334155", color: 'white', padding: '8px 15px', borderRadius: '8px', border: 'none' }}>● En ligne</button>
          <button onClick={() => setStatus("Pause")} style={{ backgroundColor: status === "Pause" ? "#f59e0b" : "#334155", color: 'white', padding: '8px 15px', borderRadius: '8px', border: 'none' }}><Clock size={14}/> Pause</button>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Headset color={lead ? "#10b981" : "#94a3b8"} />
          <a href="/admin" style={{ color: '#7c3aed', fontWeight: 'bold', textDecoration: 'none' }}>ADMIN</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '20px' }}>
        {/* GAUCHE : CHAT & CLAVIER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px' }}><MessageSquare size={16}/> CHAT ÉQUIPE</h3>
            <div style={{ height: '120px', backgroundColor: '#020617', borderRadius: '8px', padding: '10px', fontSize: '12px', overflowY: 'auto', marginBottom: '10px' }}>
              <p><span style={{ color: '#7c3aed' }}>Admin:</span> Bonnes ventes !</p>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} type="text" placeholder="Message..." style={{ flex: 1, padding: '8px', borderRadius: '5px', backgroundColor: '#1e293b', border: 'none', color: 'white' }} />
              <button style={{ backgroundColor: '#2563eb', border: 'none', borderRadius: '5px', padding: '5px' }}><Send size={14} color="white"/></button>
            </div>
          </div>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px', borderRadius: '10px', border: 'none' }}>⌨️ CLAVIER MANUEL</button>
          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>{phoneNumber || "---"}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => <button key={n} onClick={() => setPhoneNumber(p => p + n)} style={{ padding: '10px', backgroundColor: '#1e293b', color: 'white', border: 'none' }}>{n}</button>)}
              </div>
              <button onClick={() => setPhoneNumber("")} style={{ color: '#ef4444', background: 'none', border: 'none', marginTop: '10px' }}><Eraser size={14}/> Effacer</button>
            </div>
          )}
        </div>

        {/* MILIEU : FORMULAIRE CLIENT */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          {!lead ? <h2 style={{ textAlign: 'center' }}>EN ATTENTE DE PROSPECT...</h2> : (
            <>
              <h2 style={{ color: '#60a5fa' }}>{lead.last_name} {lead.first_name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <input type="text" placeholder="Date de naissance" defaultValue={lead.birth_date} style={{ padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                <input type="text" placeholder="Email" defaultValue={lead.email} style={{ padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
                <input type="text" placeholder="Adresse" defaultValue={lead.address} style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', borderRadius: '8px' }} />
              </div>
              <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <div style={{ fontSize: '32px', color: '#10b981', fontWeight: 'bold', marginBottom: '10px' }}>{lead.phone}</div>
                <button onClick={() => window.location.href=`tel:${lead.phone}`} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '15px 40px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>APPELER</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button onClick={() => handleUpdateStatus('vente')} style={{ backgroundColor: '#059669', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>VENTE ✅</button>
                <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>RAPPEL 📞</button>
                <button onClick={() => handleUpdateStatus('refus')} style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>REFUS ❌</button>
                <button onClick={() => handleUpdateStatus('nrp')} style={{ backgroundColor: '#475569', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>NRP 📵</button>
                <button onClick={() => handleUpdateStatus('hors_cible')} style={{ backgroundColor: '#991b1b', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>HORS CIBLE</button>
              </div>
              {showCalendar && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px' }}>
                  <label>Choisir Date/Heure :</label>
                  <input type="datetime-local" id="rdv_input" style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                  <button onClick={() => handleUpdateStatus('rappel', (document.getElementById('rdv_input') as HTMLInputElement).value)} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>Confirmer le Rappel</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* DROITE : NOTES ET ENREGISTREMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px' }}>COMMENTAIRES</h3>
            <textarea style={{ width: '100%', height: '150px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white', padding: '10px', borderRadius: '10px' }}></textarea>
            <button style={{ width: '100%', marginTop: '10px', backgroundColor: '#10b981', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}><Save size={18}/> ENREGISTRER</button>
          </div>
          <div style={{ backgroundColor: '#991b1b', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '11px' }}>🔴 ENREGISTREMENT AUDIO ACTIF</div>
        </div>
      </div>
    </div>
  );
}