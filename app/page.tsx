"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Send, X, Save, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([{role: 'Admin', text: 'Bienvenue sur la session !'}]);
  const [notes, setNotes] = useState("");

  // 1. CHARGER LE PROCHAIN PROSPECT
  const fetchNextLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('statut', 'nouveau')
      .limit(1)
      .maybeSingle();

    if (data) {
      setLead(data);
      setNotes(data.commentaire || "");
    } else {
      setLead(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNextLead();
  }, []);

  // 2. SAUVEGARDER ET PASSER AU SUIVANT
  const handleSave = async (nouveauStatut: string) => {
    if (!lead) return;

    const { error } = await supabase
      .from('leads')
      .update({ 
        statut: nouveauStatut, 
        commentaire: notes 
      })
      .eq('id', lead.id);

    if (!error) {
      alert("Fiche mise à jour : " + nouveauStatut.toUpperCase());
      setNotes(""); 
      setShowCalendar(false); // Ferme le calendrier si ouvert
      fetchNextLead(); 
    } else {
      alert("Erreur Supabase : " + error.message);
    }
  };

  const handleSendChat = () => {
    if (chatMsg.trim()) {
      setMessages([...messages, { role: 'Moi', text: chatMsg }]);
      setChatMsg(""); 
    }
  };

  const pressKey = (num: string | number) => setPhoneNumber(prev => prev + num);

  if (loading) return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '15px' }}></div>
        <p>Recherche du prochain prospect...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER STATUT */}
      <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', border: '2px solid #3b82f6', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ backgroundColor: status === 'En ligne' ? '#059669' : '#d97706', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold' }}>● {status.toUpperCase()}</div>
          <select onChange={(e) => setStatus(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid #3b82f6', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
            <option value="En ligne">DISPONIBLE ✅</option>
            <option value="Pause Café">PAUSE CAFÉ ☕</option>
            <option value="Déjeuner">DÉJEUNER 🍴</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>SUPERVISEUR</Link>
          <Link href="/login" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px' }}>QUITTER</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', width: '100%', maxWidth: '1100px' }}>
        
        {/* ACTIONS GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>📅 RAPPEL / RDV</button>
          <button onClick={() => setShowChat(true)} style={{ backgroundColor: '#059669', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>💬 CHAT ÉQUIPE</button>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#f59e0b', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>⌨️ CLAVIER MANUEL</button>

          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '2px solid #f59e0b' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px', color: '#f59e0b', fontWeight: 'bold', backgroundColor: '#000', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                {phoneNumber || "Tapez..." }
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map(n => (
                  <button key={n} onClick={() => pressKey(n)} style={{ padding: '15px', backgroundColor: '#1e293b', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer' }}>{n}</button>
                ))}
              </div>
              <button onClick={() => window.location.href=`tel:${phoneNumber}`} style={{ width: '100%', marginTop: '15px', backgroundColor: '#10b981', color: 'black', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900' }}>LANCER L'APPEL</button>
            </div>
          )}
        </div>

        {/* FICHE CLIENT DROITE */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155' }}>
          {!lead ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h2 style={{ color: '#10b981' }}>AUCUN PROSPECT DISPONIBLE</h2>
              <p>Le fichier d'appels est vide.</p>
            </div>
          ) : (
            <>
              <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>CLIENT : {lead.nom?.toUpperCase()} {lead.prenom?.toUpperCase()}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ backgroundColor: '#020617', padding: '15px', borderRadius: '10px', border: '1px solid #334155' }}>
                    <small style={{ color: '#94a3b8' }}>Numéro à joindre</small>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981' }}>{lead.telephone}</div>
                  </div>
                  <button onClick={() => window.location.href=`tel:${lead.telephone}`} style={{ backgroundColor: '#f59e0b', color: 'black', padding: '15px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>📞 APPELER MAINTENANT</button>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>Email: {lead.email || 'N/A'} | Né le: {lead.date_naissance || 'N/A'}</p>
                </div>
                <div>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Saisir le compte-rendu de l'appel..." 
                    style={{ width: '100%', height: '140px', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }}
                  />
                </div>
              </div>

              {/* GRILLE DE QUALIFICATION */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => handleSave('vente')} style={{ backgroundColor: '#059669', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>VENTE ✅</button>
                <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>RAPPEL 📞</button>
                <button onClick={() => handleSave('refus')} style={{ backgroundColor: '#991b1b', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>REFUS ❌</button>
                <button onClick={() => handleSave('nrp')} style={{ backgroundColor: '#374151', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>NRP</button>
                <button onClick={() => handleSave('bloctel')} style={{ backgroundColor: '#4b5563', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>BLOCTEL 📵</button>
                <button onClick={() => handleSave('hors_cible')} style={{ backgroundColor: '#4b5563', padding: '15px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>HORS CIBLE</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '2px solid #3b82f6', width: '350px' }}>
            <h3 style={{ color: '#3b82f6', textAlign: 'center', marginBottom: '20px' }}>PROGRAMMER UN RAPPEL</h3>
            <input type="date" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
            <input type="time" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleSave('rappel')} style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>VALIDER</button>
              <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ANNULER</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT D'ÉQUIPE */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', backgroundColor: '#0f172a', border: '2px solid #10b981', borderRadius: '15px' }}>
          <div style={{ backgroundColor: '#10b981', padding: '12px', display: 'flex', justifyContent: 'space-between', color: 'black', fontWeight: 'bold' }}>
            <span>💬 CHAT ÉQUIPE</span>
            <button onClick={() => setShowChat(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ height: '200px', padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'Moi' ? 'flex-end' : 'flex-start', backgroundColor: m.role === 'Moi' ? '#065f46' : '#1e293b', padding: '8px', borderRadius: '8px', fontSize: '11px' }}>
                <b>{m.role}:</b> {m.text}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', display: 'flex', gap: '5px' }}>
            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChat()} type="text" placeholder="Message..." style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: 'white' }} />
            <button onClick={handleSendChat} style={{ backgroundColor: '#10b981', padding: '10px', borderRadius: '8px', border: 'none' }}><Send size={18} color="black"/></button>
          </div>
        </div>
      )}
    </div>
  );
}