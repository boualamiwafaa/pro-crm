"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Phone, Calendar, MessageSquare, LogOut, 
  Clock, CheckCircle, XCircle, User, Hash, 
  ShieldCheck, RefreshCw, LayoutDashboard, Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Device } from '@twilio/voice-sdk';
import Link from 'next/link';

export default function AgentPage() {
  // --- ÉTATS CRM ---
  const [lead, setLead] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  
  // --- ÉTATS VOIP & MODALS ---
  const [callStatus, setCallStatus] = useState("Initialisation...");
  const [device, setDevice] = useState<Device | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rdvDate, setRdvDate] = useState("");

  const isInitialised = useRef(false);

  const fetchNextLead = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'nouveau')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setLead(data);
        setFormData({ 
          first_name: data.first_name || '', 
          last_name: data.last_name || '', 
          email: data.email || '' 
        });
        setComment(data.notes || "");
      } else {
        setLead(null);
      }
    } catch (err) {
      console.error("Erreur Leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let currentDevice: Device | null = null;
    const setupTwilio = async () => {
      if (isInitialised.current) return;
      isInitialised.current = true;
      try {
        setCallStatus("Micro...");
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const response = await fetch(`/api/voip/token?t=${Date.now()}`);
        const data = await response.json();
        if (!data.token) {
          setCallStatus("Token Erreur");
          return;
        }
        currentDevice = new Device(data.token.trim(), {
          logLevel: 'debug',
          edge: ['ashburn', 'ie1'],
          tokenRefreshMs: 15000,
        });
        currentDevice.on('registered', () => setCallStatus("Prêt"));
        currentDevice.on('error', (error: any) => {
          if (error.code !== 31005) setCallStatus(`Erreur ${error.code}`);
        });
        await currentDevice.register();
        setDevice(currentDevice);
      } catch (err: any) {
        setCallStatus("Erreur Init");
      }
    };
    setupTwilio();
    fetchNextLead();
    return () => {
      if (currentDevice) {
        currentDevice.removeAllListeners();
        currentDevice.destroy();
        isInitialised.current = false;
      }
    };
  }, [fetchNextLead]);

  const handleUpdateLead = async (newStatus: string) => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: newStatus, 
        notes: comment,
        first_name: formData.first_name,
        last_name: formData.last_name,
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id);
    if (!error) {
      fetchNextLead();
      setComment("");
    }
  };

  const startCall = async () => {
    if (!device || !lead?.phone) return;
    try {
      const cleanNumber = lead.phone.replace(/\s+/g, '');
      const call = await device.connect({ params: { To: cleanNumber } });
      setCallStatus("En appel...");
      call.on('disconnect', () => setCallStatus("Prêt"));
    } catch (err) {
      setCallStatus("Prêt");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR DE NAVIGATION (Correction Design) */}
      <aside className="w-64 border-r border-white/5 bg-[#020617]/50 flex flex-col p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">E</div>
          <span className="font-black text-sm tracking-tighter">ELITE CRM</span>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-blue-500/20">
            <LayoutDashboard size={18} /> Espace Agent
          </Link>
          <Link href="/admin" className="flex items-center gap-3 p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <ShieldCheck size={18} /> Administration
          </Link>
          <Link href="/calendar" className="flex items-center gap-3 p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <Calendar size={18} /> Calendrier
          </Link>
        </nav>

        <div className="mt-auto">
          <Link href="/login" className="flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <LogOut size={18} /> Déconnexion
          </Link>
        </div>
      </aside>

      {/* ZONE DE TRAVAIL PRINCIPALE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#020617]/20">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Session : Wafaa Boualami</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Agent de Mutuelle Senior</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
              <div className={`h-2 w-2 rounded-full ${callStatus === "Prêt" ? "bg-emerald-400" : "bg-rose-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{callStatus}</span>
            </div>
            <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* CONTENU AGENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center"><RefreshCw className="animate-spin text-blue-600" /></div>
          ) : lead ? (
            <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">
              
              {/* COLONNE GAUCHE : FICHE CLIENT */}
              <div className="col-span-8 space-y-6">
                <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><User size={120} /></div>
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Prospect Actuel</span>
                  <h2 className="text-5xl font-black text-white mt-4 mb-2 uppercase">
                    {formData.first_name} <span className="text-blue-600">{formData.last_name}</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xl font-mono text-slate-400 mb-8">
                    <Phone size={18} className="text-blue-500" /> {lead.phone}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black block mb-2">Modifier Prénom</label>
                      <input className="bg-transparent w-full font-bold outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black block mb-2">Modifier Nom</label>
                      <input className="bg-transparent w-full font-bold outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 p-8">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Notes & Compte-rendu
                  </h3>
                  <textarea 
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-6 text-sm outline-none focus:border-blue-500/50 min-h-[150px] resize-none"
                    placeholder="Écrivez ici le résumé de l'appel..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              {/* COLONNE DROITE : ACTIONS & VOIP */}
              <div className="col-span-4 space-y-6">
                <button 
                  onClick={startCall}
                  disabled={callStatus !== "Prêt"}
                  className={`w-full py-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all shadow-2xl ${
                    callStatus === "Prêt" 
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30" 
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Phone size={32} fill="currentColor" />
                  <span className="font-black text-xs tracking-widest uppercase">Lancer l'appel</span>
                </button>

                <div className="grid grid-cols-1 gap-4 mt-8">
                  <button onClick={() => handleUpdateLead('vente')} className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Valider Vente
                  </button>
                  <button onClick={() => setShowCalendar(true)} className="w-full py-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Clock size={16} /> Programmer Rappel
                  </button>
                  <button onClick={() => handleUpdateLead('refus')} className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <XCircle size={16} /> Refus définitif
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShieldCheck size={80} className="text-blue-600/20 mb-6" />
              <h2 className="text-3xl font-black text-white uppercase">Travail terminé !</h2>
              <p className="text-slate-500 max-w-sm mt-4">Tous les leads actuels ont été traités. Revenez plus tard pour de nouveaux prospects.</p>
              <button onClick={fetchNextLead} className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase hover:bg-white/10 transition-all">Actualiser la base</button>
            </div>
          )}
        </main>
      </div>

      {/* MODAL RAPPEL (DESIGN LUXE) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0f172a] p-12 rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-4">
              <Calendar className="text-amber-500" /> Rappel Client
            </h2>
            <input type="datetime-local" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl mb-8 text-white outline-none focus:border-amber-500" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowCalendar(false)} className="flex-1 py-5 rounded-2xl bg-white/5 font-bold uppercase text-[10px]">Fermer</button>
              <button onClick={() => { handleUpdateLead('rappel'); setShowCalendar(false); }} className="flex-1 py-5 rounded-2xl bg-amber-500 text-black font-black uppercase text-[10px]">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}