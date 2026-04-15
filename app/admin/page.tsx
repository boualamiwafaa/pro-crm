"use client";
import React, { useState, useEffect } from 'react';
import { Users, Upload, LogOut, BarChart3, List, Send, MessageCircle, Activity, ShieldCheck, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [loading, setLoading] = useState(true);

  // 1. CHARGEMENT DES DONNÉES (LEADS + CHAT)
  const fetchData = async () => {
    const { data: l } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    const { data: m } = await supabase.from('messages').select('*').order('created_at', { ascending: true }).limit(50);
    
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
    // Ecoute en temps réel du chat et des leads
    const chatSub = supabase.channel('realtime').on('postgres_changes', { event: '*', table: '*' }, () => fetchData()).subscribe();
    return () => { supabase.removeChannel(chatSub); };
  }, []);

  // 2. ENVOYER UN MESSAGE CHAT
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert([{ content: newMessage, sender_id: 'Admin' }]);
    if (!error) setNewMessage("");
  };

  // 3. INJECTER ET DISPATCHER (SIMULATION D'IMPORT VERS AGENT)
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
    if (!error) alert(`Lead injecté et attribué à ${selectedAgent}`);
    fetchData();
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement Admin...</div>;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '25px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck color="#3b82f6"/> SUPERVISEUR CRM</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Gestion des flux et monitoring agents</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => window.location.href='/'} style={{ backgroundColor: '#1e293b', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Vue Agent</button>
          <button onClick={() => window.location.href='/login'} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><LogOut size={18}/> Déconnexion</button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'TOTAL BASE', val: stats.total, color: '#3b82f6', icon: <Database size={20}/> },
          { label: 'VENTES CONFIRMÉES', val: stats.ventes, color: '#10b981', icon: <CheckCircle size={20}/> },
          { label: 'RAPPELS PRÉVUS', val: stats.rappels, color: '#f59e0b', icon: <Clock size={20}/> },
          { label: 'NRP / ÉCHECS', val: stats.nrp, color: '#ef4444', icon: <Activity size={20}/> }
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', borderBottom: `4px solid ${s.color}` }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>{s.label} {s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '10px' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
        
        {/* COLONNE GAUCHE : DISPATCH & LISTE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* SECTION INJECTION */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><UserPlus size={20} color="#3b82f6"/> DISTRIBUTION DES LEADS</h3>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: '#94a3b8' }}>SÉLECTIONNER L'AGENT DESTINATAIRE</label>
                <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155', borderRadius: '10px', marginTop: '8px' }}>
                  <option value="Agent_1">AGENT 1 (Ismael)</option>
                  <option value="Agent_2">AGENT 2 (Sara)</option>
                  <option value="Agent_3">AGENT 3 (Yassine)</option>
                </select>
              </div>
              <button onClick={handleManualInject} style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>INJECTER FICHIER</button>
            </div>
          </div>

          {/* TABLEAU DE PRODUCTION */}
          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>HISTORIQUE DE PRODUCTION</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '13px', borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: '12px' }}>AGENT</th>
                  <th style={{ padding: '12px' }}>CLIENT</th>
                  <th style={{ padding: '12px' }}>TÉLÉPHONE</th>
                  <th style={{ padding: '12px' }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b', fontSize: '14px' }}>
                    <td style={{ padding: '12px', color: '#60a5fa' }}>{l.agent_id}</td>
                    <td style={{ padding: '12px' }}>{l.first_name} {l.last_name}</td>
                    <td style={{ padding: '12px' }}>{l.phone}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: l.status === 'vente' ? '#065f46' : '#1e293b', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLONNE DROITE : CHAT EN TEMPS RÉEL */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '700px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageCircle color="#10b981"/>
            <h3 style={{ fontSize: '16px', margin: 0 }}>CHAT ÉQUIPE</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender_id === 'Admin' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', textAlign: m.sender_id === 'Admin' ? 'right' : 'left' }}>{m.sender_id}</div>
                <div style={{ 
                  backgroundColor: m.sender_id === 'Admin' ? '#2563eb' : '#1e293b', 
                  padding: '12px', borderRadius: m.sender_id === 'Admin' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  fontSize: '14px'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '20px', backgroundColor: '#020617', borderRadius: '0 0 20px 20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Écrire aux agents..." 
                style={{ flex: 1, padding: '12px', backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', color: 'white' }} 
              />
              <button onClick={sendMessage} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}><Send size={20}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Icone manquante Database
function Database({size}: {size: number}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg> }