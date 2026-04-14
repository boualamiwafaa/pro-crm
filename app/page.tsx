"use client";
import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Save, LogOut, User, Shield, FileUp } from 'lucide-react';
import Link from 'next/link';

export default function CRMPage() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4">
      {/* HEADER FIXE */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-3">
          <button className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-500">
            <User size={18} /> Agent
          </button>
          <Link href="/admin" className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700">
            <Shield size={18} /> Superviseur
          </Link>
        </div>
        <Link href="/login" className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600/40">
          <LogOut size={18} /> Déconnexion
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* BARRE LATERALE GAUCHE */}
        <div className="space-y-3">
          <button onClick={() => alert('Calendrier à venir')} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:border-blue-500 transition-all text-blue-400 font-semibold">
            <Calendar size={20} /> Calendrier
          </button>
          <button onClick={() => alert('Chat bientôt disponible')} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:border-blue-500 transition-all text-blue-400 font-semibold">
            <MessageSquare size={20} /> Chat Équipe
          </button>
          <button onClick={() => setShowKeypad(!showKeypad)} className="w-full bg-blue-600 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-500 shadow-lg shadow-blue-900/20 uppercase tracking-wider">
            <Phone size={20} /> {showKeypad ? "Fermer Clavier" : "Appel Manuel"}
          </button>

          {/* CLAVIER NUMÉRIQUE */}
          {showKeypad && (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="bg-black p-3 rounded text-center text-2xl font-mono text-green-400 mb-4 border border-slate-800">{phoneNumber || "---"}</div>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 active:bg-blue-600 font-bold text-xl">{n}</button>
                ))}
              </div>
              <button onClick={() => setPhoneNumber("")} className="w-full mt-4 text-slate-500 text-sm hover:text-white underline">Effacer tout</button>
            </div>
          )}
        </div>

        {/* FORMULAIRE CENTRAL */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-slate-800 pb-4 text-blue-400 italic">
              FICHE CLIENT : JEAN DURAND
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Nom Complet</label>
                    <input type="text" defaultValue="JEAN DURAND" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Email</label>
                    <input type="email" defaultValue="m.elite@gmail.com" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" />
                  </div>
               </div>
               <div>
                  <label className="text-slate-500 text-xs font-bold uppercase mb-2 block">Commentaires / Détails</label>
                  <textarea rows={5} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white" placeholder="Notez ici les informations importantes..."></textarea>
               </div>
            </div>

            {/* QUALIFICATIONS ET IMPORT */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800">
               {["VENTE", "RAPPEL", "RDV PRIS", "REFUS"].map(q => (
                 <button key={q} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:border-blue-500 transition-colors uppercase">{q}</button>
               ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <div className="flex-1 flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-dashed border-slate-600">
                <FileUp className="text-slate-400" />
                <input type="file" className="text-xs text-slate-400 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 min-w-[200px]">
                <Save size={20} /> ENREGISTRER LA FICHE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}