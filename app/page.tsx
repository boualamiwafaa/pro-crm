"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Send, X, User, Shield, LogOut, Save, Coffee, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* BARRE DE STATUT (PAUSE) */}
      <div style={{ width: '100%', maxWidth: '1100px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', border: '2px solid #3b82f6', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ backgroundColor: status === 'En ligne' ? '#059669' : '#d97706', padding: '8px 15px', borderRadius: '10px', fontWeight: 'black', fontSize: '12px' }}>
            ● {status.toUpperCase()}
          </div>
          <select onChange={(e) => setStatus(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid #3b82f6', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
            <option value="En ligne">DISPONIBLE ✅</option>
            <option value="Pause Café">PAUSE CAFÉ ☕</option>
            <option value="Déjeuner">DÉJEUNER 🍴</option>
            <option value="Occupé">OCCUPÉ 🚫</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', color: 'white', fontSize: '12px' }}>ADMIN PANEL</Link>
          <Link href="/login" style={{ color: '#f87171', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px', marginTop: '10px' }}>DÉCONNEXION</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', width: '100%', maxWidth: '1100px' }}>
        {/* BOUTONS ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setShowCalendar(true)} style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'black', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }}>📅 RAPPEL / RDV</button>
          <button onClick={() => setShowChat(true)} style={{ backgroundColor: '#059669', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'black', cursor: 'pointer' }}>💬 CHAT ÉQUIPE</button>
          <button style={{ backgroundColor: '#f59e0b', padding: '20px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'black', cursor: 'pointer' }}>⌨️ CLAVIER MANUEL</button>
        </div>

        {/* FICHE CLIENT CENTRALE */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#60a5fa', marginBottom: '25px', borderBottom: '1px solid #334155', paddingBottom: '15px', fontWeight: 'black' }}>CLIENT : JEAN DURAND</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>NOM COMPLET</label>
                <input type="text" defaultValue="JEAN DURAND" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              </div>
              <div>
                <label style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>EMAIL</label>
                <input type="text" defaultValue="j.durand@gmail.com" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              </div>
              <div>
                <label style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>DATE DE NAISSANCE</label>
                <input type="text" defaultValue="12/05/1985" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white' }} />
              </div>
            </div>
            <div>
              <label style={{ color: '#10b981', fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>COMMENTAIRES</label>
              <textarea style={{ width: '100%', height: '170px', backgroundColor: '#020617', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: 'white', resize: 'none' }}></textarea>
            </div>
          </div>

          {/* QUALIFICATIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
            <button style={{ backgroundColor: '#065f46', padding: '10px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>VENTE ✅</button>
            <button style={{ backgroundColor: '#1e40af', padding: '10px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>RAPPEL 📞</button>
            <button style={{ backgroundColor: '#991b1b', padding: '10px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>REFUS ❌</button>
            <button style={{ backgroundColor: '#374151', padding: '10px', borderRadius: '8px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '10px' }}>NRP</button>
          </div>
        </div>
      </div>

      {/* MODAL CHAT AVEC BOUTON ENVOYER */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '320px', backgroundColor: '#0f172a', border: '2px solid #10b981', borderRadius: '15px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', zIndex: 100 }}>
          <div style={{ backgroundColor: '#10b981', padding: '12px', display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', color: 'black', fontWeight: 'black' }}>
            <span>💬 CHAT ÉQUIPE</span>
            <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ height: '250px', padding: '15px', overflowY: 'auto' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '8px', borderRadius: '8px', fontSize: '12px', marginBottom: '10px' }}>
              <b style={{ color: '#10b981' }}>Superviseur:</b> N'oubliez pas de valider vos ventes !
            </div>
          </div>
          <div style={{ padding: '12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Message..." style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: 'white', fontSize: '12px' }} />
            <button style={{ backgroundColor: '#10b981', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><Send size={18} color="black"/></button>
          </div>
        </div>
      )}

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '2px solid #2563eb', width: '350px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '20px', fontWeight: 'black' }}>FIXER UN RAPPEL</h3>
            <input type="date" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155' }} />
            <input type="time" style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#2563eb', padding: '12px', borderRadius: '10px', border: 'none', color: 'white', fontWeight: 'bold' }}>VALIDER</button>
               <button onClick={() => setShowCalendar(false)} style={{ flex: 1, backgroundColor: '#ef4444', padding: '12px', borderRadius: '10px', border: 'none', color: 'white', fontWeight: 'bold' }}>ANNULER</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}