"use client";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { Upload, History, CheckCircle, Users, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("Agent_1");
  const [dbStats, setDbStats] = useState({ total: 0, ventes: 0, rappels: 0 });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);

  const loadData = async () => {
    const { data: allLeads } = await supabase.from('leads').select('status');
    if (allLeads) {
      setDbStats({
        total: allLeads.length,
        ventes: allLeads.filter(d => d.status === 'vente').length,
        rappels: allLeads.filter(d => d.status === 'rappel').length
      });
    }
    const { data: latest } = await supabase
      .from('leads')
      .select('last_name, first_name, status, agent_id, updated_at')
      .neq('status', 'nouveau')
      .order('updated_at', { ascending: false })
      .limit(10);
    if (latest) setRecentCalls(latest);
  };

  useEffect(() => { loadData(); }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const rawData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        const formatted = rawData.map(row => {
          const findValue = (keywords: string[]) => {
            const key = Object.keys(row).find(k => 
              keywords.some(kw => k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(kw))
            );
            return key ? row[key] : "";
          };

          return {
            last_name: findValue(['nom', 'lastname', 'client']).toString().toUpperCase(),
            first_name: findValue(['prenom', 'firstname']).toString(),
            phone: findValue(['tel', 'phone', 'mobile']).toString().replace(/\s/g, ''),
            status: 'nouveau',
            agent_id: selectedAgent,
            updated_at: new Date().toISOString()
          };
        });

        const { error } = await supabase.from('leads').insert(formatted.filter(l => l.phone.length > 5));
        if (error) throw error;
        alert("Importation réussie !");
        loadData();
      } catch (err: any) {
        alert("Erreur: " + err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '30px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>ESPACE SUPERVISEUR</h1>
        <Link href="/" style={{ backgroundColor: '#1e293b', padding: '10px 20px', borderRadius: '10px', color: 'white', textDecoration: 'none' }}>← Retour Agent</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <Users color="#3b82f6" /> <h3>TOTAL BASE</h3> <p style={{ fontSize: '24px' }}>{dbStats.total}</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <History color="#f59e0b" /> <h3>RAPPELS</h3> <p style={{ fontSize: '24px', color: '#f59e0b' }}>{dbStats.rappels}</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' }}>
          <CheckCircle color="#10b981" /> <h3>VENTES</h3> <p style={{ fontSize: '24px', color: '#10b981' }}>{dbStats.ventes}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #3b82f6' }}>
          <h2 style={{ fontSize: '16px' }}>DISPATCHING AGENT</h2>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ width: '100%', padding: '12px', margin: '15px 0', backgroundColor: '#020617', color: 'white', borderRadius: '10px' }}>
            <option value="Agent_1">AGENT 1</option>
            <option value="Agent_2">AGENT 2</option>
          </select>
          <input type="file" id="xl" onChange={handleImport} style={{ display: 'none' }} />
          <label htmlFor="xl" style={{ display: 'block', padding: '30px', border: '2px dashed #334155', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }}>
            <Upload color="#3b82f6" /> <br/> {isUploading ? "IMPORTATION..." : "INJECTER EXCEL"}
          </label>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <h2>HISTORIQUE RÉCENT</h2>
          <table style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', textAlign: 'left' }}>
                <th>Agent</th><th>Client</th><th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>{call.agent_id}</td>
                  <td>{call.last_name}</td>
                  <td>{call.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}