"use client";
export default function AdminPage() {
  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#7c3aed', marginBottom: '30px', fontWeight: 'black', fontSize: '32px' }}>TABLEAU DE BORD ADMIN</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%', maxWidth: '1000px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', borderTop: '4px solid #3b82f6', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#94a3b8' }}>AGENTS EN LIGNE</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold' }}>12</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', borderTop: '4px solid #10b981', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#94a3b8' }}>VENTES JOUR</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#10b981' }}>45</p>
        </div>
        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '15px', borderTop: '4px solid #f59e0b', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#94a3b8' }}>APPELS EN COURS</h3>
          <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#f59e0b' }}>08</p>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: '1000px', backgroundColor: '#0f172a', padding: '20px', borderRadius: '20px', border: '1px solid #334155' }}>
        <h3 style={{ marginBottom: '20px' }}>SUIVI TEMPS RÉEL</h3>
        <div style={{ borderLeft: '2px solid #334155', paddingLeft: '20px' }}>
          <p style={{ color: '#10b981' }}>● Agent #01 : En appel (04:12)</p>
          <p style={{ color: '#f59e0b' }}>● Agent #02 : En pause café</p>
          <p style={{ color: '#10b981' }}>● Agent #03 : En appel (01:45)</p>
        </div>
      </div>
    </div>
  );
}