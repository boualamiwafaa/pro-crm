"use client";
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Mail, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // States pour le formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Ex: "AGENT 02" ou "ADMIN"

  // 1. FONCTION DE CONNEXION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Récupération du rôle dans la table 'profiles' pour la redirection
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single();

      if (profile?.full_name.toUpperCase().includes('ADMIN')) {
        router.push('/admin');
      } else {
        router.push('/agent');
      }
    } catch (error: any) {
      alert("Erreur de connexion : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. FONCTION D'INSCRIPTION
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName } // Stocké dans raw_user_meta_data
        }
      });

      if (error) throw error;
      
      // Création manuelle dans ta table profiles si ton trigger Supabase n'est pas actif
      await supabase.from('profiles').insert([
        { id: data.user?.id, full_name: fullName }
      ]);

      alert("Compte créé ! Vous pouvez vous connecter.");
      setIsRegistering(false);
    } catch (error: any) {
      alert("Erreur d'inscription : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#0f172a] p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white mx-auto mb-6 shadow-lg shadow-blue-600/20">
            E
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            {isRegistering ? "Création Compte" : "Accès ProCRM"}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Elite Mutuelle Services</p>
        </div>

        <form onSubmit={isRegistering ? handleSignUp : handleLogin} className="space-y-5 relative">
          
          {isRegistering && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-4">Nom Complet (ex: AGENT 02)</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="AGENT 02" 
                  className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-sm text-white" 
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Email Professionnel</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@mutuelle.com" 
                className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-sm text-white" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase px-4">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#020617] border border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all text-sm text-white" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-center text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? "Chargement..." : isRegistering ? "Créer le compte" : "Se Connecter"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4 text-center relative">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            {isRegistering ? <User size={14}/> : <UserPlus size={14}/>}
            {isRegistering ? "J'ai déjà un compte" : "Créer un nouvel agent"}
          </button>

          {!isRegistering && (
            <button 
              onClick={async () => {
                const mail = prompt("Email de réinitialisation :");
                if (mail) await supabase.auth.resetPasswordForEmail(mail);
              }}
              className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-emerald-500/80 flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Cryptage AES-256 Actif
          </p>
        </div>
      </div>
    </div>
  );
}