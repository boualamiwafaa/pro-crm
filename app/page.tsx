"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Phone, Calendar, MessageSquare, Save, LogOut, 
  Clock, CheckCircle, XCircle, User, Hash, 
  ShieldCheck, RefreshCw, ChevronRight, Search 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Device } from '@twilio/voice-sdk';

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
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const response = await fetch(`/api/voip/token?t=${Date.now()}`);
        const data = await response.json();
        
        if (!data.token) {
          setCallStatus("Token Erreur");
          return;
        }

        currentDevice = new Device(data.token.trim(), {
          edge: ['ashburn', 'ie1'],
          logLevel: 'debug',
          tokenRefreshMs: 15000,
        });

        currentDevice.on('registered', () => setCallStatus("Prêt"));
        currentDevice.on('error', (error: any) => {
          if (error.code !== 31005) setCallStatus(`Erreur ${error.code}`);
        });

        await currentDevice.register();
        setDevice(currentDevice);
      } catch (err: any) {
        setCallStatus("Micro bloqué");
      }
    };

    setupTwilio();
    fetchNextLead();
    return () => { if (currentDevice) currentDevice.destroy(); };
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
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 overflow-hidden">
      {/* HEADER COMPACT */}
      <header className="h-16 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">E</div>
          <div>
            <h1 className="text-xs font-black tracking-widest uppercase text-white">PRO CRM MUTUELLE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Session Agent : Wafaa Boualami</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
            <div className={`h-2 w-2 rounded-full ${callStatus === "Prêt" ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{callStatus}</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw size={18} className="text-slate-500" />
          </button>
          <button className="flex items-center gap-2 text-rose-500 text-[10px] font-black hover:text-rose-400 transition-colors">
            <LogOut size={16} /> QUITTER
          </button>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR GAUCHE : STATS */}
        <aside className="w-72 border-r border-white/5 bg-[#020617]/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <section>
            <h3 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Hash size={14} /> Performance Jour
            </h3>
            <div className="grid gap-3">
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Appels</p>
                <p className="text-2xl font-black text-white">12</p>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Ventes</p>
                <p className="text-2xl font-black text-emerald-400">3</p>
              </div>
            </div>
          </section>

          <section className="mt-auto">
             <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-center">
                <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Objectif Quotidien</p>
                <div className="w-full bg-blue-900/30 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[60%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold italic">60% complété</p>
             </div>
          </section>
        </aside>

        {/* ZONE CENTRALE : FICHE CLIENT (LE FOCUS) */}
        <main className="flex-1 bg-[#020617] p-8 overflow-y-auto flex flex-col items-center">
          {loading ? (
             <div className="m-auto flex flex-col items-center">
                <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
                <span className="text-xs font-black tracking-widest text-slate-500">CHARGEMENT DU LEAD...</span>
             </div>
          ) : lead ? (
            <div className="w-full max-w-4xl space-y-8">
              {/* CARD PRINCIPALE CLIENT */}
              <div className="bg-[#0f172a] rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <User size={120} />
                </div>

                <div className="relative z-10">
                  <span className="bg-blue-600/10 text-blue-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20"> Prospect en attente </span>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div>
                      <h2 className="text-5xl font-black text-white tracking-tight uppercase leading-none">
                        {formData.first_name} <br/>
                        <span className="text-blue-500">{formData.last_name}</span>
                      </h2>
                      <div className="flex items-center gap-3 mt-4 text-xl font-mono text-slate-400">
                        <Phone size={20} className="text-blue-500" />
                        {lead.phone}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <label className="text-[8px] text-slate-500 uppercase font-black block mb-1">Prénom</label>
                          <input className="bg-transparent w-full text-sm font-bold text-white outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                       </div>
                       <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <label className="text-[8px] text-slate-500 uppercase font-black block mb-1">Nom</label>
                          <input className="bg-transparent w-full text-sm font-bold text-white outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                       </div>
                    </div>
                  </div>
                </div>

                {/* BOUTON APPEL GÉANT */}
                <button 
                  onClick={startCall}
                  disabled={callStatus !== "Prêt"}
                  className={`w-full mt-10 py-8 rounded-3xl text-xl font-black flex items-center justify-center gap-4 transition-all shadow-xl group ${
                    callStatus === "Prêt" 
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30" 
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Phone size={28} fill="currentColor" /> 
                  {callStatus === "En appel..." ? "APPEL EN COURS" : "LANCER L'APPEL"}
                </button>
              </div>

              {/* ACTIONS ET NOTES (CÔTE À CÔTE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BLOC NOTES */}
                <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} /> Observations Appel
                   </h3>
                   <textarea 
                      className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/40 resize-none min-h-[120px]"
                      placeholder="Détails importants..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                   />
                </div>

                {/* BLOC RÉSUMÉ APPEL */}
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleUpdateLead('vente')} className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all font-black uppercase text-[10px]">
                    <CheckCircle size={32} /> Vente
                  </button>
                  <button onClick={() => setShowCalendar(true)} className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white transition-all font-black uppercase text-[10px]">
                    <Clock size={32} /> Rappel
                  </button>
                  <button onClick={() => handleUpdateLead('refus')} className="col-span-2 py-6 flex items-center justify-center gap-3 rounded-3xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all font-black uppercase text-[10px]">
                    <XCircle size={24} /> Client non intéressé / Refus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center">
              <ShieldCheck size={64} className="text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-white uppercase">Session Terminée</h2>
              <p className="text-slate-500 mt-2">Aucun nouveau lead disponible dans la base.</p>
              <button onClick={fetchNextLead} className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"> Actualiser </button>
            </div>
          )}
        </main>
      </div>

      {/* MODAL RAPPEL */}
      {showCalendar && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-3">
              <Calendar className="text-amber-500" /> Fixer Rappel
            </h2>
            <input type="datetime-local" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl mb-6 text-white outline-none focus:border-amber-500 transition-all" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowCalendar(false)} className="flex-1 py-4 rounded-xl bg-white/5 font-bold uppercase text-[10px]">Annuler</button>
              <button onClick={() => { handleUpdateLead('rappel'); setShowCalendar(false); }} className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-black uppercase text-[10px]">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}