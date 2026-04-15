"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Users, BarChart3, Clock, Database, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, ventes: 0, rappels: 0 });
  const [importing, setImporting] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");

  const fetchStats = async () => {
    const { data } = await supabase.from('leads').select('*');
    if (data) {
      setLeads(data);
      setStats({
        total: data.length,
        ventes: data.filter(l => l.status === 'vente').length,
        rappels: data.filter(l => l.status === 'rappel').length
      });
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    // Simulation simple pour l'exemple (à coupler avec une lib type XLSX si besoin pour parser le Excel)
    // Ici on crée un prospect de test pour vérifier que l'importation fonctionne avec les colonnes
    const { error } = await supabase.from('leads').insert([
      { 
        first_name: "Test", 
        last_name: "Import", 
        phone: "0600000000", 
        agent_id: selectedAgent, 
        status: 'nouveau' 
      }
    ]);

    if (error) alert("Erreur d'import : " + error.message);
    else {
      alert("Fichier importé avec succès pour " + selectedAgent);
      fetchStats();
    }
    setImporting(false);
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '30px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER ADMIN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0 }}>ESPACE SUPERVISEUR</h1>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Gestion de la production et dispatching</p>
        </div>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', backgroundColor: '#1e293b', padding: '10px 20px', borderRadius: '10px' }}>
          <ArrowLeft size={18}/> Retour Agent
        </Link>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Users color="#3b82f6" />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</span>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>TOTAL BASE</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Clock color="#f59e0b" />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.rappels}</span>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>RAPPELS</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <BarChart3 color="#10b981" />
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.ventes}</span>
          </div>
          <p style={{ color: '#94a3b8', marginBottom: 0 }}>VENTES</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* DISPATCHING SECTION */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h3 style={{ marginBottom: '20px' }}>DISPATCHING AGENT</h3>
          
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>SÉLECTIONNER L'AGENT</label>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            style={{ width: '100%', padding: '12px', backgroundColor: '#020617', color: 'white', border: '1px solid #334155', borderRadius: '10px', marginBottom: '20px' }}
          >
            <option value="Agent_1">AGENT 1</option>
            <option value="Agent_2">AGENT 2</option>
            <option value="Agent_3">AGENT 3</option>
          </select>

          <div style={{ border: '2px dashed #334155', padding: '40px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <input type="file" id="fileInput" hidden onChange={handleFileUpload} />
            <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
              <Upload size={40} color="#3b82f6" style={{ marginBottom: '10px' }} />
              <p style={{ margin: 0 }}>{importing ? "Importation..." : "INJECTER EXCEL"}</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Format: Nom, Prénom, Téléphone...</span>
            </label>
          </div>
        </div>

        {/* HISTORIQUE RÉCENT */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h3 style={{ marginBottom: '20px' }}>HISTORIQUE RÉCENT</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '13px' }}>
                <th style={{ padding: '10px' }}>Agent</th>
                <th style={{ padding: '10px' }}>Client</th>
                <th style={{ padding: '10px' }}>Statut</th>
                <th style={{ padding: '10px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 10).map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #0f172a', fontSize: '14px' }}>
                  <td style={{ padding: '12px' }}>{l.agent_id}</td>
                  <td style={{ padding: '12px' }}>{l.first_name} {l.last_name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: l.status === 'vente' ? '#065f46' : l.status === 'rappel' ? '#92400e' : '#1e293b',
                      padding: '4px 8px', borderRadius: '5px', fontSize: '11px'
                    }}>
                      {l.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#64748b' }}>
                    {new Date(l.updated_at || l.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}