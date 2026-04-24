"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Clock, User, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  useEffect(() => {
    const fetchReminders = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'rappel')
        .order('updated_at', { ascending: false });
      if (data) setReminders(data);
    };
    fetchReminders();
  }, []);

  // Fonction pour simuler la répartition (en attendant d'avoir une vraie colonne "date_rappel")
  // Ici on affiche les rappels réels dans la colonne "Lun" par défaut pour le test
  const renderLeadCard = (lead: any) => (
    <div key={lead.id} className="bg-blue-600/10 border-l-4 border-blue-500 p-3 rounded-xl mb-3 hover:bg-blue-600/20 transition-all group">
      <p className="font-black text-white text-[10px] uppercase tracking-tighter truncate">
        {lead.first_name} {lead.last_name}
      </p>
      <div className="flex items-center gap-2 mt-1 text-slate-500 group-hover:text-slate-300">
        <Clock size={10} />
        <span className="text-[9px] font-bold italic">À rappeler</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
      
      {/* SIDEBAR MINI */}
      <aside className="w-20 border-r border-white/5 bg-[#020617]/50 flex flex-col items-center py-8 gap-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">W</div>
        <Link href="/" className="p-3 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-2xl transition-all">
          <ChevronLeft size={24} />
        </Link>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER AGENDA */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <CalendarIcon className="text-blue-600" size={28} /> Agenda des Rappels
            </h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 ml-1">
              Vue Hebdomadaire • {reminders.length} lead(s) en attente
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><ChevronLeft size={20}/></button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* GRILLE DES JOURS */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day, index) => (
            <div key={day} className="bg-[#0f172a]/50 p-4 rounded-[2rem] border border-white/5 min-h-[500px] flex flex-col shadow-inner">
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="font-black text-slate-500 text-[11px] uppercase tracking-widest">{day}</span>
                {day === "Lun" && reminders.length > 0 && (
                  <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-600/40">
                    {reminders.length}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* On affiche les données Supabase ici (pour le test on met tout sur Lundi) */}
                {day === "Lun" ? (
                  reminders.length > 0 ? (
                    reminders.map(r => renderLeadCard(r))
                  ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                      <span className="text-[8px] text-slate-700 uppercase font-bold italic rotate-90">Vide</span>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                    <span className="text-[8px] text-slate-700 uppercase font-bold italic rotate-90">Disponible</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}