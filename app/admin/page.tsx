"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, LogOut, Send, MessageCircle, ShieldCheck, UserPlus, 
  CheckCircle, Clock, Activity, Database as DbIcon, Upload, RefreshCcw, FileSpreadsheet
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [loading, setLoading] = useState(true);

  // 1. CHARGEMENT INITIAL
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

  // 2. TEMPS RÉEL (REALTIME) - CORRIGÉ
  useEffect(() => {
    fetchData();

    // On écoute tout changement sur la table messages et leads
    const channel = supabase.channel('admin-full-realtime')
      .on(
        'postgres_changes' as any, // Correction ici avec "as any"
        { event: '*', table: 'messages', schema: 'public' }, 
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new]);
          } else {
            fetchData(); // Pour les updates/deletes
          }
        }
      )
      .on(
        'postgres_changes' as any, // Correction ici aussi
        { event: '*', table: 'leads', schema: 'public' }, 
        () => fetchData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 3. ACTIONS (SEND & LOGOUT)
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]);
    if (!error) setNewMessage("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleManualInject = async () => {
    const { error } = await supabase.from('leads').insert([
      { 
        first_name: "Nouveau", 
        last_name: "Prospect", 
        phone: "06" + Math.floor(Math.random() * 90000000), 
        status: "nouveau", 
        agent_id: selectedAgent,
        created_at: new Date().toISOString()
      }
    ]);
    if (!error) alert(`Lead injecté pour ${selectedAgent}`);
  };

  if (loading) return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white' }} className="flex items-center justify-center">
      <RefreshCcw className="animate-spin" size={40} />
    </div>
  );

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '30px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER PREMIUM AVEC DÉCONNEXION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)', padding: '20px 30px', borderRadius: '15px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#3b82f6', padding: '10px', borderRadius: '12px' }}><ShieldCheck size={24}/></div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>SUPERVISEUR ELITE</h1>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Casablanca CRM v2.5</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => window.location.href='/'} style={{ backgroundColor: '#334155', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Vue Agent</button>
          <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <LogOut size={18}/> DÉCONNEXION
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'BASE TOTALE', val: stats.total, color: '#3b82f6', icon: <DbIcon size={20}/> },
          { label: 'VENTES', val: stats.ventes, color: '#10b981', icon: <CheckCircle size={20}/> },
          { label: 'RAPPELS', val: stats.rappels, color: '#f59e0b', icon: <Clock size={20}/> },
          { label: 'NRP / PERDUS', val: stats.nrp, color: '#ef4444', icon: <Activity size={20}/> }
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '18px', border: '1px solid #1e293b', borderBottom: `4px solid ${s.color}` }}>
            <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>{s.label} {s.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginTop: '10px' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        
        {/* COLONNE GAUCHE : LEADS & DISPATCH */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, fontSize: '18px' }}><FileSpreadsheet color="#3b82f6"/> DISTRIBUTION AGENTS</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginTop: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>AGENT DESTINATAIRE</label>
                <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155', borderRadius: '10px' }}>
                  <option value="Agent_1">AGENT 1 (Ismael)</option>
                  <option value="Agent_2">AGENT 2 (Sara)</option>
                  <option value="Agent_3">AGENT 3 (Yassine)</option>
                </select>
              </div>
              <button onClick={handleManualInject} style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={18}/> INJECTER LEAD
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>PRODUCTION EN DIRECT</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '12px', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '15px' }}>AGENT</th>
                  <th style={{ padding: '15px' }}>CLIENT</th>
                  <th style={{ padding: '15px' }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 8).map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b', fontSize: '14px' }}>
                    <td style={{ padding: '15px', color: '#3b82f6', fontWeight: 'bold' }}>{l.agent_id}</td>
                    <td style={{ padding: '15px' }}>{l.first_name} {l.last_name}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ backgroundColor: l.status === 'vente' ? '#065f46' : '#1e293b', padding: '5px 12px', borderRadius: '20px', fontSize: '11px' }}>
                        {l.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLONNE DROITE : CHAT FONCTIONNEL */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '25px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '750px' }}>
          <div style={{ padding: '25px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
              <h3 style={{ margin: 0, fontSize: '16px' }}>CHAT ÉQUIPE</h3>
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', background: '#020617' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender_id === 'Admin' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textAlign: m.sender_id === 'Admin' ? 'right' : 'left' }}>{m.sender_id}</div>
                <div style={{ 
                  backgroundColor: m.sender_id === 'Admin' ? '#2563eb' : '#1e293b', 
                  padding: '12px 18px', borderRadius: m.sender_id === 'Admin' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  fontSize: '14px', border: m.sender_id === 'Admin' ? 'none' : '1px solid #334155'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '25px', borderTop: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: '12px', backgroundColor: '#1e293b', padding: '8px', borderRadius: '15px' }}>
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Message aux agents..." 
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: 'none', color: 'white', outline: 'none' }} 
              />
              <button onClick={sendMessage} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Database({size}: {size: number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg> }