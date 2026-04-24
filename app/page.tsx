"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Phone, Calendar, MessageSquare, LogOut, 
  Clock, CheckCircle, XCircle, User, 
  ShieldCheck, RefreshCw, LayoutDashboard, 
  Mail, MapPin, Cake, Coffee, Utensils, Play,
  Hash, Send 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Device } from '@twilio/voice-sdk';
import Link from 'next/link';

export default function AgentPage() {
  // --- ÉTATS CRM ---
  const [lead, setLead] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusAgent, setStatusAgent] = useState("Disponible");
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    birth_date: '', 
    address: '', 
    zip_code: '' 
  });
  
  // --- ÉTATS CHAT & MESSAGES ---
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  // --- ÉTATS VOIP & MODALS ---
  const [callStatus, setCallStatus] = useState("Initialisation...");
  const [device, setDevice] = useState<Device | null>(null);
  const [callActive, setCallActive] = useState(false); // État pour savoir si on est en ligne
  const [currentCall, setCurrentCall] = useState<any>(null); // Stocker l'appel en cours
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
          email: data.email || '',
          birth_date: data.birth_date || '',
          address: data.address || '',
          zip_code: data.zip_code || ''
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

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

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
    fetchMessages();

    const channel = supabase.channel('agent-realtime')
      .on('postgres_changes', { event: 'INSERT', table: 'messages', schema: 'public' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      if (currentDevice) {
        currentDevice.removeAllListeners();
        currentDevice.destroy();
        isInitialised.current = false;
      }
      supabase.removeChannel(channel);
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
        email: formData.email,
        birth_date: formData.birth_date,
        address: formData.address,
        zip_code: formData.zip_code,
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id);
    if (!error) {
      fetchNextLead();
      setComment("");
    } else {
      alert("Erreur : " + error.message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Wafaa' }]);
    setNewMessage("");
  };

  const startCall = async () => {
    if (!device || !lead?.phone) return;
    try {
      const cleanNumber = lead.phone.replace(/\s+/g, '');
      const call = await device.connect({ params: { To: cleanNumber } });
      
      setCallActive(true);
      setCurrentCall(call);
      setCallStatus("En appel...");

      call.on('disconnect', () => {
        setCallActive(false);
        setCurrentCall(null);
        setCallStatus("Prêt");
      });
    } catch (err) {
      setCallStatus("Erreur appel");
      setCallActive(false);
    }
  };

  const handleHangup = () => {
    if (currentCall) {
      currentCall.disconnect(); 
      setCallActive(false);
      setCurrentCall(null);
      setCallStatus("Prêt");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#020617]/50 flex flex-col p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20 text-xs">W</div>
          <span className="font-black text-sm tracking-tighter uppercase">Elite CRM</span>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-xl font-bold text-xs uppercase tracking-widest border border-blue-500/20">
            <LayoutDashboard size={18} /> Espace Agent
          </Link>
          <Link href="/admin" className="flex items-center gap-3 p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <ShieldCheck size={18} /> Administration
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/5">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block italic">Statut : {statusAgent}</span>
          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => setStatusAgent("En Ligne")} className={`p-3 rounded-xl flex items-center gap-3 text-[9px] font-black uppercase border transition-all ${statusAgent === "En Ligne" ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "bg-white/5 border-transparent text-slate-500"}`}>
              <Play size={14} /> Reprendre
            </button>
            <button onClick={() => setStatusAgent("Pause Café")} className={`p-3 rounded-xl flex items-center gap-3 text-[9px] font-black uppercase border transition-all ${statusAgent === "Pause Café" ? "bg-amber-500/20 border-amber-500 text-amber-500" : "bg-white/5 border-transparent text-slate-500"}`}>
              <Coffee size={14} /> Pause Café
            </button>
            <button onClick={() => setStatusAgent("Déjeuner")} className={`p-3 rounded-xl flex items-center gap-3 text-[9px] font-black uppercase border transition-all ${statusAgent === "Déjeuner" ? "bg-orange-500/20 border-orange-500 text-orange-500" : "bg-white/5 border-transparent text-slate-500"}`}>
              <Utensils size={14} /> Déjeuner
            </button>
          </div>
        </div>

        <button onClick={() => setShowChat(!showChat)} className={`mt-4 p-3 rounded-xl flex items-center gap-3 text-[9px] font-black uppercase transition-all ${showChat ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>
            <MessageSquare size={14} /> Chat Équipe
        </button>

        <div className="mt-auto">
          <Link href="/login" className="flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <LogOut size={18} /> Quitter
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* CHAT OVERLAY */}
        {showChat && (
          <div className="absolute right-8 top-24 w-80 h-[500px] bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-5">
            <div className="p-4 border-b border-white/5 bg-white/5 font-black text-[10px] uppercase tracking-widest">Chat Direct - Superviseur</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender_id === 'Wafaa' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] font-bold text-slate-500 uppercase mb-1">{m.sender_id}</span>
                  <div className={`p-3 rounded-xl text-xs ${m.sender_id === 'Wafaa' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-black/20 flex gap-2">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 bg-transparent text-xs outline-none" />
              <button onClick={sendMessage} className="p-2 bg-blue-600 rounded-lg"><Send size={14}/></button>
            </div>
          </div>
        )}

        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#020617]/20">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Wafaa Boualami</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Session Mutuelle Active</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
              <div className={`h-2 w-2 rounded-full ${callStatus === "Prêt" ? "bg-emerald-400" : "bg-rose-500"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{callStatus}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center"><RefreshCw className="animate-spin text-blue-600" /></div>
          ) : lead ? (
            <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8 pb-20">
              
              <div className="col-span-8 space-y-6">
                <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Client en cours</span>
                  <h2 className="text-4xl font-black text-white mt-4 mb-2 uppercase">
                    {formData.first_name} <span className="text-blue-600">{formData.last_name}</span>
                  </h2>
                  <div className="flex items-center gap-4 text-xl font-mono text-slate-400 mb-8 font-bold">
                    <Phone size={18} className="text-blue-500" /> {lead.phone}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">Prénom</label>
                      <input className="bg-transparent w-full font-bold outline-none text-white text-sm" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">Nom</label>
                      <input className="bg-transparent w-full font-bold outline-none text-white text-sm" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">Email</label>
                      <input className="bg-transparent w-full font-bold outline-none text-white text-sm" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">Naissance</label>
                      <input className="bg-transparent w-full font-bold outline-none text-white text-sm" type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-black/20 p-4 rounded-2xl border border-white/5">
                      <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">Adresse</label>
                      <input className="bg-transparent w-full font-bold outline-none text-white text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[8px] text-slate-500 uppercase font-black mb-2 block tracking-widest">CP</label>
                        <input className="bg-transparent w-full font-bold outline-none text-white text-sm" value={formData.zip_code} onChange={e => setFormData({...formData, zip_code: e.target.value})} />
                      </div>
                      <Hash size={16} className="text-slate-600 mt-4" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-[2rem] border border-white/10 p-8">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Notes de l'échange
                  </h3>
                  <textarea 
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-6 text-sm outline-none focus:border-blue-500/50 min-h-[120px] resize-none"
                    placeholder="Saisir les détails importants..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-4 space-y-6">
                {/* BOUTON DYNAMIQUE APPEL / RACCROCHER */}
                {callActive ? (
                  <button 
                    onClick={handleHangup}
                    className="w-full py-10 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all shadow-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse"
                  >
                    <Phone size={32} fill="currentColor" className="rotate-[135deg]" />
                    <span className="font-black text-xs tracking-widest uppercase">Raccrocher</span>
                  </button>
                ) : (
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
                    <span className="font-black text-xs tracking-widest uppercase">Appeler Client</span>
                  </button>
                )}

                <div className="flex flex-col gap-3">
                  <button onClick={() => handleUpdateLead('vente')} className="w-full py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    <CheckCircle size={18} /> Valider Vente
                  </button>
                  <button onClick={() => setShowCalendar(true)} className="w-full py-5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    <Clock size={18} /> Rappel
                  </button>
                  <button onClick={() => handleUpdateLead('refus')} className="w-full py-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                    <XCircle size={18} /> Refus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShieldCheck size={60} className="text-blue-600/20 mb-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Plus aucun lead à traiter</h2>
              <button onClick={fetchNextLead} className="mt-8 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase hover:bg-white/10 transition-all">Relancer la recherche</button>
            </div>
          )}
        </main>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#0f172a] p-10 rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase mb-8 flex items-center gap-4">
              <Calendar className="text-amber-500" /> Fixer Rappel
            </h2>
            <input type="datetime-local" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl mb-8 text-white outline-none focus:border-amber-500 font-bold" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowCalendar(false)} className="flex-1 py-5 rounded-2xl bg-white/5 font-bold uppercase text-[10px]">Annuler</button>
              <button onClick={() => { handleUpdateLead('rappel'); setShowCalendar(false); }} className="flex-1 py-5 rounded-2xl bg-amber-500 text-black font-black uppercase text-[10px]">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}