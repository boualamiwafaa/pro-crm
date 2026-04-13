"use client";
import React from 'react';
import { BarChart3, TrendingUp, Users, PhoneOff, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const stats = [
    { label: "Total Ventes", value: "42", icon: <Award className="text-green-600"/>, color: "bg-green-100" },
    { label: "Prospects", value: "156", icon: <Users className="text-blue-600"/>, color: "bg-blue-100" },
    { label: "Refus/NRP", value: "28", icon: <PhoneOff className="text-red-600"/>, color: "bg-red-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord Admin</h1>
            <p className="text-slate-500">Suivi des performances en temps réel</p>
          </div>
          <Link href="/" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Retour CRM</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className={`${s.color} p-4 rounded-xl`}>{s.icon}</div>
              <div>
                <p className="text-slate-500 text-sm">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Performance de la semaine
          </h2>
          <div className="h-64 w-full bg-slate-50 rounded-xl flex items-end justify-around p-4">
             {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
               <div key={i} style={{height: `${h}%`}} className="w-12 bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer"></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}