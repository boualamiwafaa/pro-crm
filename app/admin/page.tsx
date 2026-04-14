"use client";
import React from 'react';
import { Shield, Users, BarChart, Upload, PhoneForwarded, History } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#7c3aed', fontWeight: 'black', fontSize: '32px' }}>ESPACE SUPERVISEUR</h1>
        <Link href="/" style={{ backgroundColor: '#1e293b', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', color: 'white', border: '1px solid #7c3aed' }}>RETOUR AGENT</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '1100px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', borderTop: '5px solid #3b82f6', textAlign: 'center' }}>
          <Users color="#3b82f6" style={{ marginBottom: '10px' }}/>
          <h3 style={{ fontSize: '12px', color: '#94a3b8' }}>AGENTS EN LIGNE</h3>
          <p style={{ fontSize: '35px', fontWeight: 'black' }}>12</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', borderTop: '5px solid #10b981', textAlign: 'center' }}>
          <BarChart color="#10b981" style={{ marginBottom: '10px' }}/>
          <h3 style={{ fontSize: '12px', color: '#94a3b8' }}>PRODUCTION JOUR</h3>
          <p style={{ fontSize: '35px', fontWeight: 'black', color: '#10b981' }}>48</p>
        </div>
        
        {/* BOUTON IMPORTATION (POUR LE SUPERVISEUR) */}
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '2px dashed #7c3aed', textAlign: 'center', cursor: 'pointer' }}>
          <Upload color="#7c3aed" style={{ marginBottom: '10px' }}/>
          <h3 style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 'bold' }}>INJECTER FICHIER LEADS</h3>
          <p style={{ fontSize: '10px', color: '#64748b' }}>CSV / EXCEL (MAX 5000 lignes)</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', maxWidth: '1100px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PhoneForwarded size={20}/> SUIVI TEMPS RÉEL
          </h3>
          <div style={{ borderLeft: '2px solid #1e293b', paddingLeft: '15px' }}>
            <p style={{ marginBottom: '15px', color: '#10b981', fontSize: '14px' }}>● Agent 01 : En appel (04:12)</p>
            <p style={{ marginBottom: '15px', color: '#d97706', fontSize: '14px' }}>● Agent 02 : Pause Café</p>
            <p style={{ marginBottom: '15px', color: '#10b981', fontSize: '14px' }}>● Agent 03 : En appel (02:45)</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={20}/> HISTORIQUE PRODUCTION
          </h3>
          <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: '#3b82f6', height: '40%' }}></div>
            <div style={{ flex: 1, backgroundColor: '#3b82f6', height: '80%' }}></div>
            <div style={{ flex: 1, backgroundColor: '#3b82f6', height: '60%' }}></div>
            <div style={{ flex: 1, backgroundColor: '#3b82f6', height: '90%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}