"use client";
import React from 'react';
import { Shield, Clock, BarChart3, Users, ArrowLeft, PhoneForwarded, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const containerStyle = {
    backgroundColor: '#020617',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px 20px',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <div className="w-full max-w-6xl">
        {/* HEADER ADMIN */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={18}/> Retour Agent
          </Link>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 italic uppercase">
            Dashboard Superviseur
          </h1>
          <div className="bg-purple-900/30 border border-purple-500 px-4 py-2 rounded-full text-purple-400 font-bold flex items-center gap-2">
            <Shield size={18}/> ADMIN CONNECTÉ
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border-b-4 border-blue-500 p-6 rounded-2xl shadow-xl">
             <div className="flex justify-between mb-4"><Users className="text-blue-500" /> <span className="text-xs font-bold text-slate-500 uppercase">Agents Actifs</span></div>
             <p className="text-4xl font-black">12 / 15</p>
          </div>
          <div className="bg-slate-900 border-b-4 border-emerald-500 p-6 rounded-2xl shadow-xl">
             <div className="flex justify-between mb-4"><CheckCircle2 className="text-emerald-500" /> <span className="text-xs font-bold text-slate-500 uppercase">Ventes Jour</span></div>
             <p className="text-4xl font-black text-emerald-400">48</p>
          </div>
          <div className="bg-slate-900 border-b-4 border-orange-500 p-6 rounded-2xl shadow-xl">
             <div className="flex justify-between mb-4"><Clock className="text-orange-500" /> <span className="text-xs font-bold text-slate-500 uppercase">Appels en cours</span></div>
             <p className="text-4xl font-black text-orange-400 animate-pulse">08</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SUIVI TEMPS RÉEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-orange-400 uppercase italic">
              <PhoneForwarded /> Suivi Temps Réel
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-black/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      <div>
                        <p className="font-bold text-sm">Agent #00{i}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">En appel avec +33 6 45...</p>
                      </div>
                   </div>
                   <div className="text-xs font-mono text-orange-400">04:1{i}s</div>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORIQUE PRODUCTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-emerald-400 uppercase italic">
              <BarChart3 /> Historique Production
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end h-32 gap-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, idx) => (
                    <div key={idx} className="flex-1 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-lg transition-all hover:scale-110" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
               <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase pt-2">
                  <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}