"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // AJOUTÉ POUR LA NAVIGATION
import { 
  User, ShieldCheck, Phone, MessageSquare, Save, Mail, 
  Calendar as CalendarIcon, MapPin, UserCircle, LayoutDashboard, 
  LogOut, FileSpreadsheet, Ban, Clock, CheckCircle
} from 'lucide-react';

export default function CRMPage() {
  const router = useRouter(); // INITIALISATION
  const [role, setRole] = useState<'agent' | 'superviseur'>('agent');
  const [status, setStatus] = useState('APPEL EN COURS');

  // FONCTION DE DÉCONNEXION
  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 p-6 flex flex-col border-r border-slate-800">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-400"><ShieldCheck /> ProCrm.</h1>
        <nav className="space-y-4 flex-1">
          {/* Boutons de rôle - Ils changent maintenant l'état visuel */}
          <button onClick={() => setRole('agent')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${role === 'agent' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <User size={20} /> Espace Agent
          </button>
          
          <button onClick={() => {
              setRole('superviseur');
              router.push('/admin'); // Redirige vers l'admin si le dossier existe
            }} 
            className={`w-full p-3 rounded-lg flex items-center gap-3 ${role === 'superviseur' ? 'bg-purple-600' : 'hover:bg-slate-800'}`}>
            <ShieldCheck size={20} /> Superviseur
          </button>

          <hr className="border-slate-800 my-4" />
          
          <div onClick={() => router.push('/calendar')} className="p-3 rounded-lg flex items-center gap-3 text-slate-400 hover:bg-slate-800 cursor-pointer">
            <CalendarIcon size={20} /> Calendrier
          </div>
          <div className="p-3 rounded-lg flex items-center gap-3 text-slate-400 hover:bg-slate-800 cursor-pointer">
            <MessageSquare size={20} /> Chat Équipe
          </div>
        </nav>

        {/* BOUTON DÉCONNEXION RÉPARÉ */}
        <button 
          onClick={handleLogout}
          className="mt-10 w-full bg-red-900/20 text-red-400 p-3 rounded flex items-center gap-2 hover:bg-red-900/40 transition-colors">
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-900 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header Session */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-700 mb-8 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full font-bold">W</div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Session active</p>
                  <p className="font-bold text-lg text-white">Wafaa Agent • <span className="text-green-500 text-sm italic">EN LIGNE</span></p>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg">
                  <Phone size={18}/> Appel Manuel
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
                  <h2 className="font-bold flex items-center gap-2"><UserCircle className="text-blue-400" /> FICHE : JEAN DURAND</h2>
                  <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold animate-pulse">{status}</span>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase">Nom complet</label>
                    <input type="text" defaultValue="JEAN DURAND" className="w-full bg-slate-900 border-b border-slate-700 p-2 text-white outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase">Date de Naissance</label>
                    <input type="text" defaultValue="15/10/1988" className="w-full bg-slate-900 border-b border-slate-700 p-2 text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 uppercase">Email</label>
                    <input type="text" defaultValue="m.elite@gmail.com" className="w-full bg-slate-900 border-b border-slate-700 p-2 text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 uppercase">Observations</label>
                    <textarea className="w-full bg-slate-900 border border-slate-700 p-2 rounded mt-1 h-32 text-white outline-none focus:border-blue-500" placeholder="Détails de l'échange..."></textarea>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                <h3 className="font-bold text-center mb-4 uppercase tracking-widest text-sm text-slate-400">Qualifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setStatus('VENTE ✅')} className="bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 transition-transform active:scale-95">VENTE</button>
                  <button onClick={() => setStatus('RAPPEL 📞')} className="bg-blue-500 text-white p-3 rounded font-bold hover:bg-blue-600 transition-transform active:scale-95">RAPPEL</button>
                  <button onClick={() => setStatus('RDV PRIS 📅')} className="bg-amber-500 text-white p-3 rounded font-bold hover:bg-amber-600 transition-transform active:scale-95">RDV PRIS</button>
                  <button onClick={() => setStatus('NRP')} className="bg-slate-600 text-white p-3 rounded font-bold hover:bg-slate-700 transition-transform active:scale-95">NRP</button>
                  <button onClick={() => setStatus('HORS CIBLE')} className="bg-slate-700 text-white p-3 rounded font-bold hover:bg-slate-600 text-xs transition-transform active:scale-95">HORS CIBLE</button>
                  <button onClick={() => setStatus('REFUS ❌')} className="bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700 transition-transform active:scale-95">REFUS</button>
                  <button onClick={() => setStatus('BLOCTEL')} className="bg-black text-white p-3 rounded font-bold col-span-2 hover:bg-slate-900 transition-transform active:scale-95 border border-slate-700">BLOCTEL / DNC</button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                  <label className="w-full bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-emerald-700 transition-colors">
                    <FileSpreadsheet size={18} /> IMPORTER EXCEL
                    <input type="file" className="hidden" accept=".xlsx, .xls" />
                  </label>
                  <button onClick={() => alert('Fiche enregistrée !')} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-500 flex items-center justify-center gap-2 transition-all">
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