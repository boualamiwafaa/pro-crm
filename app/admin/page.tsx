"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, LogOut, Send, MessageCircle, ShieldCheck, UserPlus, 
  CheckCircle, Clock, Activity, Database as DbIcon, Upload, RefreshCcw, FileSpreadsheet, LayoutDashboard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: l } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (l) {
      setLeads(l);
      setStats({
        total: l.length,
        ventes: l.filter(x => x.status === 'vente').length,
        rappels: l.filter(x => x.status === 'rappel').length,
        nrp: l.filter(x => x.status === 'nrp').length
      });
    }
    if (m) setMessages(m);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('admin-full-realtime')
      .on('postgres_changes' as any, { event: '*', table: 'messages', schema: 'public' }, (payload: any) => {
        if (payload.eventType === 'INSERT') setMessages(prev => [...prev, payload.new]);
        else fetchData();
      })
      .on('postgres_changes' as any, { event: '*', table: 'leads', schema: 'public' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]);
    if (!error) setNewMessage("");
  };

  const handleManualInject = async () => {
    const { error } = await supabase.from('leads').insert([{ 
      first_name: "Nouveau", last_name: "Prospect", 
      phone: "06" + Math.floor(Math.random() * 90000000), 
      status: "nouveau", agent_id: selectedAgent,
      created_at: new Date().toISOString()
    }]);
    if (!error) alert(`Lead injecté pour ${selectedAgent}`);
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center text-white">
      <RefreshCcw className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
      
      {/* HEADER PREMIUM */}
      <header className="flex justify-between items-center mb-8 bg-[#0f172a] p-6 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20"><ShieldCheck size={24}/></div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">SUPERVISEUR ELITE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Casablanca CRM v2.5</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2">
            <LayoutDashboard size={16}/> Vue Agent
          </Link>
          <button className="bg-rose-600 hover:bg-rose-500 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2">
            <LogOut size={16}/> Déconnexion
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'BASE TOTALE', val: stats.total, color: 'border-blue-500', icon: <DbIcon size={20}/> },
          { label: 'VENTES', val: stats.ventes, color: 'border-emerald-500', icon: <CheckCircle size={20}/> },
          { label: 'RAPPELS', val: stats.rappels, color: 'border-amber-500', icon: <Clock size={20}/> },
          { label: 'NRP / PERDUS', val: stats.nrp, color: 'border-rose-500', icon: <Activity size={20}/> }
        ].map((s, i) => (
          <div key={i} className={`bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 border-b-4 ${s.color}`}>
            <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {s.label} {s.icon}
            </div>
            <div className="text-3xl font-black mt-2">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEADS & DISPATCH */}
        <div className="col-span-8 space-y-8">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
              <FileSpreadsheet size={18}/> Distribution des Leads
            </h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-2 block">Agent Destinataire</label>
                <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="w-full p-4 bg-[#020617] border border-white/10 rounded-2xl outline-none focus:border-blue-500">
                  <option value="Agent_1">AGENT 1 (Ismael)</option>
                  <option value="Agent_2">AGENT 2 (Sara)</option>
                  <option value="Agent_3">AGENT 3 (Yassine)</option>
                </select>
              </div>
              <button onClick={handleManualInject} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-2 transition-all">
                <Upload size={18}/> Injecter
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Production en Direct</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black text-slate-500 uppercase border-b border-white/5">
                  <th className="pb-4">Agent</th>
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.slice(0, 8).map((l, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-4 text-blue-400 font-bold">{l.agent_id}</td>
                    <td className="py-4 font-medium">{l.first_name} {l.last_name}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${l.status === 'vente' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CHAT EQUIPE */}
        <div className="col-span-4 bg-[#0f172a] rounded-[2.5rem] border border-white/10 flex flex-col h-[700px] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> Chat Équipe
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#020617]/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender_id === 'Admin' ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] font-black text-slate-500 uppercase mb-1">{m.sender_id}</span>
                <div className={`p-4 rounded-2xl text-sm max-w-[90%] ${m.sender_id === 'Admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white/5">
            <div className="flex gap-2 bg-[#020617] p-2 rounded-2xl border border-white/10">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 bg-transparent p-2 outline-none text-sm" />
              <button onClick={sendMessage} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-all"><Send size={18}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}