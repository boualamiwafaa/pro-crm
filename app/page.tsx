"use client";
import { useState } from "react";

export default function ProCrmApp() {
  const [view, setView] = useState("AGENT"); 
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [comment, setComment] = useState("");

  const leads = [
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678" },
    { id: 3, name: "Marie Leroy", status: "Rappel", phone: "0699887766" },
    { id: 4, name: "Arthur Kevin", status: "Nouveau", phone: "0755443322" },
  ];

  const activeLead = {
    first_name: "Mohamed",
    last_name: "Elite",
    phone: "0600000000",
    email: "mohamed.test@email.com",
    address: "123 Rue de la Réussite, Paris"
  };

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white flex font-sans antialiased">
      
      {/* SIDEBAR GAUCHE - LISTE DES LEADS */}
      <aside className="w-80 bg-[#111827] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">ST</div>
            <h1 className="font-black italic text-xl tracking-tighter">ProCrm<span className="text-blue-500">.</span></h1>
          </div>
          <div className="relative">
            <input type="text" placeholder="Rechercher lead..." className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">File d'attente (4)</p>
          {leads.map((l) => (
            <div key={l.id} className={`p-4 rounded-2xl border transition-all cursor-pointer group ${l.id === 1 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
              <div className="flex justify-between items-start mb-1">
                <p className={`font-black text-sm italic ${l.id === 1 ? 'text-blue-400' : 'text-slate-300'}`}>{l.name}</p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${l.status === 'Nouveau' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>{l.status}</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">{l.phone}</p>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-black/20 border-t border-white/5">
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">📂 Importer Fichier</button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="p-6 flex justify-between items-center bg-[#0b0f1a]/80 backdrop-blur-md border-b border-white/5">
          <nav className="flex gap-2 bg-[#111827] p-1 rounded-xl border border-white/5">
            <button onClick={() => setView("AGENT")} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'AGENT' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'ARCHIVES' ? 'bg-purple-600 shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-white'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowManualDial(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black uppercase border border-white/5 transition-all">⌨️ Manuel</button>
            <div className="text-right border-l border-white/10 pl-4">
              <p className="text-[11px] font-black text-blue-400 italic uppercase underline underline-offset-4 tracking-wider">Wafaa</p>
            </div>
          </div>
        </header>

        {/* CONTENU AGENT */}
        <div className="p-8 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative min-h-[550px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Fiche Lead active</span>
                        <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] mt-2 italic">{activeLead.first_name}<br/><span className="text-blue-500">{activeLead.last_name}</span></h2>
                      </div>
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex justify-between items-center">
                        <span className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{activeLead.phone}</span>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_emerald]"></div>
                      </div>
                      <div className="space-y-3 font-bold italic text-slate-400 text-sm">
                        <p className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">📧 {activeLead.email}</p>
                        <p className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">📍 {activeLead.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2rem] italic text-slate-400 leading-relaxed shadow-sm">
                        "Bonjour Mohamed, je suis Wafaa de chez Elite..."
                      </div>
                      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-blue-500 transition-all resize-none shadow-inner italic" placeholder="Saisir les remarques importantes..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* QUALIFICATIONS */}
              <div className="flex flex-col gap-3">
                <div className="bg-[#111827] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-3">
                  <h3 className="text-center text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Décision Agent</h3>
                  <button onClick={()=>alert("Vente OK")} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg transition-all active:scale-95">Vente ✅</button>
                  <button onClick={()=>setShowCalendar(true)} className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg transition-all active:scale-95">RDV 📅</button>
                  <button onClick={()=>setShowCalendar(true)} className="w-full py-6 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-white text-xl uppercase italic shadow-lg transition-all active:scale-95">Rappel ⏳</button>
                  <div className="h-px bg-white/5 my-4"></div>
                  <button onClick={()=>alert("NRP")} className="w-full py-4 bg-slate-800 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest border border-white/5">NRP / Absent</button>
                  <button onClick={()=>alert("Refus")} className="w-full py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl font-black text-[11px] uppercase mt-4 transition-all">Refus ❌</button>
                </div>
              </div>
            </div>
          ) : (
            /* ARCHIVES SUPERVISEUR */
            <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-10">🎙️ Contrôle Qualité</h2>
              <div className="bg-[#111827] rounded-[3rem] border border-white/5 p-4 space-y-4 shadow-2xl">
                {leads.map((rec) => (
                  <div key={rec.id} className="bg-black/30 p-8 rounded-[2rem] flex items-center justify-between group hover:border-purple-500/40 border border-transparent transition-all">
                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">10/04/2026</p>
                      <p className="text-xl font-black text-white">{rec.name}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-64 bg-slate-900 rounded-2xl flex items-center px-6 gap-4 border border-white/5 shadow-inner">
                        <button className="text-purple-500">▶️</button>
                        <div className="flex-1 h-1 bg-purple-500/20 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-purple-500"></div></div>
                      </div>
                      <button className="p-3 bg-white/5 hover:bg-purple-600 rounded-xl transition-all border border-white/5">📥</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS REUTILISABLES */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/10 w-full max-w-md text-center shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-8 italic uppercase text-white tracking-tighter">Planification</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-6 rounded-[2.5rem] text-white font-black text-xl outline-none focus:border-blue-500 mb-8" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={()=>setShowCalendar(false)} className="py-5 bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest">Annuler</button>
              <button onClick={()=>setShowCalendar(false)} className="py-5 bg-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/30">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showManualDial && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/10 w-full max-w-md text-center">
            <h2 className="text-2xl font-black mb-10 italic uppercase tracking-tighter">Composition</h2>
            <input type="text" placeholder="06..." className="w-full bg-black/50 border border-white/5 p-8 rounded-[2.5rem] text-4xl font-mono font-black text-emerald-400 text-center outline-none focus:border-emerald-500 mb-8" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={()=>setShowManualDial(false)} className="py-5 bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest">Fermer</button>
              <button onClick={()=>setShowManualDial(false)} className="py-5 bg-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/30">Appeler 📞</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}