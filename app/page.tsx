"use client";
import React, { useState } from 'react';
import { 
  User, ShieldCheck, Phone, MessageSquare, Save, Mail, 
  Calendar as CalendarIcon, MapPin, UserCircle, LayoutDashboard, 
  LogOut, FileSpreadsheet, Ban, Clock, CheckCircle
} from 'lucide-react';

export default function CRMPage() {
  const [role, setRole] = useState<'agent' | 'superviseur'>('agent');
  const [status, setStatus] = useState('APPEL EN COURS');

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar - Design Sombre */}
      <aside className="w-64 bg-slate-950 p-6 flex flex-col border-r border-slate-800">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-400"><ShieldCheck /> ProCrm.</h1>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setRole('agent')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${role === 'agent' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}><User size={20} /> Espace Agent</button>
          <button onClick={() => setRole('superviseur')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${role === 'superviseur' ? 'bg-purple-600' : 'hover:bg-slate-800'}`}><ShieldCheck size={20} /> Superviseur</button>
          <hr className="border-slate-800 my-4" />
          <div className="p-3 rounded-lg flex items-center gap-3 text-slate-400 hover:bg-slate-800 cursor-pointer"><CalendarIcon size={20} /> Calendrier</div>
          <div className="p-3 rounded-lg flex items-center gap-3 text-slate-400 hover:bg-slate-800 cursor-pointer"><MessageSquare size={20} /> Chat Équipe</div>
        </nav>
        <button className="mt-10 w-full bg-red-900/20 text-red-400 p-3 rounded flex items-center gap-2 hover:bg-red-900/40"><LogOut size={18} /> Déconnexion</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50 text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full font-bold">W</div>
                <div><p className="text-xs text-slate-500 uppercase tracking-wider">Session active</p><p className="font-bold text-lg">Wafaa Agent • <span className="text-green-500 text-sm">EN LIGNE</span></p></div>
             </div>
             <div className="flex gap-2">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Phone size={18}/> Appel Manuel</button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fiche Client */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-4 text-white flex justify-between">
                  <h2 className="font-bold flex items-center gap-2"><UserCircle /> FICHE : JEAN DURAND</h2>
                  <span className="bg-blue-500 px-3 py-1 rounded text-xs font-bold">{status}</span>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-400 uppercase">Nom complet</label><input type="text" defaultValue="JEAN DURAND" className="w-full border-b p-2 focus:border-blue-500 outline-none" /></div>
                  <div><label className="text-xs text-slate-400 uppercase">Date de Naissance</label><input type="text" defaultValue="15/10/1988" className="w-full border-b p-2 outline-none" /></div>
                  <div className="col-span-2"><label className="text-xs text-slate-400 uppercase">Email</label><input type="text" defaultValue="m.elite@gmail.com" className="w-full border-b p-2 outline-none" /></div>
                  <div className="col-span-2"><label className="text-xs text-slate-400 uppercase">Observations</label><textarea className="w-full border p-2 rounded mt-1 h-32" placeholder="Détails de l'échange..."></textarea></div>
                </div>
              </section>
            </div>

            {/* Qualifications - Tous les boutons ici */}
            <aside className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="font-bold text-center mb-4 uppercase tracking-widest text-sm">Qualifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setStatus('VENTE ✅')} className="bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">VENTE</button>
                  <button onClick={() => setStatus('RAPPEL 📞')} className="bg-blue-500 text-white p-3 rounded font-bold hover:bg-blue-600">RAPPEL</button>
                  <button onClick={() => setStatus('RDV PRIS 📅')} className="bg-amber-500 text-white p-3 rounded font-bold hover:bg-amber-600">RDV PRIS</button>
                  <button onClick={() => setStatus('NRP')} className="bg-slate-400 text-white p-3 rounded font-bold hover:bg-slate-500">NRP</button>
                  <button onClick={() => setStatus('HORS CIBLE')} className="bg-slate-600 text-white p-3 rounded font-bold hover:bg-slate-700 text-xs">HORS CIBLE</button>
                  <button onClick={() => setStatus('REFUS ❌')} className="bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">REFUS</button>
                  <button onClick={() => setStatus('BLOCTEL')} className="bg-black text-white p-3 rounded font-bold col-span-2 hover:bg-slate-800">BLOCTEL / DNC</button>
                </div>
                
                <div className="mt-6 pt-6 border-t space-y-3">
                  <label className="w-full bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-emerald-700">
                    <FileSpreadsheet size={18} /> IMPORTER EXCEL
                    <input type="file" className="hidden" accept=".xlsx, .xls" />
                  </label>
                  <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2">
                    <Save size={18} /> ENREGISTRER LA FICHE
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}