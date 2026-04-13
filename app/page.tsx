"use client";
import React, { useState } from 'react';
import { User, ShieldCheck, Phone, MessageSquare, Save, Mail, Calendar, MapPin, UserCircle } from 'lucide-react';

export default function CRMPage() {
  const [role, setRole] = useState<'agent' | 'superviseur'>('agent');
  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 🚩 BARRE DE DIAGNOSTIC - À SUPPRIMER APRÈS LE TEST 🚩 */}
      <div className="fixed top-0 left-0 w-full h-2 bg-red-600 z-[9999]"></div>

      {/* Sidebar Latérale */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="text-blue-400" /> ProCrm.
        </h1>
        <nav className="space-y-4">
          <div className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${role === 'agent' ? 'bg-blue-600' : 'hover:bg-slate-800'}`} onClick={() => setRole('agent')}>
            <User size={20} /> Espace Agent
          </div>
          <div className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${role === 'superviseur' ? 'bg-purple-600' : 'hover:bg-slate-800'}`} onClick={() => setRole('superviseur')}>
            <ShieldCheck size={20} /> Superviseur
          </div>
        </nav>
        
        <div className="mt-10 pt-10 border-t border-slate-700">
          <button className="w-full bg-slate-800 p-3 rounded flex items-center gap-2 hover:bg-slate-700">
            <Phone size={18} /> Appel Manuel
          </button>
          <button className="w-full bg-slate-800 p-3 rounded flex items-center gap-2 mt-3 hover:bg-slate-700">
            <MessageSquare size={18} /> Chat Équipe
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 font-bold">W</div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Connecté en tant que :</p>
              <p className="font-bold uppercase">{role === 'agent' ? 'Wafaa Agent' : 'Mohamed Superviseur'} ✅</p>
            </div>
          </div>
          {role === 'superviseur' && (
            <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200 text-sm italic">
              "Wafaa, pense à bien valider les adresses mails"
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fiche Prospect */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between">
              <h2 className="font-bold flex items-center gap-2"><UserCircle size={20}/> FICHE PROSPECT : MOHAMED ELITE</h2>
              <span className="bg-green-500 text-xs px-2 py-1 rounded">APPEL EN COURS</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><User size={14}/> Nom complet</span>
                  <input type="text" defaultValue="JEAN DURAND" className="mt-1 block w-full border-slate-200 rounded-md bg-slate-50 p-2 border" />
                </label>
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Mail size={14}/> Email</span>
                  <input type="email" defaultValue="m.elite@gmail.com" className="mt-1 block w-full border-slate-200 rounded-md bg-slate-50 p-2 border" />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Calendar size={14}/> Date de Naissance</span>
                  <input type="date" defaultValue="1988-10-15" className="mt-1 block w-full border-slate-200 rounded-md bg-slate-50 p-2 border" />
                </label>
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><MapPin size={14}/> Adresse Postale</span>
                  <input type="text" defaultValue="12 Rue de la Paix, Paris" className="mt-1 block w-full border-slate-200 rounded-md bg-slate-50 p-2 border" />
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-slate-500 text-sm">Observations de l'appel</span>
                  <textarea rows={3} className="mt-1 block w-full border-slate-200 rounded-md bg-slate-50 p-2 border" placeholder="Saisir les observations ici..."></textarea>
                </label>
              </div>
            </div>
          </section>

          {/* Qualifications & Actions */}
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2">QUALIFICATIONS</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 font-bold shadow-sm">VENTE ✅</button>
                <button className="p-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 font-bold shadow-sm">RAPPEL 📅</button>
                <button className="p-2 text-sm rounded bg-amber-500 text-white hover:bg-amber-600 text-xs">RDV PRIS</button>
                <button className="p-2 text-sm rounded bg-slate-400 text-white hover:bg-slate-500">NRP</button>
                <button className="p-2 text-sm rounded bg-slate-200 text-slate-700 hover:bg-slate-300">HORS CIBLE</button>
                <button className="p-2 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 border border-red-200">BLOCTEL</button>
                <button className="p-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">REFUS</button>
              </div>
              
              <button  className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                <Save size={20} /> ENREGISTRER LA FICHE
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}