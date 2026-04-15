"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Send, X, Save, Shield, LogOut, Eraser } from 'lucide-react';
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

  useEffect(() => { fetchNextLead(); }, []);

  const handleSave = async (nouveauStatut: string) => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({ statut: nouveauStatut, commentaire: notes })
      .eq('id', lead.id);

    if (!error) {
      setNotes(""); 
      setShowCalendar(false);
      fetchNextLead(); 
    }
  };

  if (loading) return <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', border: '2px solid #3b82f6', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ backgroundColor: status === 'En ligne' ? '#059669' : '#d97706', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold' }}>● {status.toUpperCase()}</div>
          <select onChange={(e) => setStatus(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid #3b82f6', padding: '8px', borderRadius: '8px' }}>
            <option value="En ligne">DISPONIBLE ✅</option>
            <option value="Pause">PAUSE ☕</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>SUPERVISEUR</Link>
          <Link href="/login" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 'bold' }}>QUITTER</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', width: '100%', maxWidth: '1100px' }}>
        
        {/* COLONNE GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', color: 'white', fontWeight: 'bold' }}>📅 RAPPEL / RDV</button>
          <button onClick={() => setShowChat(true)} style={{ backgroundColor: '#059669', padding: '20px', borderRadius: '15px', color: 'white', fontWeight: 'bold' }}>💬 CHAT ÉQUIPE</button>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#f59e0b', padding: '20px', borderRadius: '15px', color: 'white', fontWeight: 'bold' }}>⌨️ CLAVIER MANUEL</button>

          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '2px solid #f59e0b' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px', textAlign: 'center', backgroundColor: '#000', padding: '10px', borderRadius: '10px' }}>{phoneNumber || "---"}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => <button key={n} onClick={() => setPhoneNumber(p => p + n)} style={{ padding: '10px', backgroundColor: '#1e293b', color: 'white', borderRadius: '5px' }}>{n}</button>)}
              </div>
              <button onClick={() => setPhoneNumber("")} style={{ width: '100%', marginTop: '10px', backgroundColor: '#ef4444', color: 'white', padding: '5px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Eraser size={14}/> EFFACER</button>
              <button onClick={() => window.location.href=`tel:${phoneNumber}`} style={{ width: '100%', marginTop: '10px', backgroundColor: '#10b981', color: 'black', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>APPELER</button>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : FICHE CLIENT */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155' }}>
          {!lead ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><h2>AUCUN PROSPECT</h2><p>Le fichier est vide.</p></div>
          ) : (
            <>
              <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>CLIENT : {lead.nom} {lead.prenom}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" readOnly value={lead.telephone} style={{ backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#10b981', fontWeight: 'bold', fontSize: '18px' }} />
                  <input type="text" readOnly value={lead.email || ""} style={{ backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
                  <button onClick={() => window.location.href=`tel:${lead.telephone}`} style={{ backgroundColor: '#f59e0b', color: 'black', padding: '15px', borderRadius: '10px', fontWeight: 'bold' }}>📞 APPELER</button>
                </div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." style={{ width: '100%', height: '150px', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => handleSave('vente')} style={{ backgroundColor: '#059669', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>VENTE ✅</button>
                <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>RAPPEL 📞</button>
                <button onClick={() => handleSave('refus')} style={{ backgroundColor: '#991b1b', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>REFUS ❌</button>
                <button onClick={() => handleSave('nrp')} style={{ backgroundColor: '#374151', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>NRP</button>
                <button onClick={() => handleSave('bloctel')} style={{ backgroundColor: '#4b5563', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>BLOCTEL 📵</button>
                <button onClick={() => handleSave('hors_cible')} style={{ backgroundColor: '#4b5563', padding: '15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}>HORS CIBLE</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}