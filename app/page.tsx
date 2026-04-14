"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Save, LogOut, User, Shield, FileUp, X } from 'lucide-react';
import Link from 'next/link';

export default function CRMPage() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
  <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', color: 'white' }}>
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}></div>
      
      {/* HEADER CENTRÉ */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex gap-3">
          <button className="bg-blue-600 px-5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20">
            <User size={18} /> Agent
          </button>
          <Link href="/admin" className="bg-slate-800 px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-all">
            <Shield size={18} /> Superviseur
          </Link>
        </div>
        <Link href="/login" className="text-red-500 font-bold flex items-center gap-2 hover:underline">
          <LogOut size={18} /> Déconnexion
        </Link>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* BARRE LATERALE (BOUTONS) */}
        <div className="space-y-4">
          <button onClick={() => setShowCalendar(true)} className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500 transition-all group">
            <Calendar className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-blue-100 text-lg">Calendrier / RDV</span>
          </button>
          
          <button onClick={() => alert('Chat Équipe : Bientôt disponible')} className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500 transition-all">
            <MessageSquare className="text-blue-500" />
            <span className="font-semibold text-blue-100 text-lg">Chat Équipe</span>
          </button>

          <button onClick={() => setShowKeypad(!showKeypad)} className="w-full bg-blue-600 p-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xl hover:bg-blue-500 shadow-xl shadow-blue-900/30 uppercase tracking-tighter transition-all active:scale-95">
            <Phone size={24} /> {showKeypad ? "Fermer" : "Appel Manuel"}
          </button>

          {/* CLAVIER NUMÉRIQUE */}
          {showKeypad && (
            <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="bg-black/50 p-4 rounded-xl text-center text-3xl font-mono text-green-400 mb-4 border border-slate-800 tracking-widest">{phoneNumber || "---"}</div>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} className="bg-slate-800 p-5 rounded-xl hover:bg-blue-600 font-bold text-2xl transition-colors">{n}</button>
                ))}
              </div>
              <button onClick={() => setPhoneNumber("")} className="w-full mt-4 text-slate-500 hover:text-white underline text-sm uppercase font-bold">Effacer</button>
            </div>
          )}
        </div>

        {/* FORMULAIRE CENTRAL (PROSPECTS) */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 border-b border-slate-800/50 pb-6 text-blue-400 uppercase italic tracking-wider">
              <User className="text-white" /> Fiche Prospect : Jean Durand
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="space-y-6">
                  <div>
                    <label className="text-slate-500 text-xs font-black uppercase mb-2 block tracking-widest">Nom Complet</label>
                    <input type="text" defaultValue="JEAN DURAND" className="w-full bg-black/40 border border-slate-800 p-4 rounded-xl text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-black uppercase mb-2 block tracking-widest">Date de Naissance</label>
                    <input type="text" defaultValue="15/10/1988" className="w-full bg-black/40 border border-slate-800 p-4 rounded-xl text-white focus:border-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-black uppercase mb-2 block tracking-widest">Email Personnel</label>
                    <input type="email" defaultValue="m.elite@gmail.com" className="w-full bg-black/40 border border-slate-800 p-4 rounded-xl text-white focus:border-blue-500 outline-none" />
                  </div>
               </div>
               <div>
                  <label className="text-slate-500 text-xs font-black uppercase mb-2 block tracking-widest">Observations / Historique</label>
                  <textarea rows={9} className="w-full bg-black/40 border border-slate-800 p-4 rounded-xl text-white focus:border-blue-500 outline-none resize-none" placeholder="Notez ici les échanges..."></textarea>
               </div>
            </div>

            {/* QUALIFICATIONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-800/50">
               {["VENTE", "RAPPEL", "RDV PRIS", "NRP", "REFUS", "HORS CIBLE"].map(q => (
                 <button key={q} className="bg-slate-800 border border-slate-700 py-3 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:border-blue-400 transition-all uppercase tracking-tighter">{q}</button>
               ))}
            </div>

            {/* ACTIONS FINALES */}
            <div className="flex flex-col md:flex-row gap-4 mt-10">
              <div className="flex-1 flex items-center gap-3 bg-slate-800/50 p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
                <FileUp className="text-slate-400 group-hover:text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">IMPORTER EXCEL</span>
                  <input type="file" className="text-[10px] text-slate-500 cursor-pointer" />
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 min-w-[250px] transition-all hover:scale-105 active:scale-95 uppercase">
                <Save size={24} /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-blue-500 p-8 rounded-3xl max-w-md w-full relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => setShowCalendar(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-xl font-black mb-6 text-blue-400 italic">PLANIFIER UN RAPPEL</h3>
            <div className="space-y-4">
              <input type="date" className="w-full bg-black p-4 rounded-xl border border-slate-700" />
              <input type="time" className="w-full bg-black p-4 rounded-xl border border-slate-700" />
              <button onClick={() => {alert('RDV Enregistré'); setShowCalendar(false);}} className="w-full bg-blue-600 p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-all">Confirmer le RDV</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}