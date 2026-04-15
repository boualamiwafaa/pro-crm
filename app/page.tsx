"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Calendar, MessageSquare, Eraser } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AgentPage() {
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("En ligne");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);

  // Charger le prochain prospect assigné à l'Agent_1
  const fetchNextLead = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'nouveau')
      .eq('agent_id', 'Agent_1') // FILTRE ESSENTIEL POUR L'AGENT 1
      .limit(1)
      .maybeSingle();

    if (data) {
      setLead(data);
    } else {
      setLead(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNextLead(); }, []);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!lead) return;
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', lead.id);

    if (!error) fetchNextLead();
  };

  if (loading) return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Connexion à la base...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: '#1e293b', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#059669', padding: '8px 15px', borderRadius: '10px' }}>● {status}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin" style={{ backgroundColor: '#7c3aed', padding: '10px 20px', borderRadius: '10px', color: 'white', textDecoration: 'none' }}>SUPERVISEUR</Link>
          <Link href="/login" style={{ color: '#f87171', padding: '10px' }}>QUITTER</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
        
        {/* ACTIONS GAUCHE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setShowKeypad(!showKeypad)} style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '15px', color: 'white' }}>⌨️ CLAVIER MANUEL</button>
          {showKeypad && (
            <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '15px', border: '1px solid #3b82f6' }}>
              <div style={{ fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>{phoneNumber || "---"}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(n => (
                  <button key={n} onClick={() => setPhoneNumber(p => p + n)} style={{ padding: '10px', backgroundColor: '#1e293b', color: 'white' }}>{n}</button>
                ))}
              </div>
              <button onClick={() => setPhoneNumber("")} style={{ width: '100%', marginTop: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <Eraser size={14}/> EFFACER
              </button>
            </div>
          )}
        </div>

        {/* FICHE CLIENT */}
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #1e293b' }}>
          {!lead ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
               <h2>AUCUN PROSPECT DISPONIBLE</h2>
               <p style={{ color: '#94a3b8' }}>Demandez au superviseur d'injecter un fichier pour Agent_1.</p>
            </div>
          ) : (
            <>
              <h2 style={{ color: '#60a5fa' }}>{lead.last_name} {lead.first_name}</h2>
              <div style={{ margin: '20px 0', fontSize: '32px', color: '#10b981', fontWeight: 'bold' }}>{lead.phone}</div>
              <button 
                onClick={() => window.location.href=`tel:${lead.phone}`} 
                style={{ width: '100%', backgroundColor: '#f59e0b', padding: '20px', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
              >
                📞 APPELER MAINTENANT
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '30px' }}>
                <button onClick={() => handleUpdateStatus('vente')} style={{ backgroundColor: '#059669', padding: '15px', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>VENTE ✅</button>
                <button onClick={() => handleUpdateStatus('rappel')} style={{ backgroundColor: '#2563eb', padding: '15px', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>RAPPEL 📞</button>
                <button onClick={() => handleUpdateStatus('refus')} style={{ backgroundColor: '#991b1b', padding: '15px', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>REFUS ❌</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}