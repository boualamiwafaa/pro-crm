"use client";
import React from 'react';
import { BarChart3, TrendingUp, Users, PhoneOff, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const stats = [
    { label: "Total Ventes", value: "42", icon: <Award className="text-green-400"/>, color: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Prospects", value: "156", icon: <Users className="text-blue-400"/>, color: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Refus/NRP", value: "28", icon: <PhoneOff className="text-red-400"/>, color: "bg-red-500/10", border: "border-red-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header amélioré */}
        <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="text-blue-500" size={32} />
              Tableau de Bord Admin
            </h1>
            <p className="text-slate-400 mt-1">Suivi des performances en temps réel</p>
          </div>
          <Link href="/" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold transition-all border border-slate-700">
            <ArrowLeft size={18} /> Retour CRM
          </Link>
        </header>

        {/* Cartes de statistiques avec couleurs de fond subtiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className={`bg-slate-900/50 p-6 rounded-2xl shadow-xl border ${s.border} flex items-center gap-5 hover:scale-105 transition-transform`}>
              <div className={`${s.color} p-4 rounded-2xl`}>{s.icon}</div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Graphique de performance stylisé */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> Performance de la semaine
            </h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Objectif atteint
              </span>
            </div>
          </div>
          
          <div className="h-72 w-full bg-slate-950/50 rounded-2xl flex items-end justify-around p-6 border border-slate-800/50">
             {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
               <div key={i} className="group relative flex flex-col items-center w-full">
                 {/* Tooltip au survol */}
                 <div className="absolute -top-8 bg-blue-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                   {h}%
                 </div>
                 <div 
                   style={{height: `${h}%`}} 
                   className="w-10 md:w-14 bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-lg hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer shadow-lg shadow-blue-900/20"
                 ></div>
                 <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold">Jour {i+1}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}