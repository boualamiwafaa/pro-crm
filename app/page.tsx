"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Save, LogOut, User, Shield, FileUp, X, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AgentPage() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const mainStyle = {
    backgroundColor: '#020617',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    color: 'white',
    padding: '20px',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={mainStyle}>
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 bg-slate-900 border-2 border-blue-500 p-4 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        <div className="flex gap-4">
          <div className="bg-blue-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
            <User size={20}/> AGENT EN LIGNE
          </div>
          <Link href="/admin" className="bg-purple-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-500 transition-all">
            <Shield size={20}/> ACCÈS SUPERVISEUR
          </Link>
        </div>
        <Link href="/login" className="text-red-400 font-bold flex items-center gap-2 hover:text-red-300">
          <LogOut size={20}/> DÉCONNEXION
        </Link>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* BARRE LATERALE */}
        <div className="space-y-4">
          <button onClick={() => setShowCalendar(true)} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 p-5 rounded-2xl flex items-center gap-4 shadow-lg hover:scale-105 transition-transform font-bold">
            <Calendar size={24}/> RAPPEL / RDV
          </button>
          
          <button onClick={() => setShowChat(true)} className="w-full bg-slate-800 border-2 border-emerald-500 p-5 rounded-2xl flex items-center gap-4 shadow-lg hover:border-emerald-400 font-bold text-emerald-400">
            <MessageSquare size={24}/> CHAT ÉQUIPE
          </button>

          <button onClick={() => setShowKeypad(!showKeypad)} className="w-full bg-orange-500 p-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xl shadow-xl hover:bg-orange-400 transition-all uppercase">
            <Phone size={24}/> {showKeypad ? "Fermer" : "Clavier Manuel"}
          </button>

          {showKeypad && (
            <div className="bg-slate-900 border-2 border-orange-500 p-5 rounded-3xl shadow-2xl animate-pulse">
              <div className="bg-black p-4 rounded-xl text-center text-3xl font-mono text-orange-400 mb-4 border border-orange-900">{phoneNumber || "---"}</div>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} className="bg-slate-800 p-5 rounded-xl hover:bg-orange-500 font-bold text-2xl transition-all">{n}</button>
                ))}
              </div>
              <button onClick={() => setPhoneNumber("")} className="w-full mt-4 text-slate-500 font-bold underline">EFFACER</button>
            </div>
          )}
        </div>

        {/* FORMULAIRE CENTRAL */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/80 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 border-b-2 border-blue-600 pb-4 text-blue-400 uppercase italic">
              FICHE PROSPECT : JEAN DURAND
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                    <label className="text-blue-300 text-xs font-black uppercase mb-2 block tracking-widest text-emerald-400">Nom & Prénom</label>
                    <input type="text" defaultValue="JEAN DURAND" className="w-full bg-black/60 border-2 border-slate-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-blue-300 text-xs font-black uppercase mb-2 block tracking-widest text-emerald-400">Date de Naissance</label>
                    <input type="text" defaultValue="12/05/1985" className="w-full bg-black/60 border-2 border-slate-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-blue-300 text-xs font-black uppercase mb-2 block tracking-widest text-emerald-400">Email Personnel</label>
                    <input type="email" defaultValue="j.durand@gmail.com" className="w-full bg-black/60 border-2 border-slate-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500" />
                  </div>
               </div>
               <div>
                  <label className="text-blue-300 text-xs font-black uppercase mb-2 block tracking-widest text-emerald-400">Historique des échanges</label>
                  <textarea rows={9} className="w-full bg-black/60 border-2 border-slate-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500 resize-none" placeholder="Tapez vos notes ici..."></textarea>
               </div>
            </div>

            {/* QUALIFICATIONS VIVES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800">
               {["VENTE ✅", "RAPPEL 📞", "RDV PRIS 📅", "REFUS ❌", "NRP", "HORS CIBLE"].map(q => (
                 <button key={q} className="bg-slate-800 border-2 border-slate-700 py-3 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:border-white transition-all uppercase">{q}</button>
               ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border-2 border-dashed border-slate-600 flex items-center justify-center gap-4">
                 <FileUp className="text-blue-400" />
                 <span className="text-sm font-bold">IMPORTER LISTE LEADS</span>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-400 px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/40 uppercase tracking-tighter transition-all hover:scale-105">
                <Save size={26}/> ENREGISTRER LA FICHE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER AMÉLIORÉ */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-4 border-blue-600 p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(37,99,235,0.4)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-blue-400 uppercase italic">Planifier un Rappel</h3>
              <button onClick={() => setShowCalendar(false)} className="text-white bg-red-600 p-2 rounded-full hover:bg-red-500"><X/></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Choisir la date</label>
                <input type="date" className="w-full bg-black p-4 rounded-xl border-2 border-slate-700 text-white text-xl" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Choisir l'heure</label>
                <input type="time" className="w-full bg-black p-4 rounded-xl border-2 border-slate-700 text-white text-xl" />
              </div>
              <button onClick={() => setShowCalendar(false)} className="w-full bg-blue-600 py-5 rounded-2xl font-black text-xl uppercase hover:bg-blue-500 shadow-lg">Confirmer le RDV</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHAT */}
      {showChat && (
        <div className="fixed bottom-10 right-10 w-96 bg-slate-900 border-4 border-emerald-500 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-5">
           <div className="bg-emerald-500 p-4 flex justify-between items-center">
              <span className="font-black text-black uppercase italic flex items-center gap-2"><MessageSquare size={18}/> Chat Équipe En Ligne</span>
              <button onClick={() => setShowChat(false)} className="text-black hover:scale-120"><X size={24}/></button>
           </div>
           <div className="h-80 p-4 overflow-y-auto space-y-4 bg-black/50">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none mr-8 text-sm">
                <p className="font-bold text-emerald-400 text-xs mb-1">Superviseur</p>
                Hello l'équipe ! N'oubliez pas de bien qualifier vos appels.
              </div>
           </div>
           <div className="p-4 border-t border-slate-800 bg-slate-900">
              <input type="text" placeholder="Votre message..." className="w-full bg-black p-3 rounded-xl border border-slate-700 text-sm outline-none focus:border-emerald-500" />
           </div>
        </div>
      )}
    </div>
  );
}