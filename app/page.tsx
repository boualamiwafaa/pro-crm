"use client";
import { useState } from "react";

export default function ProCrmApp() {
  const [view, setView] = useState("AGENT"); 
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false); // État pour le chat
  const [comment, setComment] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  // Simulation d'une petite base de données locale
  const [leads, setLeads] = useState([
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000", color: "text-blue-400" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678", color: "text-slate-300" },
    { id: 3, name: "Marie Leroy", status: "Rappel", phone: "0699887766", color: "text-slate-300" },
  ]);

  const [activeLead, setActiveLead] = useState(leads[0]);

  // Fonction pour changer le statut d'un client
  const handleStatusChange = (newStatus: string) => {
    alert(`Statut mis à jour : ${newStatus} pour ${activeLead.name}`);
    // Ici on pourra plus tard envoyer la donnée à Supabase
  };

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden relative">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">ST</div>
            <h1 className="font-black italic text-lg tracking-tighter">ProCrm.</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="text-[9px] font-black text-slate-500 uppercase px-2 mb-2">File d'attente</p>
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-3 rounded-xl border transition-all cursor-pointer ${activeLead.id === l.id ? 'bg-blue-600/10 border-blue-500/30' : 'border-transparent hover:bg-white/5'}`}>
              <p className={`font-black text-[11px] ${activeLead.id === l.id ? 'text-blue-400' : 'text-slate-300'}`}>{l.name}</p>
              <p className="text-[9px] font-mono text-slate-500">{l.phone}</p>
            </div>
          ))}
        </div>
        <button className="m-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase transition-all">📂 Import Excel</button>
      </aside>

      {/* ZONE CENTRALE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f1a]">
        <header className="p-3 flex justify-between items-center border-b border-white/5">
          <nav className="flex gap-1 bg-[#111827] p-1 rounded-lg">
            <button onClick={() => setView("AGENT")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'AGENT' ? 'bg-blue-600' : 'text-slate-500'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'ARCHIVES' ? 'bg-purple-600' : 'text-slate-500'}`}>Superviseur</button>
          </nav>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setShowManualDial(true)} className="px-3 py-1.5 bg-slate-800 rounded-md text-[9px] font-black uppercase">Clavier</button>
            <button onClick={() => setShowChat(!showChat)} className={`p-1.5 rounded-md transition-all ${showChat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              💬 <span className="text-[9px] font-black ml-1">CHAT</span>
            </button>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <p className="text-[10px] font-black text-blue-400 uppercase italic">Wafaa</p>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Client Actif</span>
                      <h2 className="text-5xl font-black text-white tracking-tighter italic leading-tight">{activeLead.name.split(' ')[0]}<br/><span className="text-blue-500">{activeLead.name.split(' ')[1]}</span></h2>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-emerald-500/10 transition-all">
                        <span className="text-2xl font-mono font-black text-emerald-400">{activeLead.phone}</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2 text-[10px] font-bold text-slate-500 italic">
                        <p className="flex items-center gap-2">📧 client@email.com</p>
                        <p className="flex items-center gap-2">📍 Adresse non renseignée</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full h-64 bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 text-xs italic shadow-inner" placeholder="Saisir le compte-rendu ici..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS BOUTONS */}
              <div className="flex flex-col gap-2">
                <button onClick={() => handleStatusChange("VENTE")} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-white uppercase italic text-sm shadow-lg shadow-emerald-500/10 transition-all">Vente ✅</button>
                <button onClick={() => setShowCalendar(true)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white uppercase italic text-sm shadow-lg shadow-blue-500/10 transition-all">RDV 📅</button>
                <button onClick={() => setShowCalendar(true)} className="w-full py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-black text-white uppercase italic text-sm shadow-lg shadow-orange-500/10 transition-all">Rappel ⏳</button>
                <div className="h-px bg-white/5 my-2"></div>
                <button onClick={() => handleStatusChange("NRP")} className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black text-slate-500 uppercase italic">NRP / Absent</button>
                <button onClick={() => handleStatusChange("REFUS")} className="w-full py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-lg text-[10px] font-black uppercase italic transition-all">Refus ❌</button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-10 bg-[#111827] rounded-[3rem] border border-white/5 text-center">
              <h2 className="text-2xl font-black italic uppercase text-purple-400 mb-4">Espace Superviseur</h2>
              <p className="text-slate-500 text-sm italic italic">Historique des appels et écoutes bientôt disponibles...</p>
            </div>
          )}
        </div>
      </div>

      {/* LE CHAT RETRACTABLE (A droite) */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-[#111827] border-l border-white/10 z-50 transform transition-transform duration-300 shadow-2xl flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Chat Interne</p>
          <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white text-xs">Fermer ✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col items-start">
            <span className="text-[8px] font-black text-slate-500 mb-1 uppercase">Superviseur</span>
            <div className="bg-white/5 p-2.5 rounded-xl text-[10px] text-slate-300 border border-white/5">Bienvenue sur le chat Wafaa !</div>
          </div>
        </div>
        <div className="p-3 bg-black/20 border-t border-white/5">
          <input type="text" placeholder="Écrire..." className="w-full bg-[#0b0f1a] border border-white/10 rounded-lg py-2 px-3 text-[10px] outline-none" />
        </div>
      </aside>

      {/* MODAL CALENDRIER */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/10 w-full max-w-xs text-center">
            <h2 className="text-lg font-black mb-4 italic uppercase text-white tracking-tighter">Fixer une date</h2>
            <input type="datetime-local" className="w-full bg-black/50 border border-white/5 p-3 rounded-lg text-white font-bold text-xs mb-4 outline-none focus:border-blue-500" />
            <div className="flex gap-2">
              <button onClick={()=>setShowCalendar(false)} className="flex-1 py-3 bg-slate-800 rounded-xl font-black uppercase text-[9px]">Annuler</button>
              <button onClick={()=>setShowCalendar(false)} className="flex-1 py-3 bg-blue-600 rounded-xl font-black uppercase text-[9px]">Valider</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLAVIER MANUEL */}
      {showManualDial && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/10 w-full max-w-xs text-center">
            <h2 className="text-lg font-black mb-6 italic uppercase text-white">Appel Manuel</h2>
            <input type="text" placeholder="06..." className="w-full bg-black/50 border border-white/5 p-4 rounded-xl text-3xl font-mono font-black text-emerald-400 text-center outline-none mb-4" />
            <div className="flex gap-2">
              <button onClick={()=>setShowManualDial(false)} className="flex-1 py-3 bg-slate-800 rounded-xl font-black uppercase text-[9px]">Fermer</button>
              <button onClick={()=>setShowManualDial(false)} className="flex-1 py-3 bg-emerald-600 rounded-xl font-black uppercase text-[9px]">Appeler</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}