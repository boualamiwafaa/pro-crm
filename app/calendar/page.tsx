"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Clock, Phone, ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRDV, setNewRDV] = useState({ title: '', date: '', time: '', phone: '' });
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('start_time', { ascending: true });
    if (data) setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSaveRDV = async () => {
    if (!newRDV.title || !newRDV.date) return alert("Nom et Date requis");
    const startDateTime = `${newRDV.date}T${newRDV.time || '09:00'}:00`;
    const payload = { 
      title: newRDV.title, 
      start_time: startDateTime, 
      client_phone: newRDV.phone 
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('appointments').update(payload).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('appointments').insert([payload]);
      error = err;
    }

    if (error) {
      alert("Erreur: " + error.message);
    } else {
      closeModal();
      fetchReminders();
    }
  };

  const handleDeleteRDV = async () => {
    if (!editingId) return;
    if (confirm("Supprimer ce rendez-vous ?")) {
      const { error } = await supabase.from('appointments').delete().eq('id', editingId);
      if (!error) {
        closeModal();
        fetchReminders();
      }
    }
  };

  const openEditModal = (rdv: any) => {
    const d = new Date(rdv.start_time);
    setEditingId(rdv.id);
    setNewRDV({
      title: rdv.title,
      date: d.toISOString().split('T')[0],
      time: d.toTimeString().slice(0, 5),
      phone: rdv.client_phone || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewRDV({ title: '', date: '', time: '', phone: '' });
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  let startDay = startOfMonth.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1; 
  const daysInMonth = endOfMonth.getDate();
  const calendarDays = [];

  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR : Fixe à gauche, ne bouge jamais */}
      <aside className="w-20 border-r border-cyan-500/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col items-center py-8 gap-10 shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] text-xl italic">W</div>
        <button onClick={() => router.back()} className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-2xl transition-all">
          <ChevronLeft size={24} />
        </button>
      </aside>

      {/* ZONE PRINCIPALE : C'est ici qu'on active le scroll */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <CalendarIcon className="text-cyan-500" size={32} /> 
              <span>Agenda</span>
            </h1>
            
            <div className="flex items-center gap-6 bg-[#111] p-3 rounded-2xl border border-white/5 mt-4 shadow-xl">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-2 hover:bg-cyan-500/20 rounded-full text-cyan-500 transition-all"
              >
                <ChevronLeft size={20}/>
              </button>
              
              <h2 className="text-sm font-black uppercase tracking-widest min-w-[140px] text-center text-white">
                {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
              </h2>

              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-2 hover:bg-cyan-500/20 rounded-full text-cyan-500 transition-all"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-xs transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] uppercase tracking-widest"
          >
            <Plus size={20}/> Nouveau RDV
          </button>
        </div>

        {/* GRILLE MENSUELLE */}
        <div className="grid grid-cols-7 gap-3 pb-20">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
            <div key={day} className="text-center py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{day}</div>
          ))}
          
          {calendarDays.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="h-40 bg-transparent"></div>;
            
            const isToday = new Date().toDateString() === date.toDateString();
            const dayRDVs = reminders.filter(r => new Date(r.start_time).toDateString() === date.toDateString());

            return (
              <div 
                key={i} 
                className={`h-48 bg-[#0f0f0f] border ${isToday ? 'border-cyan-500 ring-1 ring-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]' : 'border-white/5'} rounded-[2rem] p-4 hover:bg-[#141414] transition-all group flex flex-col`}
              >
                <span className={`text-sm font-black mb-2 ${isToday ? 'text-cyan-500' : 'text-slate-600 group-hover:text-white'}`}>
                  {date.getDate()}
                </span>
                
                <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                  {dayRDVs.map(r => (
                    <button 
                      key={r.id} 
                      onClick={() => openEditModal(r)}
                      className="w-full text-left bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-xl hover:bg-cyan-500/20 transition-all"
                    >
                      <p className="text-[9px] font-black uppercase text-cyan-400 truncate">{r.title}</p>
                      <p className="text-[8px] text-cyan-700 font-bold">
                        {new Date(r.start_time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL EDITABLE STYLE NÉON */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-cyan-500/30 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X/></button>
            
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-white flex items-center gap-3">
               <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
               {editingId ? "Modifier le Rappel" : "Nouveau Rappel"}
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase ml-2">Client</label>
                <input 
                  type="text" 
                  className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 outline-none focus:border-cyan-500/50 text-white font-bold" 
                  placeholder="Nom du lead..."
                  value={newRDV.title}
                  onChange={e => setNewRDV({...newRDV, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Date</label>
                   <input 
                    type="date" 
                    className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 outline-none focus:border-cyan-500/50 text-cyan-400 font-bold"
                    value={newRDV.date}
                    onChange={e => setNewRDV({...newRDV, date: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Heure</label>
                   <input 
                    type="time" 
                    className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 outline-none focus:border-cyan-500/50 text-cyan-400 font-bold"
                    value={newRDV.time}
                    onChange={e => setNewRDV({...newRDV, time: e.target.value})}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Téléphone</label>
                <input 
                  type="tel" 
                  className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 outline-none focus:border-cyan-500/50 text-white font-bold" 
                  placeholder="06..."
                  value={newRDV.phone}
                  onChange={e => setNewRDV({...newRDV, phone: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {editingId && (
                  <button 
                    onClick={handleDeleteRDV}
                    className="p-5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all border border-red-500/20"
                  >
                    <Trash2 size={24}/>
                  </button>
                )}
                <button 
                  onClick={handleSaveRDV}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
                >
                  {editingId ? "Mettre à jour" : "Sauvegarder"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}