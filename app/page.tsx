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
          if (imported.length > 0) {
            setLeads(imported);
            setActiveLead(imported[0]);
          }
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
          <h1 className="text-3xl font-black text-white mb-6 italic tracking-tighter">ProCrm<span className="text-blue-500">.</span></h1>
          <button onClick={() => setIsLoggedIn(true)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all uppercase italic">Accéder au CRM</button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-[#0b0f1a] text-white flex overflow-hidden font-sans">
      <aside className="w-64 bg-[#111827] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h1 className="font-black italic text-lg tracking-tighter">ProCrm.</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-[8px] font-black text-rose-500 uppercase">Quitter</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {leads.map((l) => (
            <div key={l.id} onClick={() => setActiveLead(l)} className={`p-3 rounded-lg cursor-pointer transition-all ${activeLead.id === l.id ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400' : 'text-slate-500 hover:bg-white/5 border border-transparent'}`}>
              <p className="font-black text-[10px] uppercase">{l.name}</p>
              <p className="text-[9px] font-mono opacity-50">{l.phone}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-black/20 border-t border-white/5 space-y-2">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full py-2.5 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-white/10">📂 Importer CSV</button>
          <button onClick={exportCSV} className="w-full py-2.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all border border-emerald-500/20">📥 Exporter CSV</button>
        </div>
      </aside>

      <section className="flex-1 p-12 flex flex-col items-center justify-center relative">
        <div className="text-center">
          <span className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase mb-4 block">Fiche Client Active</span>
          <h2 className="text-8xl font-black italic tracking-tighter leading-none mb-6">
            {activeLead?.name.split(' ')[0]}<br/>
            <span className="text-blue-500">{activeLead?.name.split(' ')[1] || ""}</span>
          </h2>
          <div className="text-4xl font-mono text-emerald-400 font-black bg-emerald-400/5 border border-emerald-500/20 px-8 py-4 rounded-[2rem] shadow-2xl inline-block">
            {activeLead?.phone}
          </div>
        </div>
      </section>
    </main>
  );
}