"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Save, LogOut, User, Shield } from 'lucide-react';

export default function CRMPage() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      {/* Header avec boutons de navigation */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex gap-4">
          <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-500">
            <User size={18} /> Espace Agent
          </button>
          <button onClick={() => window.location.href='/admin'} className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700">
            <Shield size={18} /> Superviseur
          </button>
        </div>
        <button className="bg-red-900/20 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-900/40">
          <LogOut size={18} /> Déconnexion
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Gauche: Actions */}
        <div className="space-y-4">
          <button onClick={() => setShowCalendar(!showCalendar)} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500 transition-all">
            <Calendar className="text-blue-500" /> 
            <span>Calendrier / Rappels</span>
          </button>
          
          <button onClick={() => alert('Chat bientôt disponible')} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-blue-500 transition-all">
            <MessageSquare className="text-blue-500" /> 
            <span>Chat Équipe</span>
          </button>

          <button onClick={() => setShowKeypad(!showKeypad)} className="w-full bg-blue-600 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20">
            <Phone /> Appel Manuel
          </button>

          {/* CLAVIER NUMÉRIQUE FLOTTANT */}
          {showKeypad && (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl mt-2 animate-in fade-in zoom-in duration-200">
              <input type="text" value={phoneNumber} readOnly className="w-full bg-black border border-slate-700 p-2 text-center text-xl mb-4 text-blue-400 rounded" placeholder="06..." />
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(num => (
                  <button key={num} onClick={() => setPhoneNumber(prev => prev + num)} className="bg-slate-800 p-3 rounded hover:bg-slate-700 text-lg">{num}</button>
                ))}
              </div>
              <button onClick={() => setPhoneNumber("")} className="w-full mt-2 text-xs text-slate-500 underline">Effacer</button>
            </div>
          )}
        </div>

        {/* Colonne Centrale: Fiche Client (Au milieu) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="text-blue-500" /> FICHE : JEAN DURAND
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-slate-500 text-sm mb-1 block">Commentaires / Détails de l'échange</label>
                <textarea 
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                  placeholder="Notez ici les informations importantes..."
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
              <button className="bg-green-600/20 text-green-500 p-2 rounded-lg text-xs font-bold border border-green-600/30 hover:bg-green-600/40">VENTE</button>
              <button className="bg-blue-600/20 text-blue-500 p-2 rounded-lg text-xs font-bold border border-blue-600/30 hover:bg-blue-600/40">RAPPEL</button>
              <button className="bg-yellow-600/20 text-yellow-500 p-2 rounded-lg text-xs font-bold border border-yellow-600/30 hover:bg-yellow-600/40">RDV PRIS</button>
              <button className="bg-red-600/20 text-red-500 p-2 rounded-lg text-xs font-bold border border-red-600/30 hover:bg-red-600/40">REFUS</button>
            </div>

            <button className="w-full mt-6 bg-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-500">
              <Save size={20} /> ENREGISTRER LA FICHE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}