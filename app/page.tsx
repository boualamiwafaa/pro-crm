"use client";
import { useState, useRef } from "react";
import Papa from "papaparse"; // On importe l'outil de lecture Excel/CSV

export default function ProCrmApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [view, setView] = useState("AGENT");
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notre liste de leads (commence par des exemples, puis sera remplacée par l'import)
  const [leads, setLeads] = useState([
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678" },
  ]);

  const [activeLead, setActiveLead] = useState(leads[0]);

  // FONCTION MAGIQUE : Lire le fichier Excel/CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // On transforme les données du fichier en format compatible avec notre CRM
          const importedLeads = results.data.map((row: any, index: number) => ({
            id: index + 1,
            name: row.nom || row.name || "Client Inconnu",
            phone: row.telephone || row.phone || "0000000000",
            status: "Nouveau",
          }));
          
          if (importedLeads.length > 0) {
            setLeads(importedLeads);
            setActiveLead(importedLeads[0]);
            alert(`${importedLeads.length} leads importés avec succès !`);
          }
        },
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6 antialiased">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-2xl mb-6">ST</div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">ProCrm<span className="text-blue-500">.</span></h1>
          </div>
          <form onSubmit={handleLogin} className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            <input required type="email" placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500" />
            <input required type="password" placeholder="Mot de passe" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500" />
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white uppercase italic">Se Connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden relative">
      
      {/* SIDEBAR AVEC IMPORT */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-black italic text-lg tracking-tighter">ProCrm.</h1>
            <button onClick={() => setIsLoggedIn(false)} className="text-[8px] font-black text-rose-500 uppercase">Quitter</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase px-2 mb-2">Leads ({leads.length})</p>
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-3 rounded-xl border transition-all cursor-pointer ${activeLead.id === l.id ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-400 hover:bg-white/5'}`}>
              <p className="font-black text-[11px] uppercase tracking-tight">{l.name}</p>
              <p className="text-[9px] font-mono opacity-50">{l.phone}</p>
            </div>
          ))}
        </div>

        {/* BOUTON IMPORTATION REEL */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all border border-white/10"
          >
            📂 Importer CSV
          </button>
        </div>
      </aside>

      {/* ZONE CENTRALE (Inchangée pour la fluidité) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-3 flex justify-between items-center border-b border-white/5 bg-[#0b0f1a]">
          <nav className="flex gap-1 bg-[#111827] p-1 rounded-lg">
            <button onClick={() => setView("AGENT")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'AGENT' ? 'bg-blue-600' : 'text-slate-500'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'ARCHIVES' ? 'bg-purple-600' : 'text-slate-500'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowChat(!showChat)} className={`p-1.5 rounded-md transition-all ${showChat ? 'bg-blue-600' : 'bg-slate-800'}`}>💬 <span className="text-[9px] font-black uppercase">Chat</span></button>
             <p className="text-[10px] font-black text-blue-400 uppercase italic">Wafaa</p>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-[#111827] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl italic tracking-tighter select-none">CRM</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Fiche active</span>
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.85] italic">
                      {activeLead.name.split(' ')[0]}<br/>
                      <span className="text-blue-500">{activeLead.name.split(' ')[1] || ""}</span>
                    </h2>
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex justify-between items-center group cursor-pointer">
                      <span className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{activeLead.phone}</span>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_emerald]"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <textarea className="w-full h-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-blue-500 text-xs italic shadow-inner min-h-[300px]" placeholder="Compte rendu d'appel..." />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button onClick={() => alert("Vente Enregistrée")} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-white uppercase italic text-xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95">Vente ✅</button>
              <button onClick={() => setShowCalendar(true)} className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase italic text-xl transition-all shadow-xl shadow-blue-500/10 active:scale-95">RDV 📅</button>
              <button onClick={() => alert("NRP")} className="w-full py-4 bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">NRP / Absent</button>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT ET MODALS (Inchangés) */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-[#111827] border-l border-white/10 z-50 transform transition-transform duration-500 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Chat Equipe</p>
          <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white">✕</button>
        </div>
      </aside>

      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 w-full max-w-xs text-center shadow-2xl animate-in zoom-in">
            <h2 className="text-xl font-black mb-6 italic uppercase text-white tracking-tighter">Fixer Date</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-white font-bold text-xs mb-6 outline-none" />
            <button onClick={()=>setShowCalendar(false)} className="w-full py-4 bg-blue-600 rounded-xl font-black uppercase text-[10px]">Confirmer</button>
          </div>
        </div>
      )}
    </main>
  );
}