"use client";
import { useState } from "react";

export default function ProCrmApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État de connexion
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  
  const [view, setView] = useState("AGENT"); 
  const [showManualDial, setShowManualDial] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [comment, setComment] = useState("");

  const [leads] = useState([
    { id: 1, name: "Mohamed Elite", status: "En cours", phone: "0600000000" },
    { id: 2, name: "Jean Durand", status: "Nouveau", phone: "0612345678" },
    { id: 3, name: "Marie Leroy", status: "Rappel", phone: "0699887766" },
  ]);

  const [activeLead, setActiveLead] = useState(leads[0]);

  // Fonction de connexion (Simulation)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
    } else {
      alert("Veuillez remplir les champs !");
    }
  };

  // --- PAGE DE CONNEXION ---
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6 antialiased">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-2xl shadow-blue-500/20 mb-6">ST</div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">ProCrm<span className="text-blue-500">.</span></h1>
            <p className="text-slate-500 mt-2 font-medium italic">Accès sécurisé - Portail Agent</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Professionnel</label>
              <input 
                required
                type="email" 
                placeholder="nom@votre-crm.com" 
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all font-bold"
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mot de passe</label>
              <input 
                required
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white outline-none focus:border-blue-500 transition-all font-bold"
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-white uppercase italic tracking-wider shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              Se Connecter
            </button>
            
            <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tight">Mot de passe oublié ? Contactez votre superviseur.</p>
          </form>
        </div>
      </div>
    );
  }

  // --- TON CRM (Le reste du code ne change pas) ---
  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex font-sans antialiased overflow-hidden relative">
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-xs italic">ST</div>
            <h1 className="font-black italic text-lg tracking-tighter">ProCrm.</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-[8px] font-black text-rose-500 hover:underline">DECONNEXION</button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-3 rounded-xl border transition-all cursor-pointer ${activeLead.id === l.id ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-400 hover:bg-white/5'}`}>
              <p className="font-black text-[11px]">{l.name}</p>
              <p className="text-[9px] font-mono opacity-50">{l.phone}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-3 flex justify-between items-center border-b border-white/5 bg-[#0b0f1a]">
          <nav className="flex gap-1 bg-[#111827] p-1 rounded-lg">
            <button onClick={() => setView("AGENT")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'AGENT' ? 'bg-blue-600' : 'text-slate-500'}`}>Agent</button>
            <button onClick={() => setView("ARCHIVES")} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase ${view === 'ARCHIVES' ? 'bg-purple-600' : 'text-slate-500'}`}>Superviseur</button>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowManualDial(true)} className="px-3 py-1.5 bg-slate-800 rounded-md text-[9px] font-black uppercase">Clavier</button>
            <button onClick={() => setShowChat(!showChat)} className={`p-1.5 rounded-md transition-all ${showChat ? 'bg-blue-600' : 'bg-slate-800'}`}>💬 <span className="text-[9px] font-black">CHAT</span></button>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <p className="text-[10px] font-black text-blue-400 uppercase italic underline underline-offset-4">Wafaa</p>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {view === "AGENT" ? (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Fiche Client Active</span>
                      <h2 className="text-6xl font-black text-white tracking-tighter leading-none italic">{activeLead.name.split(' ')[0]}<br/><span className="text-blue-500">{activeLead.name.split(' ')[1]}</span></h2>
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex justify-between items-center shadow-inner">
                        <span className="text-3xl font-mono font-black text-emerald-400">{activeLead.phone}</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full h-full bg-black/40 border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-blue-500 text-xs italic shadow-inner min-h-[250px]" placeholder="Saisir les remarques..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => alert("Vente validée")} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-white uppercase italic text-sm transition-all shadow-lg shadow-emerald-500/10">Vente ✅</button>
                <button onClick={() => setShowCalendar(true)} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase italic text-sm transition-all shadow-lg shadow-blue-500/10">RDV 📅</button>
                <button onClick={() => setShowCalendar(true)} className="w-full py-5 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-white uppercase italic text-sm transition-all shadow-lg shadow-orange-500/10">Rappel ⏳</button>
                <div className="h-px bg-white/5 my-4"></div>
                <button onClick={() => alert("NRP")} className="w-full py-3 bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase">NRP / Absent</button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-12 bg-[#111827] rounded-[3rem] border border-white/5 text-center">
              <h2 className="text-2xl font-black italic uppercase text-purple-400 mb-2">Espace Superviseur</h2>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Données de production en attente...</p>
            </div>
          )}
        </div>
      </div>

      <aside className={`fixed top-0 right-0 h-full w-80 bg-[#111827] border-l border-white/10 z-50 transform transition-transform duration-500 shadow-2xl flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Chat Equipe
          </p>
          <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
           <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
              <p className="text-[8px] font-black text-blue-500 uppercase mb-1">Superviseur</p>
              <p className="text-[11px] text-slate-300 italic">"Wafaa, bienvenue sur ton nouvel espace de travail."</p>
           </div>
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

      {showManualDial && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#111827] p-10 rounded-[3rem] border border-white/10 w-full max-w-xs text-center shadow-2xl animate-in zoom-in">
            <h2 className="text-xl font-black mb-6 italic uppercase text-white tracking-tighter">Composer</h2>
            <input type="text" placeholder="06..." className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl text-3xl font-mono font-black text-emerald-400 text-center outline-none mb-6 shadow-inner" />
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