"use client";
import { useState } from "react";

export default function ProCrmApp() {
  const [view, setView] = useState("AGENT"); 
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [comment, setComment] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const leads = [
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678" },
    { id: 3, name: "Marie Leroy", status: "Rappel", phone: "0699887766" },
    { id: 4, name: "Arthur Kevin", status: "Nouveau", phone: "0755443322" },
  ];

  const messages = [
    { id: 1, user: "Superviseur", text: "Wafaa, n'oublie pas de valider la vente de Mohamed.", time: "17:45" },
    { id: 2, user: "Moi", text: "C'est en cours, je termine l'appel.", time: "17:46" },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR GAUCHE - LEADS */}
      <aside className="w-72 bg-[#111827] border-r border-white/5 flex flex-col hidden xl:flex">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20 text-white">ST</div>
            <h1 className="font-black italic text-xl tracking-tighter">ProCrm<span className="text-blue-500">.</span></h1>
          </div>
          <input type="text" placeholder="Rechercher..." className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-4 text-[10px] font-bold outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">File d'attente</p>
          {leads.map((l) => (
            <div key={l.id} className={`p-4 rounded-2xl border transition-all cursor-pointer group ${l.id === 1 ? 'bg-blue-600/10 border-blue-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
              <div className="flex justify-between items-start mb-1">
                <p className={`font-black text-xs italic ${l.id === 1 ? 'text-blue-400' : 'text-slate-300'}`}>{l.name}</p>
                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${l.status === 'Nouveau' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>{l.status}</span>
              </div>
              <p className="text-[9px] font-mono text-slate-500">{l.phone}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* ZONE CENTRALE */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 flex justify-between items-center bg-[#0b0f1a]/80 backdrop-blur-md border-b border-white/5">
          <nav className="flex gap-2 bg-[#111827] p-1 rounded-xl border border-white/5">
            <button onClick={() => setView("AGENT")} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${view === 'AGENT' ? 'bg-blue-600' : 'text-slate-500 hover:text-white'}`}>Poste Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${view === 'ARCHIVES' ? 'bg-purple-600' : 'text-slate-500 hover:text-white'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowManualDial(true)} className="px-4 py-2 bg-slate-800 rounded-lg text-[9px] font-black uppercase border border-white/5">⌨️ Clavier</button>
            <div className="text-right border-l border-white/10 pl-4">
              <p className="text-[10px] font-black text-blue-400 italic uppercase">Agent : Wafaa</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative min-h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Client en ligne</span>
                      <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9] italic">Mohamed<br/><span className="text-blue-500">Elite</span></h2>
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex justify-between items-center">
                        <span className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">0600000000</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_emerald]"></div>
                      </div>
                      <div className="space-y-2 text-[11px] font-bold italic text-slate-400">
                        <p className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2">📧 mohamed.test@email.com</p>
                        <p className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2">📍 Paris, France</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-2xl italic text-slate-400 text-xs leading-relaxed">
                        "Bonjour Mohamed, ravi de vous avoir..."
                      </div>
                      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full flex-1 bg-black/40 border border-white/5 rounded-[2rem] p-6 text-white outline-none focus:border-blue-500 transition-all resize-none shadow-inner text-sm italic" placeholder="Notes de l'appel..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] p-5 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-2">
                <h3 className="text-center text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Statut</h3>
                <button className="w-full py-5 bg-emerald-600 rounded-xl font-black text-white text-lg uppercase italic shadow-lg">Vente</button>
                <button onClick={()=>setShowCalendar(true)} className="w-full py-5 bg-blue-600 rounded-xl font-black text-white text-lg uppercase italic shadow-lg">RDV</button>
                <button onClick={()=>setShowCalendar(true)} className="w-full py-5 bg-orange-600 rounded-xl font-black text-white text-lg uppercase italic shadow-lg">Rappel</button>
                <div className="h-px bg-white/5 my-4"></div>
                <button className="w-full py-3 bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase border border-white/5">NRP</button>
                <button className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl font-black text-[10px] uppercase mt-4">Refus ❌</button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-6">🎙️ Enregistrements</h2>
              <div className="space-y-3">
                {leads.map((rec) => (
                  <div key={rec.id} className="bg-[#111827] p-6 rounded-[2rem] flex items-center justify-between border border-white/5 hover:border-purple-500/40 transition-all">
                    <div>
                      <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Aujourd'hui</p>
                      <p className="font-black text-white">{rec.name}</p>
                    </div>
                    <div className="h-10 w-48 bg-slate-900 rounded-xl flex items-center px-4 gap-3 border border-white/5">
                      <button className="text-purple-500 text-[10px]">▶️</button>
                      <div className="flex-1 h-0.5 bg-purple-500/20 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHAT DROIT (INTERNAL CHAT) */}
      <aside className="w-80 bg-[#111827] border-l border-white/5 flex flex-col hidden 2xl:flex">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Chat Interne
          </p>
          <span className="bg-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white">2</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.user === 'Moi' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-black text-slate-500 uppercase">{m.user}</span>
                <span className="text-[8px] text-slate-600 font-bold">{m.time}</span>
              </div>
              <div className={`p-3 rounded-2xl text-[11px] font-medium max-w-[90%] ${m.user === 'Moi' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-black/20 border-t border-white/5">
          <div className="relative">
            <input 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              type="text" 
              placeholder="Message..." 
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs font-bold outline-none focus:border-blue-500 transition-all" 
            />
            <button className="absolute right-3 top-2.5 text-blue-500 text-lg">🚀</button>
          </div>
        </div>
      </aside>

      {/* MODALS */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in zoom-in">
          <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm text-center">
            <h2 className="text-2xl font-black mb-6 italic uppercase text-white tracking-tighter text-white">Rappel</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-white font-bold outline-none mb-6 shadow-inner" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setShowCalendar(false)} className="py-4 bg-slate-800 rounded-xl font-black uppercase text-[10px]">Annuler</button>
              <button onClick={()=>setShowCalendar(false)} className="py-4 bg-blue-600 rounded-xl font-black uppercase text-[10px]">Valider</button>
            </div>
          </div>
        </div>
      )}

      {showManualDial && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in zoom-in">
          <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 w-full max-w-sm text-center">
            <h2 className="text-xl font-black mb-8 italic uppercase text-white">Numéro</h2>
            <input type="text" placeholder="06..." className="w-full bg-black/50 border border-white/5 p-6 rounded-2xl text-3xl font-mono font-black text-emerald-400 text-center outline-none mb-6 shadow-inner" />
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setShowManualDial(false)} className="py-4 bg-slate-800 rounded-xl font-black uppercase text-[10px]">Fermer</button>
              <button onClick={()=>setShowManualDial(false)} className="py-4 bg-emerald-600 rounded-xl font-black uppercase text-[10px]">Appeler</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}