"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Save, LogOut, User, Shield, FileUp, X, Send, Coffee, Utensils, Moon } from 'lucide-react';
import Link from 'next/link';

export default function AgentPage() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("En ligne");

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER AVEC ÉTATS DE PAUSE */}
      <div className="w-full max-w-6xl flex flex-wrap justify-between items-center mb-6 bg-slate-900 border-2 border-blue-500 p-4 rounded-2xl shadow-lg">
        <div className="flex gap-3 items-center">
          <div className={`px-4 py-2 rounded-xl font-black flex items-center gap-2 ${status === 'En ligne' ? 'bg-emerald-600' : 'bg-orange-600'}`}>
            <User size={18}/> {status.toUpperCase()}
          </div>
          <select 
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-2 rounded-lg text-xs font-bold outline-none"
          >
            <option value="En ligne">Disponible</option>
            <option value="Pause Café">Pause Café ☕</option>
            <option value="Déjeuner">Déjeuner 🍴</option>
            <option value="Occupé">Occupé 🚫</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <Link href="/admin" className="bg-purple-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-500 text-sm">
            <Shield size={18}/> SUPERVISEUR
          </Link>
          <Link href="/login" className="text-red-400 font-bold flex items-center gap-2 text-sm">
            <LogOut size={18}/> QUITTER
          </Link>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* BARRE LATERALE */}
        <div className="space-y-4">
          <button onClick={() => setShowCalendar(true)} className="w-full bg-blue-600 p-5 rounded-2xl flex items-center gap-4 shadow-xl hover:bg-blue-500 font-black text-white">
            <Calendar size={24}/> RAPPEL / RDV
          </button>
          
          <button onClick={() => setShowChat(true)} className="w-full bg-emerald-600 p-5 rounded-2xl flex items-center gap-4 shadow-xl hover:bg-emerald-500 font-black text-white">
            <MessageSquare size={24}/> CHAT ÉQUIPE
          </button>

          <button onClick={() => setShowKeypad(!showKeypad)} className="w-full bg-orange-500 p-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xl shadow-xl hover:bg-orange-400">
            <Phone size={24}/> {showKeypad ? "FERMER" : "CLAVIER"}
          </button>

          {showKeypad && (
            <div className="bg-slate-900 border-2 border-orange-500 p-4 rounded-2xl shadow-2xl">
              <div className="bg-black p-3 rounded-lg text-center text-2xl font-mono text-orange-400 mb-3 border border-orange-900">{phoneNumber || "---"}</div>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} className="bg-slate-800 p-4 rounded-lg hover:bg-orange-500 font-bold text-xl">{n}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FORMULAIRE CENTRAL */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-black mb-6 text-blue-400 border-b border-slate-800 pb-4 uppercase">Fiche : Jean Durand</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-emerald-400 uppercase mb-1 block">Nom & Prénom</label>
                    <input type="text" defaultValue="JEAN DURAND" className="w-full bg-black border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-emerald-400 uppercase mb-1 block">Date de Naissance</label>
                    <input type="text" defaultValue="12/05/1985" className="w-full bg-black border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-emerald-400 uppercase mb-1 block">Email Personnel</label>
                    <input type="email" defaultValue="j.durand@gmail.com" className="w-full bg-black border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black text-emerald-400 uppercase mb-1 block">Commentaire Appel</label>
                  <textarea rows={7} className="w-full bg-black border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 resize-none"></textarea>
               </div>
            </div>

            {/* BOUTONS DE QUALIFICATION VIFS */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
               {[
                 {t: "VENTE ✅", c: "bg-emerald-700"},
                 {t: "RAPPEL 📞", c: "bg-blue-700"},
                 {t: "RDV 📅", c: "bg-purple-700"},
                 {t: "REFUS ❌", c: "bg-red-700"},
                 {t: "NRP", c: "bg-slate-700"},
                 {t: "FAUX NUM", c: "bg-slate-700"}
               ].map(q => (
                 <button key={q.t} className={`${q.c} py-3 rounded-lg text-[10px] font-black hover:brightness-125 transition-all`}>{q.t}</button>
               ))}
            </div>

            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 py-4 rounded-xl font-black text-xl shadow-lg uppercase transition-all">
              <Save size={20} className="inline mr-2"/> Enregistrer l'appel
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-4 border-blue-600 p-6 rounded-3xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-blue-400 uppercase tracking-tighter">Fixer un Rappel</h3>
              <button onClick={() => setShowCalendar(false)} className="bg-red-600 p-1 rounded-full"><X/></button>
            </div>
            <input type="date" className="w-full bg-black p-4 rounded-xl border border-slate-700 text-white mb-4" />
            <input type="time" className="w-full bg-black p-4 rounded-xl border border-slate-700 text-white mb-6" />
            <button onClick={() => setShowCalendar(false)} className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase">Valider le RDV</button>
          </div>
        </div>
      )}

      {/* MODAL CHAT AMÉLIORÉ AVEC ENVOYER */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border-2 border-emerald-500 rounded-2xl shadow-2xl z-50">
           <div className="bg-emerald-600 p-3 flex justify-between items-center rounded-t-2xl">
              <span className="font-black text-xs uppercase">Chat Interne</span>
              <button onClick={() => setShowChat(false)}><X size={20}/></button>
           </div>
           <div className="h-64 p-3 overflow-y-auto space-y-3 bg-black/40">
              <div className="bg-slate-800 p-2 rounded-lg text-xs">
                <span className="text-emerald-400 font-bold">Admin:</span> Go go go ! On veut du vert !
              </div>
           </div>
           <div className="p-3 border-t border-slate-800 flex gap-2">
              <input type="text" placeholder="Message..." className="flex-1 bg-black p-2 rounded-lg text-xs border border-slate-700 outline-none" />
              <button className="bg-emerald-600 p-2 rounded-lg"><Send size={16}/></button>
           </div>
        </div>
      )}
    </div>
  );
}