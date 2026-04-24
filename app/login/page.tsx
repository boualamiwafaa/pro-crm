"use client";
import Link from 'next/link';
import { ShieldCheck, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Obligatoire pour utiliser auth.resetPassword

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#0f172a] p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white mx-auto mb-6 shadow-lg shadow-blue-600/20">
            E
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Accès ProCRM</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Elite Mutuelle Services</p>
        </div>

        <div className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Identifiant Agent</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Wafaa_B" className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" placeholder="••••••••" className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-sm" />
            </div>
          </div>

          <Link href="/" className="block w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-center text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 transform hover:-translate-y-1">
            Se Connecter
          </Link>
          
          {/* AJOUT DU BOUTON MOT DE PASSE OUBLIÉ */}
          <div className="text-center mt-4">
            <button 
              onClick={async () => {
                const email = prompt("Entrez votre adresse email pour la réinitialisation :");
                if (email) {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
                  });
                  if (error) alert("Erreur : " + error.message);
                  else alert("Email de réinitialisation envoyé ! Vérifiez votre boîte aux lettres.");
                }
              }}
              className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-emerald-500/80 flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Système de Surveillance Actif
          </p>
        </div>
      </div>
    </div>
  );
}