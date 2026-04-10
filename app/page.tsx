"use client";
import React, { useState, useRef } from "react";
import Papa from "papaparse";

export default function ProCrmApp() {
  // --- ÉTATS (Toutes les fonctionnalités sont ici) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("AGENT");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Liste des leads (Initialisée avec tes exemples)
  const [leads, setLeads] = useState<any[]>([
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678" },
  ]);

  const [activeLead, setActiveLead] = useState<any>(leads[0]);

  // --- FONCTION IMPORT (Lecture du fichier) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const imported = results.data.map((row: any, index: number) => ({
            id: Date.now() + index,
            name: row.nom || row.name || "Client Inconnu",
            phone: row.telephone || row.phone || "0000000000",
            status: "Nouveau",
          }));
          if (imported.length > 0) {
            setLeads(imported);
            setActiveLead(imported[0]);
            alert(`${imported.length} leads importés avec succès !`);
          }
        },
      });
    }
  };

  // --- FONCTION EXPORT (Téléchargement du fichier) ---
  const exportToCSV = () => {
    const csv = Papa.unparse(leads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "export_leads_crm.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PAGE DE CONNEXION ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6 antialiased">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-2xl mb-6 text-white">ST</div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">ProCrm<span className="text-blue-500">.</span></h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            <input required type="email" placeholder="Email" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500 font-bold" />
            <input required type="password" placeholder="Mot de passe" className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500 font-bold" />
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white uppercase italic transition-all active:scale-95">Se Connecter</button>
          </form>
        </div>
      </div>
    );
  }

  // --- INTERFACE CRM COMPLÈTE ---
  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden relative">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h1 className="font-black italic text-lg tracking-tighter text-white">ProCrm.</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-[8px] font-black text-rose-500 uppercase hover:underline">Quitter</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase px-2 mb-2 italic">Dossiers Clients ({leads.length})</p>
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-4 rounded-xl border transition-all cursor-pointer ${activeLead?.id === l.id ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-lg' : 'border-transparent text-slate-400 hover:bg-white/5'}`}>
              <p className="font-black text-[11px] uppercase tracking-tight">{l.name}</p>
              <p className="text-[9px] font-mono opacity-50">{l.phone}</p>
            </div>
          ))}
        </div>

        {/* ACTIONS IMPORT/EXPORT */}
        <div className="p-4 bg-black/20 border-t border-white/5 space-y-2">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-white/10">📂 Importer Liste</button>
          <button onClick={exportToCSV} className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-emerald-500/20">📥 Exporter Données</button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-3 flex justify-between items-center border-b border-white/5 bg-[#0b0f1a]">
          <nav className="flex gap-1 bg-[#111827] p-1 rounded-lg">
            <button onClick={() => setView("AGENT")} className={`px-5 py-2 rounded-md text-[9px] font-black uppercase transition-all ${view === 'AGENT' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-5 py-2 rounded-md text-[9px] font-black uppercase transition-all ${view === 'ARCHIVES' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowChat(!showChat)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${showChat ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-400'}`}>💬 Messagerie</button>
             <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
             <p className="text-[10px] font-black text-blue-400 uppercase italic">Wafaa Agent</p>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-[#111827] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-700"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-8">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Dossier en cours</span>
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.85] italic uppercase">
                      {activeLead?.name.split(' ')[0]}<br/><span className="text-blue-500">{activeLead?.name.split(' ')[1] || ""}</span>
                    </h2>
                    <div className="p-7 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] flex justify-between items-center shadow-inner group/phone cursor-pointer active:scale-95 transition-all">
                      <span className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{activeLead?.phone}</span>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full h-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-white outline-none focus:border-blue-500 text-xs italic shadow-inner min-h-[350px] transition-all" placeholder="Saisir les observations de l'appel ici..." />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => alert("Vente validée !")} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] font-black text-white uppercase italic text-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95">Vente ✅</button>
              <button onClick={() => setShowCalendar(true)} className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-white uppercase italic text-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95">Rappel 📅</button>
              <div className="mt-4 p-4 bg-white/5 rounded-[2rem] border border-white/5">
                <button onClick={() => alert("Absent")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all mb-2">Absent / NRP</button>
                <button onClick={() => alert("Barrage")} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">Barrage Sec</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 w-full max-w-xs text-center shadow-2xl animate-in fade-in zoom-in">
            <h2 className="text-2xl font-black mb-8 italic uppercase text-white tracking-tighter">Fixer Rappel</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-white font-bold text-sm mb-8 outline-none focus:border-blue-500 transition-all" />
            <div className="flex gap-3">
              <button onClick={()=>setShowCalendar(false)} className="flex-1 py-4 bg-slate-800 rounded-xl font-black uppercase text-[10px] text-white">Annuler</button>
              <button onClick={()=>setShowCalendar(false)} className="flex-1 py-4 bg-blue-600 rounded-xl font-black uppercase text-[10px] text-white shadow-lg shadow-blue-600/20">Valider</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT PANEL */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-[#111827] border-l border-white/10 z-50 transform transition-transform duration-500 shadow-2xl ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Messagerie Interne</p>
          <button onClick={() => setShowChat(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-500 hover:text-white transition-all">✕</button>
        </div>
        <div className="p-8 text-[11px] text-slate-500 italic text-center mt-20 font-medium">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-xl italic">!</div>
          Le chat en temps réel est en cours de maintenance par l'administrateur.
        </div>
      </aside>
    </main>
  );
}