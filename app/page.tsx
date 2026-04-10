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
  ];

  const messages = [
    { id: 1, user: "Superviseur", text: "Wafaa, n'oublie pas de valider la vente.", time: "18:05" },
    { id: 2, user: "Moi", text: "Reçu !", time: "18:06" },
  ];

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR GAUCHE - REDUITE POUR GAGNER DE LA PLACE */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-xs">ST</div>
            <h1 className="font-black italic text-lg tracking-tighter">ProCrm.</h1>
          </div>
          <input type="text" placeholder="Leads..." className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 px-3 text-[10px] outline-none" />
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {leads.map((l) => (
            <div key={l.id} className="p-3 rounded-xl border border-transparent hover:bg-white/5 transition-all cursor-pointer">
              <p className="font-black text-[11px] text-slate-300">{l.name}</p>
              <p className="text-[9px] font-mono text-slate-500">{l.phone}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* ZONE CENTRALE */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-3 flex justify-between items-center bg-[#0b0f1a] border-b border-white/5">
          <nav className="flex gap-1 bg-[#111827] p-1 rounded-lg">
            <button onClick={() => setView("AGENT")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'AGENT' ? 'bg-blue-600' : 'text-slate-500'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'ARCHIVES' ? 'bg-purple-600' : 'text-slate-500'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowManualDial(true)} className="px-3 py-1.5 bg-slate-800 rounded-md text-[9px] font-black uppercase border border-white/5">Manuel</button>
            <p className="text-[10px] font-black text-blue-400 italic uppercase pr-2">Wafaa</p>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 space-y-4">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h2 className="text-5xl font-black text-white tracking-tighter italic">Mohamed<br/><span className="text-blue-500">Elite</span></h2>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
                        <span className="text-2xl font-mono font-black text-emerald-400">0600000000</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2 text-[10px] font-bold text-slate-400">
                        <p className="bg-white/5 p-3 rounded-lg border border-white/5 italic">📧 mohamed.test@email.com</p>
                        <p className="bg-white/5 p-3 rounded-lg border border-white/5 italic">📍 Paris, France</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-600/5 border border-blue-500/10 p-5 rounded-xl italic text-slate-400 text-[11px]">"Bonjour Mohamed..."</div>
                      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 text-xs italic" placeholder="Notes..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-4 bg-emerald-600 rounded-xl font-black text-white uppercase italic text-sm">Vente ✅</button>
                <button onClick={()=>setShowCalendar(true)} className="w-full py-4 bg-blue-600 rounded-xl font-black text-white uppercase italic text-sm">RDV 📅</button>
                <button onClick={()=>setShowCalendar(true)} className="w-full py-4 bg-orange-600 rounded-xl font-black text-white uppercase italic text-sm">Rappel ⏳</button>
                <button className="w-full py-2 bg-slate-800 rounded-lg text-[10px] font-black text-slate-500 uppercase mt-4">Refus ❌</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-black italic uppercase">🎙️ Journal Superviseur</h2>
              <div className="bg-[#111827] rounded-2xl border border-white/5 p-4">Enregistrements ici...</div>
            </div>
          )}
        </div>
      </div>

      {/* LE CHAT - MAINTENANT TOUJOURS VISIBLE SUR PC */}
      <aside className="w-72 bg-[#111827] border-l border-white/5 flex flex-col hidden xl:flex">
        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Chat Interne
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.user === 'Moi' ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-black text-slate-500 mb-1 uppercase">{m.user} • {m.time}</span>
              <div className={`p-2.5 rounded-xl text-[10px] max-w-[90%] ${m.user === 'Moi' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 border border-white/5'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-black/20 border-t border-white/5">
          <input 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            type="text" 
            placeholder="Message..." 
            className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg py-2 px-3 text-[10px] font-bold outline-none" 
          />
        </div>
      </aside>

      {/* MODALS IDENTIQUES */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/10 w-full max-w-xs text-center">
            <h2 className="text-lg font-black mb-4 italic uppercase text-white">Date de Rappel</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-3 rounded-lg text-white font-bold text-xs mb-4" />
            <button onClick={()=>setShowCalendar(false)} className="w-full py-3 bg-blue-600 rounded-xl font-black uppercase text-[10px]">Confirmer</button>
          </div>
        </div>
      )}
    </main>
  );
}