"use client";
import React, { useState, useRef } from "react";

export default function ProCrmApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("AGENT");
  const [showDialer, setShowDialer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [manualNumber, setManualNumber] = useState("");
  const fileInputRef = useRef<any>(null);
  
  const [leads, setLeads] = useState<any[]>([
    { id: 1, name: "MOHAMED ELITE", phone: "0600000000", email: "m.elite@gmail.com", dob: "1988-10-15", address: "12 Rue de la Paix, Paris", note: "" },
    { id: 2, name: "JEAN DURAND", phone: "0712345678", email: "j.durand@outlook.fr", dob: "1995-02-20", address: "54 Avenue des Champs, Lyon", note: "" }
  ]);
  const [activeLead, setActiveLead] = useState<any>(leads[0]);

  if (!isLoggedIn) return (
    <div className="h-screen bg-[#0b0f1a] flex items-center justify-center">
      <button onClick={() => setIsLoggedIn(true)} className="bg-blue-600 px-20 py-8 rounded-[2rem] font-black text-4xl text-white uppercase italic shadow-[0_0_50px_rgba(37,99,235,0.3)]">Entrer dans le CRM</button>
    </div>
  );

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex overflow-hidden font-sans">
      <aside className="w-80 bg-[#111827] border-r border-white/5 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-black/20">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">ProCrm<span className="text-blue-500">.</span></h1>
          <p className="text-xs text-slate-500 font-bold uppercase mt-2 tracking-widest">Agent Connecté ✅</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${activeLead?.id === l.id ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
              <p className="font-black text-lg uppercase tracking-tight">{l.name}</p>
              <p className="text-sm font-mono opacity-60 mt-1">{l.phone}</p>
            </div>
          ))}
        </div>
        <div className="p-6 bg-black/40 border-t border-white/5 space-y-3">
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase">📂 Importer CSV</button>
          <button className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-black uppercase">📥 Exporter CSV</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-24 border-b border-white/10 flex items-center justify-between px-10 bg-[#0b0f1a]">
          <div className="flex gap-4">
            <button onClick={() => setView("AGENT")} className={`px-10 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all ${view === 'AGENT' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-slate-400'}`}>Agent</button>
            <button onClick={() => setView("SUPER")} className={`px-10 py-3 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all ${view === 'SUPER' ? 'bg-purple-600 text-white shadow-xl' : 'bg-white/5 text-slate-400'}`}>Superviseur</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowDialer(true)} className="bg-emerald-600 px-6 py-3 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-900/40">🎧 Appel Manuel</button>
            <button onClick={() => setShowChat(!showChat)} className="bg-slate-800 px-6 py-3 rounded-2xl font-black uppercase text-xs text-slate-300">💬 Chat</button>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10">
              <div className="col-span-8 space-y-8">
                <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/5 shadow-3xl">
                  <div className="flex justify-between items-start mb-12">
                    <h2 className="text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">{activeLead.name}</h2>
                    <div className="bg-emerald-500/10 border-2 border-emerald-500/30 px-10 py-6 rounded-[2.5rem]"><span className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">{activeLead.phone}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-blue-500 uppercase ml-4">Email</label>
                      <input type="text" defaultValue={activeLead.email} className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-blue-500 uppercase ml-4">Naissance</label>
                      <input type="date" defaultValue={activeLead.dob} className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-xl font-bold outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-xs font-black text-blue-500 uppercase ml-4">Adresse Postale</label>
                      <input type="text" defaultValue={activeLead.address} className="w-full bg-black/40 border-2 border-white/5 p-6 rounded-3xl text-xl font-bold outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest italic">Observations</h3>
                    <button onClick={() => alert("Enregistré")} className="bg-blue-600 px-8 py-3 rounded-xl font-black uppercase text-xs">💾 Enregistrer la fiche</button>
                  </div>
                  <textarea className="w-full bg-black/40 border-2 border-white/5 rounded-[2rem] p-8 text-lg italic min-h-[200px] outline-none" placeholder="Notes..." />
                </div>
              </div>
              <div className="col-span-4 space-y-4">
                <button onClick={() => alert("Vente validée")} className="w-full py-16 bg-emerald-600 hover:bg-emerald-500 rounded-[3rem] font-black text-white uppercase italic text-5xl shadow-2xl transition-all">VENTE ✅</button>
                <button onClick={() => alert("Rappel fixé")} className="w-full py-16 bg-blue-600 hover:bg-blue-500 rounded-[3rem] font-black text-white uppercase italic text-5xl shadow-2xl transition-all">RAPPEL 📅</button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-purple-600/10 border-2 border-purple-500/20 p-20 rounded-[4rem] text-center">
              <h2 className="text-6xl font-black uppercase italic">Dashboard Superviseur</h2>
            </div>
          )}
        </div>
      </div>

      {showDialer && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[300]">
          <div className="bg-[#111827] p-12 rounded-[4rem] border border-white/10 w-full max-w-md shadow-3xl">
            <div className="flex justify-between mb-10"><span className="text-emerald-400 font-black uppercase text-xs">Dialer Manuel</span><button onClick={() => setShowDialer(false)} className="text-4xl text-slate-600">✕</button></div>
            <div className="bg-black/60 p-8 rounded-3xl mb-10 border-2 border-white/5 h-32 flex items-center justify-center"><span className="text-6xl font-mono font-black text-emerald-400">{manualNumber || "00..."}</span></div>
            <div className="grid grid-cols-3 gap-6 mb-10">
              {["1","2","3","4","5","6","7","8","9","*","0","#"].map(n => (
                <button key={n} onClick={() => setManualNumber(p => p+n)} className="h-24 w-24 bg-white/5 hover:bg-white/10 rounded-full text-3xl font-black transition-all">{n}</button>
              ))}
            </div>
            <button onClick={() => {alert("Appel..."); setShowDialer(false)}} className="w-full py-8 bg-emerald-600 rounded-[2rem] font-black text-2xl uppercase italic shadow-xl">Appeler 📞</button>
            <button onClick={() => setManualNumber("")} className="w-full mt-4 text-xs font-black text-slate-500 uppercase">Effacer tout</button>
          </div>
        </div>
      )}

      <aside className={`fixed top-0 right-0 h-full w-[450px] bg-[#111827] border-l-2 border-white/10 z-[250] transform transition-transform duration-700 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/30"><p className="text-xl font-black text-blue-400 uppercase italic">Chat</p><button onClick={() => setShowChat(false)} className="text-3xl text-slate-500">✕</button></div>
        <div className="flex-1 p-8 space-y-6 overflow-y-auto italic text-xs text-slate-500">Superviseur : Bonjour Wafaa.</div>
        <div className="p-8 bg-black/40 border-t border-white/10 flex gap-4">
          <input type="text" placeholder="Répondre..." className="flex-1 bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4" />
          <button onClick={() => alert("Message envoyé")} className="bg-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs">Envoyer</button>
        </div>
      </aside>
    </main>
  );
}