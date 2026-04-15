"use client";
import React, { useState, useEffect } from 'react';
import { Users, Upload, LogOut, BarChart3, Clock, List, CheckCircle, Headphones } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0, nrp: 0 });
  const [leads, setLeads] = useState<any[]>([]);
  const [agentStats, setAgentStats] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");

  const fetchData = async () => {
    const { data: allLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (allLeads) {
      setLeads(allLeads);
      setStats({
        total: allLeads.length,
        ventes: allLeads.filter(l => l.status === 'vente').length,
        rappels: allLeads.filter(l => l.status === 'rappel').length,
        nrp: allLeads.filter(l => l.status === 'nrp').length,
      });

      // Calculer les stats par agent
      const agents = ["Agent_1", "Agent_2", "Agent_3"];
      const s = agents.map(a => ({
        name: a,
        ventes: allLeads.filter(l => l.agent_id === a && l.status === 'vente').length,
        total: allLeads.filter(l => l.agent_id === a).length
      }));
      setAgentStats(s);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileUpload = async (e: any) => {
    // Ici ta logique d'import (CSV/Excel)
    // IMPORTANT : Lors de l'import, on assigne à l'agent sélectionné
    alert("Fichier reçu. Attribution à : " + selectedAgent);
    // ... ton code d'insertion ici ...
    fetchData();
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* BARRE DU HAUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px' }}>
        <h1 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 color="#3b82f6"/> DASHBOARD SUPERVISEUR</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
           <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', padding: '8px 15px' }}>Mode Agent</Link>
           <button onClick={() => window.location.href='/login'} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
             <LogOut size={16}/> Déconnexion
           </button>
        </div>
      </div>

      {/* STATS RAPIDES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>TOTAL LEADS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>VENTES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.ventes}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>RAPPELS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.rappels}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>NRP</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.nrp}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        
        {/* SECTION HISTORIQUE & SUIVI AGENTS */}
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><List size={18}/> PRODUCTION EN TEMPS RÉEL</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '12px', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '10px' }}>AGENT</th>
                <th style={{ padding: '10px' }}>CLIENT</th>
                <th style={{ padding: '10px' }}>STATUT</th>
                <th style={{ padding: '10px' }}>DERNIÈRE ACTION</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 15).map((l, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
                  <td style={{ padding: '12px' }}><span style={{ color: '#3b82f6' }}>{l.agent_id}</span></td>
                  <td style={{ padding: '12px' }}>{l.first_name} {l.last_name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: l.status === 'vente' ? '#065f46' : l.status === 'nrp' ? '#ef4444' : '#334155',
                      padding: '3px 8px', borderRadius: '4px', fontSize: '11px'
                    }}>{l.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{new Date(l.updated_at || l.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION INJECTION & PERFORMANCE AGENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* MODULE D'INJECTION */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>DISTRIBUTION FICHES</h3>
            <label style={{ fontSize: '11px', color: '#94a3b8' }}>CHOISIR L'AGENT DESTINATAIRE</label>
            <select 
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155', borderRadius: '8px', marginTop: '5px', marginBottom: '15px' }}
            >
              <option value="Agent_1">AGENT 1 (Ismael)</option>
              <option value="Agent_2">AGENT 2 (Sara)</option>
              <option value="Agent_3">AGENT 3 (Yassine)</option>
            </select>
            <div style={{ border: '2px dashed #334155', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <input type="file" onChange={handleFileUpload} style={{ fontSize: '12px' }} />
              <p style={{ fontSize: '10px', color: '#64748b', marginTop: '10px' }}>Fichier .csv ou .xlsx</p>
            </div>
          </div>

          {/* PERFORMANCE PAR AGENT */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>PERFORMANCE</h3>
            {agentStats.map(a => (
              <div key={a.name} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#1e293b', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>{a.name}</span>
                  <span style={{ color: '#10b981' }}>{a.ventes} Ventes</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#020617', borderRadius: '2px', marginTop: '5px' }}>
                  <div style={{ width: `${(a.ventes / (a.total || 1)) * 100}%`, height: '100%', backgroundColor: '#10b981' }}></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}