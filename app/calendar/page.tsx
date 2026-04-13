"use client";
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const hours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mini Sidebar pour revenir au CRM */}
      <aside className="w-20 bg-slate-900 flex flex-col items-center py-6 text-white">
        <Link href="/" className="hover:text-blue-400 mb-10"><CalendarIcon size={30} /></Link>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="text-blue-600" /> Agenda des Rappels
          </h1>
          <div className="flex gap-2">
            <button className="p-2 bg-white border rounded-lg"><ChevronLeft size={20}/></button>
            <button className="p-2 bg-white border rounded-lg"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
            <div key={day} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
              <p className="font-bold text-slate-400 text-sm mb-4 uppercase">{day}</p>
              {day === "Lun" && (
                <div className="bg-blue-100 border-l-4 border-blue-600 p-2 rounded text-xs mb-2">
                  <p className="font-bold">MOHAMED ELITE</p>
                  <p className="flex items-center gap-1"><Clock size={10}/> 10:30</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}