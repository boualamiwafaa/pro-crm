"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LogOut, Send, ShieldCheck, Phone, Headphones,
  CheckCircle, Clock, Activity, Database as DbIcon, Upload, Search, X,
  Users, ListFilter, User, Delete, PhoneOff, Calendar,
  UserCheck, Shield, BarChart3, Settings, RefreshCw, Eye, Trash2, 
  ChevronRight, AlertCircle, Info, Power, Moon, Sun, Monitor
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Device } from '@twilio/voice-sdk';
import CalendarPage from "@/app/calendar/page"; // On importe ta page d'agenda

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]); 
  const [newMessage, setNewMessage] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState(""); 
  const [selectedAgentProfile, setSelectedAgentProfile] = useState<any>(null); 
  const [activeDetails, setActiveDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [showDialer, setShowDialer] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [view, setView] = useState<'base' | 'agenda'>('base');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Nouveaux états pour la VoIP et Paramètres
  const [device, setDevice] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' ou 'light'
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");

  const checkAdminAccess = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', session.user.id)
      .single();

    if (profile?.role === 'admin' || profile?.full_name?.toLowerCase().includes('wafaa')) {
      setIsAdmin(true);
      fetchData();
    } else {
      alert("Accès refusé : Espace réservé à Wafaa.");
      router.push('/agent');
    }
  }, [router]);

  const getAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputs = devices.filter(device => device.kind === 'audiooutput');
      setAudioDevices(outputs);
    } catch (err) {
      console.error("Erreur périphériques audio:", err);
    }
  };

  const initializeTwilio = async () => {
    try {
      const response = await fetch('/api/voip/token');
      const data = await response.json();
      
      const newDevice = new Device(data.token, {
        codecPreferences: ['opus', 'pcmu'] as any,
      });

      newDevice.on('registered', () => console.log('Twilio Device Registered'));
      newDevice.on('error', (error) => console.error('Twilio Error:', error));

      await newDevice.register();
      setDevice(newDevice);
      getAudioDevices();
    } catch (err) {
      console.error("Erreur initialisation VoIP:", err);
    }
  };

  const handleCall = async () => {
    if (!device) {
      alert("Le module d'appel n'est pas encore prêt.");
      return;
    }
    if (!phoneNumber) {
      alert("Entrez un numéro");
      return;
    }

    try {
      setIsCalling(true);
      const params = { To: phoneNumber };
      const connection = await device.connect({ params });
      
      // Appliquer la sortie audio sélectionnée si disponible
      if (selectedAudioDevice && (connection as any).setSinkId) {
        (connection as any).setSinkId(selectedAudioDevice);
      }
    } catch (err) {
      console.error("Erreur lors de l'appel:", err);
      setIsCalling(false);
    }
  };

  const handleHangup = () => {
    if (device) {
      device.disconnectAll();
      setIsCalling(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: l } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      const { data: p } = await supabase.from('profiles').select('*').eq('role', 'agent');
      
      if (l) {
        setLeads(l);
        setStats({
          total: l.length,
          ventes: l.filter(x => x.status?.toLowerCase() === 'vente').length,
          rappels: l.filter(x => x.status?.toLowerCase() === 'rappel').length,
          nrp: l.filter(x => ['nrp', 'refus'].includes(x.status?.toLowerCase())).length
        });
      }
      if (m) setMessages(m);
      if (p) {
        setAgents(p);
        if (!selectedAgentId && p.length > 0) {
          const firstActive = p.find(a => a.status === 'active' || a.status === 'online');
          if (firstActive) setSelectedAgentId(firstActive.id);
        }
      }
    } catch (err) {
      console.error("Erreur flux:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedAgentId]);

  useEffect(() => {
    checkAdminAccess();
    let isMounted = true;

    if (!device) {
      initializeTwilio().then(() => {
        if (!isMounted) device?.destroy();
      });
    }

    const sub = supabase.channel('realtime_admin')
      .on('postgres_changes' as any, {event:'*', schema:'public', table:'leads'}, () => fetchData())
      .on('postgres_changes' as any, {event:'*', schema:'public', table:'messages'}, () => fetchData())
      .on('postgres_changes' as any, {event:'*', schema:'public', table:'profiles'}, () => fetchData())
      .subscribe();

    return () => { 
      isMounted = false;
      supabase.removeChannel(sub); 
      if (device) device.destroy();
    };
  }, [fetchData, checkAdminAccess]);

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const isOnline = currentStatus === 'active' || currentStatus === 'online';
    const newStatus = isOnline ? 'suspended' : 'active';
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', agentId);
    if (!error) {
      fetchData();
      setSelectedAgentProfile(null);
    }
  };

  const assignLead = async (leadId: string, agentId: string) => {
    const { error } = await supabase.from('leads').update({ agent_id: agentId }).eq('id', leadId);
    if (!error) fetchData();
  };

  const deleteLead = async (id: string) => {
    if (confirm("Supprimer ce lead définitivement ?")) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleGlobalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      const formatted = data.map((item: any) => ({
        first_name: item.PRENOM || item.first_name || "Client",
        last_name: item.NOM || item.last_name || "Nouveau",
        phone: String(item.TELEPHONE || item.phone || ""),
        status: "nouveau",
        agent_id: "STOCK", 
      }));
      const { error } = await supabase.from('leads').insert(formatted);
      if (error) alert("Erreur: " + error.message);
      else { alert(`✅ ${formatted.length} leads ajoutés au stock.`); fetchData(); }
    };
    reader.readAsBinaryString(file);
  };

  const handleAgentInjection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Utilise selectedAgentId pour envoyer à l'agent choisi sans te déconnecter
    if (!file || !selectedAgentId) {
      alert("Sélectionne un agent dans la liste avant d'injecter le fichier !");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      const formatted = data.map((item: any) => ({
        // On fait correspondre tes colonnes Excel avec ta base de données
         first_name: item.prenom || "",
        last_name: item.nom || item.last_name || "nouveau",
        phone: String(item['numero de telephon'] || "").replace(/\s/g, ""), // Enlève les espaces si besoin
        email: item.mail || "",
        birth_date: item['date de naissan'] || null,
        address: item.adresse || "",
        zip_code: String(item['code post'] || ""),
        city: item.ville || "",
        status: "nouveau",
        agent_id: selectedAgentId, // Envoie directement à l'ID de l'agent 02, 03 etc.
      }));
      const { error } = await supabase.from('leads').insert(formatted);

      if (error) alert("Erreur: " + error.message);
      else { alert(`🚀 Injectés avec succès !`); fetchData(); }
    };
    reader.readAsBinaryString(file);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (l.phone || "").includes(searchTerm);
    if (statusFilter === "tous") return matchesSearch;
    if (statusFilter === "nrp") return matchesSearch && (l.status === 'nrp' || l.status === 'refus');
    return matchesSearch && l.status === statusFilter;
  });

  if (loading && !isAdmin) return <div className="h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-black animate-spin"><RefreshCw size={40}/></div>;

  return (
    <div className={`${theme === 'dark' ? 'bg-[#020617] text-white' : 'bg-slate-100 text-slate-900'} h-screen w-full p-4 overflow-y-auto relative transition-colors duration-300`}>
      
      <header className={`${theme === 'dark' ? 'bg-[#0f172a] border-cyan-500/20' : 'bg-white border-slate-200'} flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border mb-6 shadow-xl relative z-50`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="font-black text-xl italic text-white tracking-tighter">PRO</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">SUPERVISEUR <span className="text-cyan-400">CRM</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wafaa Boualami | Administration</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(true)} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all"><Settings size={18}/></button>
          <button onClick={() => setShowDialer(true)} className="bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-emerald-500 transition-all shadow-lg"><Phone size={16}/> APPEL</button>
          <button onClick={() => router.push('/agent')} className="bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-cyan-600 hover:text-white transition-all"><User size={16}/> VUE AGENT</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="bg-rose-600/10 text-rose-500 border border-rose-500/20 px-6 py-3 rounded-xl flex items-center gap-2 font-black text-xs hover:bg-rose-600 hover:text-white transition-all"><LogOut size={16}/></button>
        </div>
      </header>

      {/* MODAL PARAMÈTRES (THEME + CASQUE) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10002] flex items-center justify-center p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border border-cyan-500/30 p-8 rounded-[2.5rem] w-full max-w-md shadow-3xl`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2"><Settings className="text-cyan-400"/> Paramètres</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-rose-500"><X/></button>
            </div>

            <div className="space-y-6">
              {/* SÉLECTION DU THÈME */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Apparence du Dashboard</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTheme('dark')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${theme === 'dark' ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-transparent border-slate-700 text-slate-400'}`}>
                    <Moon size={16}/> SOMBRE
                  </button>
                  <button onClick={() => setTheme('light')} className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${theme === 'light' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-transparent border-slate-300 text-slate-500'}`}>
                    <Sun size={16}/> CLAIR
                  </button>
                </div>
              </div>

              {/* SÉLECTION DU CASQUE / SORTIE AUDIO */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Sortie Audio (Casque)</label>
                <div className="relative">
                  <Headphones className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" size={16}/>
                  <select 
                    value={selectedAudioDevice}
                    onChange={(e) => setSelectedAudioDevice(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <option value="">Haut-parleurs par défaut</option>
                    {audioDevices.map(dev => (
                      <option key={dev.deviceId} value={dev.deviceId}>{dev.label || `Casque ${dev.deviceId.slice(0,5)}`}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 italic">* Branchez votre casque pour qu'il apparaisse dans la liste.</p>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full mt-10 bg-cyan-600 text-white p-4 rounded-2xl font-black text-xs uppercase hover:bg-cyan-500 transition-all shadow-lg">Enregistrer les préférences</button>
          </div>
        </div>
      )}

         {/* RESTE DU CODE (SÉCTIONS, STATS, TABLEAU) - INCHANGÉ */}
         <section className="mb-6 px-2">
        <div className="flex gap-4 mb-6">
        <button 
         onClick={() => setView('base')}
        className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${view === 'base' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-slate-400'}`}
         >
        BASE DE DONNÉES
         </button>
         <button 
         onClick={() => setView('agenda')}
        className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${view === 'agenda' ? 'bg-cyan-600 text-white' : 'bg-white/5 text-slate-400'}`}
        >
        AGENDA DES RAPPELS
         </button>
        </div>

           {/* Affichage conditionnel */}
         {view === 'agenda' ? (
        <div className="bg-[#0f172a] rounded-[2rem] p-6 border border-white/5">
         <CalendarPage /> 
        </div>
        ) : (
          <> 
          {/* ICI TU METS TOUT TON CODE ACTUEL (Stats, Tableau, etc.) */}
         </>
        )}
        <h3 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2"><Activity size={14} className="text-cyan-400"/> Équipe en ligne</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className={`${theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'} p-4 rounded-2xl border flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-all group`}>
              <div className="flex items-center gap-3" onClick={() => setSelectedAgentProfile(agent)}>
                <div className={`w-3 h-3 rounded-full ${agent.status === 'active' || agent.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                <div>
                  <p className="font-black text-xs uppercase">{agent.full_name || "Agent Inconnu"}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{agent.status === 'active' || agent.status === 'online' ? 'Connecté' : 'Hors-ligne'}</p>
                </div>
              </div>
              <button onClick={() => toggleAgentStatus(agent.id, agent.status)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                 <Power size={14} className={agent.status === 'active' || agent.status === 'online' ? 'text-emerald-500' : 'text-rose-500'}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} p-6 rounded-[2rem] border border-white/5 shadow-2xl`}>
          <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><DbIcon size={16} className="text-cyan-400"/> Stock Général</h3>
          <label className={`${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} w-full p-4 rounded-xl font-black text-[10px] uppercase cursor-pointer flex items-center justify-center gap-3 transition-all border border-white/5`}>
            <Upload size={18}/> Importer vers la base
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleGlobalImport} className="hidden" />
          </label>
        </div>

        <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} p-6 rounded-[2rem] border border-emerald-500/20 shadow-2xl`}>
          <h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><Users size={16} className="text-emerald-400"/> Injection Directe</h3>
          <div className="flex gap-3">
            <select value={selectedAgentId || ""} onChange={(e) => setSelectedAgentId(e.target.value)} className={`${theme === 'dark' ? 'bg-[#020617] border-white/10' : 'bg-slate-100 border-slate-300'} flex-1 border p-3 rounded-xl font-bold text-xs outline-none text-emerald-500`}>
              <option value="">SÉLECTIONNER AGENT</option>
              {agents.filter(a => a.status !== 'suspended').map((a) => (
                <option key={a.id} value={a.id}>{(a.full_name || "SANS NOM").toUpperCase()}</option>
              ))}
            </select>
            <label className="flex-[1.5] bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl font-black text-[10px] uppercase cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg text-white">
              <Upload size={16}/> Injecter fichier
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleAgentInjection} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {l:'BASE TOTALE', v:stats.total, c:'cyan', i:<DbIcon size={18}/>, f:'tous'},
          {l:'VENTES', v:stats.ventes, c:'emerald', i:<CheckCircle size={18}/>, f:'vente'},
          {l:'RAPPELS', v:stats.rappels, c:'amber', i:<Clock size={18}/>, f:'rappel'},
          {l:'NRP / REFUS', v:stats.nrp, c:'rose', i:<Activity size={18}/>, f:'nrp'}
        ].map((s, i) => (
          <button key={i} onClick={() => setStatusFilter(s.f)} className={`p-6 rounded-2xl border-l-4 transition-all text-left shadow-lg ${statusFilter === s.f ? 'bg-cyan-600/10 border-cyan-500' : theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center text-slate-500 text-[10px] font-black mb-2 uppercase tracking-widest">{s.l} {s.i}</div>
            <p className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.v}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        <div className={`lg:col-span-8 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden`}>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><ListFilter size={18} className="text-emerald-400"/> Historique</h3>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
              <input value={searchTerm || ""} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Chercher un lead..." className={`w-full border rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold outline-none ${theme === 'dark' ? 'bg-[#020617] border-white/5' : 'bg-slate-50 border-slate-200'}`} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 uppercase font-black border-b border-white/5">
                <tr><th className="pb-4 px-2">Agent</th><th className="pb-4">Client</th><th className="pb-4">Statut</th><th className="pb-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((l, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                    <td className="py-4 px-2">
                       <select 
                        value={l.agent_id || "STOCK"}
                        onChange={(e) => assignLead(l.id, e.target.value)}
                        className="bg-transparent text-cyan-400 text-[10px] font-black uppercase outline-none cursor-pointer border border-white/5 rounded p-1"
                       >
                         <option value="STOCK">📦 STOCK</option>
                         {agents.map(a => (
                           <option key={a.id} value={a.id}>{a.full_name?.toUpperCase()}</option>
                         ))}
                       </select>
                    </td>
                    <td className="py-4 font-bold text-[11px] uppercase">
                      {l.first_name} {l.last_name}
                      <p className="text-[9px] text-slate-500 font-mono">{l.phone}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${l.status === 'vente' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>{l.status || 'nouveau'}</span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button onClick={() => setActiveDetails(l)} className="p-2 bg-white/5 hover:bg-cyan-600 rounded-lg transition-all"><Info size={14}/></button>
                      <button onClick={() => deleteLead(l.id)} className="p-2 bg-white/5 hover:bg-rose-600 rounded-lg transition-all text-rose-400 hover:text-white"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`lg:col-span-4 h-[550px] ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} rounded-[2rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl`}>
          <div className="p-5 border-b border-white/5 font-black text-[10px] uppercase bg-white/5 flex justify-between items-center">Discussion Agents <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div></div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/10">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender_id === 'Admin' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-xl text-[11px] max-w-[85%] ${m.sender_id === 'Admin' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{m.content}</div>
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className={`flex gap-2 p-2 rounded-xl border ${theme === 'dark' ? 'bg-[#020617] border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (async () => { if(!newMessage.trim()) return; await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]); setNewMessage(""); fetchData(); })()} placeholder="Message..." className="flex-1 bg-transparent p-2 outline-none text-[10px] font-bold" />
              <button onClick={async () => { if(!newMessage.trim()) return; await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]); setNewMessage(""); fetchData(); }} className="bg-cyan-600 p-2 rounded-lg text-white"><Send size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AGENT PROFILE */}
      {selectedAgentProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border border-cyan-500/30 p-8 rounded-[3rem] w-full max-w-md shadow-3xl`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter">{selectedAgentProfile.full_name}</h4>
                <p className="text-[10px] text-cyan-500 font-black tracking-widest uppercase">Gestion Agent</p>
              </div>
              <button onClick={() => setSelectedAgentProfile(null)} className="text-slate-500 hover:text-white"><X/></button>
            </div>
            <div className="space-y-4">
              <button onClick={() => toggleAgentStatus(selectedAgentProfile.id, selectedAgentProfile.status)} className={`w-full p-4 rounded-2xl font-black text-xs uppercase flex items-center justify-between transition-all ${selectedAgentProfile.status === 'active' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {selectedAgentProfile.status === 'active' ? 'Suspendre' : 'Réactiver'} <Power size={18}/>
              </button>
            </div>
            <button onClick={() => setSelectedAgentProfile(null)} className="w-full mt-8 bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase">Fermer</button>
          </div>
        </div>
      )}

      {/* MODAL DIALER */}
      {showDialer && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
          <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} p-8 rounded-[3rem] border-2 border-cyan-500/30 w-full max-w-xs shadow-2xl relative`}>
            <button onClick={() => {setShowDialer(false); setPhoneNumber(""); handleHangup();}} className="absolute top-6 right-6 text-slate-500 hover:text-rose-500"><X size={24}/></button>
            <div className="text-center mb-6">
              <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">{isCalling ? "APPEL..." : "CLAVIER"}</p>
              <div className={`p-6 rounded-2xl text-3xl font-black border min-h-[80px] flex items-center justify-center tracking-widest transition-all ${isCalling ? 'text-emerald-400 border-emerald-500/50 animate-pulse' : theme === 'dark' ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'}`}>{phoneNumber || "---"}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map((n) => (
                <button key={n} onClick={() => setPhoneNumber(p => p + n)} className={`h-14 rounded-xl text-xl font-black transition-all active:scale-95 ${theme === 'dark' ? 'bg-white/5 hover:bg-cyan-500' : 'bg-slate-100 hover:bg-slate-200'}`}>{n}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPhoneNumber(p => p.slice(0, -1))} className="bg-slate-800 h-14 rounded-xl flex items-center justify-center text-rose-400 transition-all"><Delete size={20}/></button>
              {isCalling ? (
                <button onClick={handleHangup} className="bg-rose-600 h-14 rounded-xl flex items-center justify-center text-white"><PhoneOff size={20} fill="white"/></button>
              ) : (
                <button onClick={handleCall} className="bg-emerald-600 h-14 rounded-xl flex items-center justify-center text-white"><Phone size={20} fill="white"/></button>
              )}
              <button onClick={() => {setShowDialer(false); setPhoneNumber(""); handleHangup();}} className="col-span-2 bg-rose-600/10 text-rose-500 h-14 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase">Fermer</button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DÉTAILS DU LEAD (Bouton Info) */}
       {activeDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10003] flex items-center justify-center p-4">
          <div className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-white'} border border-cyan-500/30 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl`}>
          <div className="flex justify-between items-start mb-6">
            <div>
            <h4 className="text-2xl font-black uppercase italic text-cyan-500">
            {activeDetails.first_name} {activeDetails.last_name}
            </h4>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fiche Client Détail</p>
              </div>
                <button onClick={() => setActiveDetails(null)} className="text-slate-500 hover:text-rose-500 transition-colors"><X/></button>
              </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs font-bold">
        <div className="p-4 bg-black/10 rounded-xl border border-white/5">
          <p className="text-slate-500 text-[10px] mb-1 uppercase">Téléphone</p>
          <p className="text-lg">{activeDetails.phone}</p>
        </div>
        <div className="p-4 bg-black/10 rounded-xl border border-white/5">
          <p className="text-slate-500 text-[10px] mb-1 uppercase">Statut Actuel</p>
          <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 uppercase text-[10px]">{activeDetails.status}</span>
        </div>
        <div className="col-span-2 p-4 bg-black/10 rounded-xl border border-white/5">
          <p className="text-slate-500 text-[10px] mb-1 uppercase">Note de l'agent</p>
          <p className="italic text-slate-300">{activeDetails.notes || "Aucun commentaire pour le moment."}</p>
        </div>
      </div>

      <button 
        onClick={() => { setPhoneNumber(activeDetails.phone); setShowDialer(true); setActiveDetails(null); }} 
        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Phone size={18}/> APPELER CE CLIENT
      </button>
    </div>
  </div>
)}
    </div>
  );
}