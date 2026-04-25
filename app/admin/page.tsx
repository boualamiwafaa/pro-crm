"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, LogOut, Send, MessageCircle, ShieldCheck, UserPlus, 
  CheckCircle, Clock, Activity, Database as DbIcon, Upload, RefreshCcw, FileSpreadsheet, LayoutDashboard, Search, History
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Utilisation de useCallback pour éviter les boucles infinies
  const fetchData = useCallback(async () => {
    try {
      const { data: l, error: errL } = await supabase.from('leads').select('*').order('updated_at', { ascending: false });
      const { data: m, error: errM } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      
      if (l) {
        setLeads(l);
        setStats({
          total: l.length || 0,
          ventes: l.filter(x => x.status === 'vente').length || 0,
          rappels: l.filter(x => x.status === 'rappel').length || 0,
          nrp: l.filter(x => x.status === 'nrp' || x.status === 'refus').length || 0
        });
      }
      if (m) setMessages(m);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('admin-realtime-v3')
      .on('postgres_changes' as any, { event: '*', table: 'messages', schema: 'public' }, () => fetchData())
      .on('postgres_changes' as any, { event: '*', table: 'leads', schema: 'public' }, () => fetchData())
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // DECONNEXION RADICALE
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear(); // Nettoie les sessions locales
    router.push('/login'); // Force le retour à la page de connexion
    router.refresh();
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const formattedData = data.map((item: any) => ({
        first_name: item.PRENOM || item.first_name || "Client",
        last_name: item.NOM || item.last_name || "Nouveau",
        phone: String(item.TELEPHONE || item.phone || ""),
        status: "nouveau",
        agent_id: selectedAgent,
        zip_code: String(item.CP || item.zip_code || ""),
        notes: ""
      }));

      const { error } = await supabase.from('leads').insert(formattedData);
      if (error) alert("Erreur: " + error.message);
      else {
        alert(`${formattedData.length} leads importés !`);
        fetchData();
      }
    };
    reader.readAsBinaryString(file);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]);
    setNewMessage("");
  };

  const filteredLeads = leads.filter(l => 
    l.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone?.includes(searchTerm)
  );

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <RefreshCcw className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0f172a] p-6 rounded-[2rem] border border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg"><ShieldCheck size={24}/></div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">SUPERVISEUR ELITE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wafaa Boualami</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2">
            <LayoutDashboard size={16}/> Vue Agent
          </Link>
          <button onClick={handleLogout} className="bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 border border-rose-500/20">
            <LogOut size={16}/> Déconnexion
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'BASE TOTALE', val: stats.total, color: 'border-blue-500', icon: <DbIcon size={20}/> },
          { label: 'VENTES', val: stats.ventes, color: 'border-emerald-500', icon: <CheckCircle size={20}/> },
          { label: 'RAPPELS', val: stats.rappels, color: 'border-amber-500', icon: <Clock size={20}/> },
          { label: 'REFUS / NRP', val: stats.nrp, color: 'border-rose-500', icon: <Activity size={20}/> }
        ].map((s, i) => (
          <div key={i} className={`bg-[#0f172a] p-6 rounded-[2rem] border border-white/5 border-b-4 ${s.color}`}>
            <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase">
              {s.label} {s.icon}
            </div>
            <div className="text-3xl font-black mt-2">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
              <FileSpreadsheet size={18}/> Gestion & Import
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-2 block">Assigner à</label>
                <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="w-full p-4 bg-[#020617] border border-white/10 rounded-2xl text-sm font-bold outline-none">
                  <option value="Wafaa_B">Wafaa Boualami</option>
                  <option value="Agent_1">Agent 1 (Ismael)</option>
                  <option value="Agent_2">Agent 2 (Sara)</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="fileImport" />
                <label htmlFor="fileImport" className="cursor-pointer flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase transition-all shadow-lg">
                  <Upload size={18} /> Choisir le fichier Excel
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-emerald-500"/> Historique
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
                <input type="text" placeholder="Filtrer..." className="bg-[#020617] border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 w-48 md:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#0f172a]">
                  <tr className="text-[10px] font-black text-slate-500 uppercase border-b border-white/5">
                    <th className="pb-4">Agent</th>
                    <th className="pb-4">Client</th>
                    <th className="pb-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map((l, i) => (
                    <tr key={i} className="text-sm hover:bg-white/5">
                      <td className="py-4 text-blue-400 font-bold">{l.agent_id}</td>
                      <td className="py-4 uppercase">{l.first_name} {l.last_name}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          l.status === 'vente' ? 'bg-emerald-500/20 text-emerald-400' : 
                          l.status === 'rappel' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-slate-400'
                        }`}>{l.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col h-[700px] bg-[#0f172a] rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">Chat Superviseur</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#020617]/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender_id === 'Admin' ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] font-black text-slate-500 uppercase mb-1 px-2">{m.sender_id}</span>
                <div className={`p-4 rounded-2xl text-sm max-w-[85%] ${m.sender_id === 'Admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-white/5">
            <div className="flex gap-2 bg-[#020617] p-2 rounded-2xl border border-white/10">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Message..." className="flex-1 bg-transparent p-2 outline-none text-sm" />
              <button onClick={sendMessage} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}