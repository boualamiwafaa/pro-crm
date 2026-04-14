"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation de connexion
    if (email && password) {
      router.push('/'); 
    } else {
      alert("Veuillez remplir les champs");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-slate-200">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck className="text-blue-500 w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold text-white italic">ProCrm Login</h1>
          <p className="text-slate-400 text-sm">Accès réservé aux agents</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              // CORRECTION ICI : Simplification du onChange
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@agence.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/40 active:scale-95 uppercase tracking-wider"
          >
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}