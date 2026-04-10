"use client";

import { useState } from "react";

export default function ProCrmApp() {
  const [view, setView] = useState("AGENT"); 
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [comment, setComment] = useState("");

  const activeLead = {
    first_name: "Mohamed test",
    last_name: "Elite",
    phone: "0600000000",
    email: "mohamed.test@email.com",
    address: "123 Rue de la Réussite, Paris"
  };

  const recordings = [
    { id: 1, date: "10/04/2026 14:20", client: "Jean Durand", duration: "04:12", status: "Vente ✅" },
    { id: 2, date: "09/04/2026 11:45", client: "Marie Leroy", duration: "02:45", status: "Rappel ⏳" },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white p-6 font-sans antialiased">
      
      {/* HEADER PREMIUM */}
      <header className="max-w-[1600px] mx-auto mb-6 flex justify-between items-center bg-[#111827]/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">ST</div>
            <h1 className="font-black italic text-2xl tracking-tighter">ProCrm<span className="text-blue-500">.</span></h1>
          </div>
          <nav className="flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setView("AGENT")} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'AGENT' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              Poste Agent
            </button>
            <button 
              onClick={() => setView("ARCHIVES")} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'ARCHIVES' ? 'bg-purple-600 shadow-lg shadow-purple-500/30' : 'text-slate-500 hover:text-white'}`}
            >
              🎙️ Pôle Superviseur
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowManualDial(true)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase border border-white/5 transition-all">⌨️ Appel Manuel</button>
          <div className="border-l border-white/10 pl-6 text-right">
            <p className="text-[12px] font-black text-blue-400 italic underline underline-offset-4 uppercase tracking-wider">Agent : Wafaa</p>
          </div>
        </div>
      </header>

      {/* VUE AGENT PRINCIPALE */}
      {view === "AGENT" && (
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/5 shadow-2xl min-h-[550px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Prospect en ligne</span>
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mt-2">{activeLead.first_name}<br/><span className="text-blue-500">{activeLead.last_name}</span></h2>
                  </div>
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex justify-between items-center shadow-inner">
                    <span className="text-4xl font-mono font-black text-emerald-400">{activeLead.phone}</span>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_emerald]"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 italic font-bold">📧 {activeLead.email}</div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 italic font-bold">📍 {activeLead.address}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2rem] italic text-slate-400 leading-relaxed shadow-sm">
                    "Bonjour {activeLead.first_name}, je suis Wafaa de chez Elite. Je vous contacte concernant votre demande..."
                  </div>
                  <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    className="w-full flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-blue-500 transition-all resize-none shadow-inner text-lg italic" 
                    placeholder="Notes de l'appel..." 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE QUALIFICATIONS */}
          <div className="bg-[#111827] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-3">
            <h3 className="text-center text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Qualification Finale</h3>
            <button onClick={() => alert("Vente enregistrée !")} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg active:scale-95 transition-all">Vente ✅</button>
            <button onClick={() => setShowCalendar(true)} className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg active:scale-95 transition-all">Rendez-vous 📅</button>
            <button onClick={() => setShowCalendar(true)} className="w-full py-6 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg active:scale-95 transition-all">Rappel ⏳</button>
            
            <div className="h-px bg-white/5 my-4"></div>
            
            <button onClick={() => alert("Statut NRP")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-white/5 transition-all">NRP / Absent</button>
            <button onClick={() => alert("Statut Hors Cible")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-white/5 transition-all">Hors Cible</button>
            <button onClick={() => alert("Refus Définitif")} className="w-full py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl font-black text-[11px] uppercase tracking-widest mt-4 transition-all">Refus Définitif ❌</button>
          </div>
        </div>
      )}

      {/* VUE PÔLE SUPERVISEUR (ARCHIVES) */}
      {view === "ARCHIVES" && (
        <div className="max-w-[1200px] mx-auto bg-[#111827] rounded-[3rem] border border-white/5 p-12 shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white flex items-center gap-5">
              <span className="text-5xl text-purple-500">🎙️</span> Pôle Superviseur
            </h2>
            <div className="px-6 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">Contrôle Qualité Actif</div>
          </div>
          <div className="space-y-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-purple-500/40 transition-all duration-300">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{rec.date}</p>
                  <p className="text-2xl font-black text-white">{rec.client}</p>
                  <p className="text-[10px] font-black text-emerald-500 italic uppercase tracking-widest mt-1">{rec.status}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-14 w-80 bg-slate-900 rounded-2xl flex items-center px-6 gap-4 border border-white/5 shadow-inner">
                    <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-[10px] shadow-lg shadow-purple-900/40 hover:scale-110 transition-transform">▶️</button>
                    <div className="flex-1 flex gap-0.5 items-end h-6">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="flex-1 bg-purple-500/30 rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                      ))}
                    </div>
                  </div>
                  <button className="p-4 bg-white/5 hover:bg-purple-600 rounded-2xl transition-all border border-white/5 shadow-sm">📥</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CALENDRIER (PLANIFICATION) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/10 w-full max-w-md text-center shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-blue-500/20 border-4 border-[#0b0f1a]">📅</div>
            <h2 className="text-3xl font-black mb-2 italic uppercase text-white tracking-tighter">Planification</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-10">Choisir une date de rappel</p>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-6 rounded-[2.5rem] text-white font-black text-xl outline-none focus:border-blue-500 transition-all mb-8 shadow-inner" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowCalendar(false)} className="py-5 bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">Annuler</button>
              <button onClick={() => { alert("Rendez-vous planifié !"); setShowCalendar(false); }} className="py-5 bg-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-500">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APPEL MANUEL */}
      {showManualDial && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/10 w-full max-w-md text-center">
            <h2 className="text-2xl font-black mb-10 italic uppercase tracking-tighter text-white">Composition manuelle</h2>
            <input type="text" placeholder="06 -- -- -- --" className="w-full bg-black/50 border border-white/5 p-8 rounded-[2.5rem] text-4xl font-mono font-black text-emerald-400 text-center outline-none focus:border-emerald-500 mb-8 shadow-inner" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowManualDial(false)} className="py-5 bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Fermer</button>
              <button onClick={() => { alert("Appel en cours..."); setShowManualDial(false); }} className="py-5 bg-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/30 transition-all">Appeler 📞</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}