"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function AdminPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ imported: 0, total: 0 });

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // On transforme l'Excel en JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);
        setStats({ imported: 0, total: rawData.length });

        // On formate les données pour qu'elles correspondent exactement à ta base Supabase
        const formattedData = rawData.map(row => ({
          nom: row["nom"] || "",
          prenom: row["prénom"] || "",
          date_naissance: row["date de naissance"] || "",
          email: row["adresse mail"] || "",
          telephone: row["téléphone"] || row["tel"] || "", // Ajouté car indispensable pour appeler
          statut: 'nouveau',
          commentaire: `Adresse: ${row["adresse"] || ""} ${row["code postal"] || ""} ${row["ville"] || ""}`
        }));

        // Envoi par paquets vers Supabase
        const { error } = await supabase
          .from('leads')
          .insert(formattedData);

        if (error) throw error;

        setStats(prev => ({ ...prev, imported: rawData.length }));
        alert("Importation réussie ! " + rawData.length + " contacts ajoutés.");
      } catch (err: any) {
        alert("Erreur lors de l'import : " + err.message);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
        <h1 style={{ color: '#3b82f6', marginBottom: '10px' }}>Espace Superviseur</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Importez vos fichiers de prospection (.xlsx ou .csv)</p>

        <div style={{ border: '2px dashed #334155', borderRadius: '15px', padding: '40px', textAlign: 'center', backgroundColor: '#020617' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleImport} 
            style={{ display: 'none' }} 
            id="excel-upload"
            disabled={isUploading}
          />
          <label htmlFor="excel-upload" style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
            <Upload size={48} color={isUploading ? '#475569' : '#3b82f6'} style={{ marginBottom: '15px' }} />
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {isUploading ? "Importation en cours..." : "Cliquez pour choisir un fichier"}
            </div>
            <p style={{ color: '#64748b', marginTop: '10px' }}>Format accepté : Nom, Prénom, Téléphone, Adresse mail...</p>
          </label>
        </div>

        {stats.total > 0 && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FileText color="#3b82f6" />
            <span>{stats.imported} / {stats.total} contacts importés dans la base de données.</span>
          </div>
        )}

        <div style={{ marginTop: '30px', borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
           <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Retour au Dashboard Agent</a>
        </div>
      </div>
    </div>
  );
}