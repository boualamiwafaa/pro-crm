"use client";
import { useState, useRef } from "react";
import Papa from "papaparse";

export default function ProCrmApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leads, setLeads] = useState<any[]>([
    { id: 1, name: "Mohamed Elite", phone: "0600000000", status: "Nouveau" },
    { id: 2, name: "Jean Durand", phone: "0612345678", status: "Nouveau" }
  ]);
  const [activeLead, setActiveLead] = useState<any>(leads[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const imported = results.data.map((row: any, index: number) => ({
            id: index + 1,
            name: row.nom || row.name || "Client Inconnu",
            phone: row.telephone || row.phone || "0000000000",
            status: "Nouveau",
          }));
          setLeads(imported);
          setActiveLead(imported[0]);
        },
      });
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export_crm.csv");
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-[#0b0f1a] flex items-center justify-center p-6">
        <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl text-center">
          <h1 className="text-3xl font-black text-white mb-6 italic">ProCrm<span className="text-blue-500">.</span></h1>
          <button onClick={() => setIsLoggedIn(true)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all">ACCÉDER AU CRM</button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex overflow-hidden">
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5"><h1 className="font-black italic">ProCrm.</h1></div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-3 rounded-lg cursor-pointer text-[10px] font-bold uppercase ${activeLead.id === l.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
              {l.name}
            </div>
          ))}
        </div>
        <div className="p-4 bg-black/20 space-y-2">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase">📂 Importer</button>
          <button onClick={exportCSV} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase">📥 Exporter</button>
        </div>
      </aside>
      <section className="flex-1 p-12 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase">Fiche Client</span>
          <h2 className="text-8xl font-black italic tracking-tighter my-4">{activeLead?.name}</h2>
          <div className="text-4xl font-mono text-emerald-400 font-bold bg-emerald-400/10 px-6 py-2 rounded-2xl inline-block">{activeLead?.phone}</div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="mt-20 text-[9px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-widest">Déconnexion</button>
      </section>
    </main>
  );
}