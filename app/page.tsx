"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Send, X, Save, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AgentPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([{role: 'Admin', text: 'Bienvenue sur la session !'}]);
  const [notes, setNotes] = useState("");

  // FONCTION : Envoyer Message Chat
  const handleSendChat = () => {
    if (chatMsg.trim()) {
      setMessages([...messages, { role: 'Moi', text: chatMsg }]);
      setChatMsg(""); 
    }
  };

  // FONCTION : Enregistrer Notes
  const handleSaveNotes = () => {
    alert("Notes enregistrées pour Jean Durand !");
    console.log("Notes sauvegardées :", notes);
  };

  // FONCTION : Clavier
  const pressKey = (num: string | number) => setPhoneNumber(prev => prev + num);

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
        
        {/* BOUTONS ACTIONS (COLONNE GAUCHE) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>📅 RAPPEL / RDV</button>
          <button onClick={() => setShowChat(true)} style={{ backgroundColor: '#059669', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>💬 CHAT ÉQUIPE</button>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#f59e0b', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>⌨️ CLAVIER MANUEL</button>

          {/* CLAVIER MANUEL AVEC BOUTON APPEL */}
          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '2px solid #f59e0b', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px', color: '#f59e0b', fontWeight: 'bold', backgroundColor: '#000', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #444', letterSpacing: '2px' }}>
                {phoneNumber || "Tapez..." }
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map(n => (
                  <button key={n} onClick={() => pressKey(n)} style={{ padding: '15px', backgroundColor: '#1e293b', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                    {n}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => phoneNumber ? alert('Appel en cours vers le ' + phoneNumber) : alert('Entrez un numéro')}
                style={{ width: '100%', marginTop: '15px', backgroundColor: '#10b981', color: 'black', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <Phone size={20} fill="black" /> LANCER L'APPEL
              </button>

              <button onClick={() => setPhoneNumber("")} style={{ width: '100%', marginTop: '10px', color: '#ef4444', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                EFFACER TOUT
              </button>
            </div>
          )}
        </div>

        {/* FICHE CLIENT (COLONNE DROITE) */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155' }}>
          <h2 style={{ color: '#60a5fa', marginBottom: '20px', fontWeight: 'black' }}>CLIENT : JEAN DURAND</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" defaultValue="JEAN DURAND" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              <input type="text" defaultValue="j.durand@gmail.com" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              <input type="text" defaultValue="12/05/1985" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Écrivez vos notes ici..." 
                style={{ width: '100%', height: '100px', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white', resize: 'none' }}
               ></textarea>
               <button onClick={handleSaveNotes} style={{ backgroundColor: '#10b981', color: 'black', padding: '12px', borderRadius: '10px', fontWeight: 'black', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                 <Save size={18}/> ENREGISTRER NOTES
               </button>
            </div>
          </div>

          {/* QUALIFICATIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => alert('Vente Qualifiée !')} style={{ backgroundColor: '#059669', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>VENTE ✅</button>
            <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>RAPPEL 📞</button>
            <button onClick={() => alert('Prospect Refusé')} style={{ backgroundColor: '#991b1b', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>REFUS ❌</button>
            <button onClick={() => alert('NRP Enregistré')} style={{ backgroundColor: '#374151', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>NRP</button>
            <button onClick={() => alert('Bloctel / Hors Cible')} style={{ backgroundColor: '#4b5563', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>BLOCTEL 📵</button>
            <button onClick={() => alert('Hors Cible')} style={{ backgroundColor: '#4b5563', padding: '12px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>HORS CIBLE</button>
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '2px solid #3b82f6', width: '350px', textAlign: 'center' }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '20px', fontWeight: 'black' }}>PROGRAMMER RAPPEL</h3>
            <input type="date" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
            <input type="time" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>VALIDER</button>
              <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ANNULER</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHAT */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', backgroundColor: '#0f172a', border: '2px solid #10b981', borderRadius: '15px', zIndex: 100 }}>
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
          <div style={{ padding: '10px', display: 'flex', gap: '5px', borderTop: '1px solid #334155' }}>
            <input 
              value={chatMsg} 
              onChange={(e) => setChatMsg(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              type="text" placeholder="Message..." 
              style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: 'white' }} 
            />
            <button onClick={handleSendChat} style={{ backgroundColor: '#10b981', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              <Send size={18} color="black"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}