"use client";
import React, { useState } from 'react';
import { User, ShieldCheck, Phone, MessageSquare, Save, Mail, Calendar, MapPin, UserCircle, CheckCircle } from 'lucide-react';

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

  const handleSave = () => {
    // Simulation d'enregistrement
    alert(`✅ Fiche de ${formData.nom} enregistrée !\nStatut final : ${status}`);
    console.log("Données prêtes pour Excel/Base de données :", { ...formData, status });
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Latérale */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="text-blue-400" /> ProCrm.
        </h1>
        <nav className="space-y-4 flex-1">
          <div 
            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${role === 'agent' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-800'}`} 
            onClick={() => setRole('agent')}
          >
            <User size={20} /> Espace Agent
          </div>
          <div 
            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${role === 'superviseur' ? 'bg-purple-600 shadow-lg' : 'hover:bg-slate-800'}`} 
            onClick={() => setRole('superviseur')}
          >
            <ShieldCheck size={20} /> Superviseur
          </div>
        </nav>
        
        <div className="pt-10 border-t border-slate-700 space-y-3">
          <button className="w-full bg-slate-800 p-3 rounded flex items-center gap-2 hover:bg-slate-700 transition-colors">
            <Phone size={18} /> Appel Manuel
          </button>
          <button className="w-full bg-slate-800 p-3 rounded flex items-center gap-2 hover:bg-slate-700 transition-colors">
            <MessageSquare size={18} /> Chat Équipe
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full text-white font-bold ${role === 'agent' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {role === 'agent' ? 'W' : 'M'}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Session active :</p>
              <p className="font-bold uppercase tracking-tight">
                {role === 'agent' ? 'Wafaa Agent' : 'Mohamed Superviseur'} 
                <span className="ml-2 text-green-500 text-xs">● EN LIGNE</span>
              </p>
            </div>
          </div>
          {role === 'superviseur' && (
            <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200 text-sm italic animate-pulse">
              "Wafaa, pense à bien valider les adresses mails"
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fiche Prospect */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 tracking-wide">
                <UserCircle size={20} className="text-blue-400"/> FICHE : {formData.nom}
              </h2>
              <span className={`text-xs px-3 py-1 rounded-full font-bold animate-pulse ${status === 'VENTE ✅' ? 'bg-green-600' : 'bg-blue-500'}`}>
                {status}
              </span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2 mb-1"><User size={14}/> Nom complet</span>
                  <input 
                    type="text" 
                    value={formData.nom} 
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="mt-1 block w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </label>
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2 mb-1"><Mail size={14}/> Email</span>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2 mb-1"><Calendar size={14}/> Date de Naissance</span>
                  <input 
                    type="date" 
                    value={formData.dateNaiss}
                    onChange={(e) => setFormData({...formData, dateNaiss: e.target.value})}
                    className="mt-1 block w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </label>
                <label className="block">
                  <span className="text-slate-500 text-sm flex items-center gap-2 mb-1"><MapPin size={14}/> Adresse Postale</span>
                  <input 
                    type="text" 
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    className="mt-1 block w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-slate-500 text-sm mb-1 block font-medium">Observations de l'appel</span>
                  <textarea 
                    rows={4} 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="mt-1 block w-full border-slate-200 rounded-lg bg-slate-50 p-2.5 border focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="Détails de l'échange..."
                  ></textarea>
                </label>
              </div>
            </div>
          </section>

          {/* Qualifications & Actions */}
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold mb-4 flex items-center gap-2 border-b pb-2 text-slate-700">QUALIFICATIONS</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateStatus('VENTE ✅')} className="p-3 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow-md transition-all active:scale-95">VENTE ✅</button>
                <button onClick={() => updateStatus('RAPPEL 📅')} className="p-3 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-bold shadow-md transition-all active:scale-95">RAPPEL 📅</button>
                <button onClick={() => updateStatus('RDV PRIS')} className="p-2 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-bold transition-all">RDV PRIS</button>
                <button onClick={() => updateStatus('NRP')} className="p-2 text-sm rounded-lg bg-slate-400 text-white hover:bg-slate-500 font-bold">NRP</button>
                <button onClick={() => updateStatus('HORS CIBLE')} className="p-2 text-sm rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300">HORS CIBLE</button>
                <button onClick={() => updateStatus('REFUS')} className="p-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold transition-all active:scale-95">REFUS</button>
              </div>
              
              <button 
                onClick={handleSave}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl font-bold group"
              >
                <Save size={20} className="group-hover:animate-bounce" /> ENREGISTRER LA FICHE
              </button>
            </div>

            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-lg font-bold mb-1">Objectif Hebdo</h4>
                 <p className="text-blue-100 text-sm mb-4">8/15 ventes réalisées</p>
                 <div className="w-full bg-blue-400 rounded-full h-2">
                   <div className="bg-white h-2 rounded-full w-[53%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                 </div>
               </div>
               <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-20" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}