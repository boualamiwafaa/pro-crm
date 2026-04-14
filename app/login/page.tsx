"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // L'outil pour changer de page
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter(); // On initialise le moteur de navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pour l'instant, on accepte n'importe quel login pour tester
    if (email && password) {
      router.push('/'); // Redirige vers la page principale du CRM
    } else {
      alert("Veuillez remplir les champs");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-blue-500 w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold text-white">ProCrm Login</h1>
          <p className="text-slate-400 text-sm">Accès réservé aux agents</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.setSelectionRange ? e.target.value : e.target.value)}
              placeholder="nom@agence.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            SE CONNECTER
          </button>
        </form>
      </div>
    </div>
  );
}