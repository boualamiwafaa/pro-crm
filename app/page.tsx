"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { 
  User, ShieldCheck, Phone, MessageSquare, Save, Mail, 
  Calendar as CalendarIcon, MapPin, UserCircle, LayoutDashboard, 
  LogOut, FileSpreadsheet 
} from 'lucide-react';

export default function CRMPage() {
  const [role, setRole] = useState<'agent' | 'superviseur'>('agent');
  const [status, setStatus] = useState('APPEL EN COURS');
  const [formData, setFormData] = useState({
    nom: "JEAN DURAND",
    email: "m.elite@gmail.com",
    dateNaiss: "1988-10-15",
    adresse: "12 Rue de la Paix, Paris",
    notes: ""
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws) as any[];
      if (data.length > 0) {
        const f = data[0];
        setFormData({
          ...formData,
          nom: (f.Nom || f.nom || "Client Importé").toUpperCase(),
          email: f.Email || f.email || "",
          adresse: f.Adresse || f.adresse || "",
          dateNaiss: f.Date || f.date || ""
        });
        alert("📊 Données importées !");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2"><ShieldCheck className="text-blue-400" /> ProCrm.</h1>
        <nav className="space-y-4 flex-1">
          <div onClick={() => setRole('agent')} className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${role === 'agent' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><User size={20} /> Espace Agent</div>
          <div onClick={() => setRole('superviseur')} className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${role === 'superviseur' ? 'bg-purple-600' : 'hover:bg-slate-800'}`}><ShieldCheck size={20} /> Superviseur</div>
          <hr className="border-slate-700 my-4" />
          <Link href="/calendar" className="p-3 rounded-lg flex items-center gap-3 hover:bg-slate-800"><CalendarIcon size={20} /> Calendrier</Link>
          <Link href="/admin" className="p-3 rounded-lg flex items-center gap-3 hover:bg-slate-800"><LayoutDashboard size={20} /> Stats Admin</Link>
        </nav>
        <div className="pt-10 border-t border-slate-700 space-y-3">
          <button className="w-full bg-slate-800 p-3 rounded flex items-center gap-2 hover:bg-slate-700"><Phone size={18} /> Appel Manuel</button>
          <Link href="/login" className="w-full bg-red-900/20 text-red-400 p-3 rounded flex items-center gap-2 hover:bg-red-900/40"><LogOut size={18} /> Déconnexion</Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full text-white font-bold ${role === 'agent' ? 'bg-blue-600' : 'bg-purple-600'}`}>{role === 'agent' ? 'W' : 'M'}</div>
            <div><p className="text-sm text-slate-500">Session :</p><p className="font-bold">{role === 'agent' ? 'Wafaa Agent' : 'Mohamed Superviseur'}</p></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><UserCircle size={20}/> FICHE : {formData.nom}</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500 font-bold">{status}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={formData.nom} onChange={(e)=>setFormData({...formData, nom:e.target.value})} className="border p-2 rounded bg-slate-50" placeholder="Nom" />
              <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} className="border p-2 rounded bg-slate-50" placeholder="Email" />
              <textarea className="md:col-span-2 border p-2 rounded bg-slate-50" rows={4} placeholder="Observations..."></textarea>
            </div>
          </section>

          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
              <h3 className="font-bold mb-4">QUALIFICATIONS</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button onClick={()=>setStatus('VENTE ✅')} className="bg-green-600 text-white p-2 rounded font-bold">VENTE</button>
                <button onClick={()=>setStatus('REFUS')} className="bg-red-600 text-white p-2 rounded font-bold">REFUS</button>
              </div>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" />
              <label htmlFor="excel-upload" className="w-full bg-emerald-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-emerald-700 mb-3 shadow-lg"><FileSpreadsheet size={20} /> IMPORTER EXCEL</label>
              <button onClick={()=>alert('Sauvegardé')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">ENREGISTRER LA FICHE</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}