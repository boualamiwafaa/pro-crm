"use client";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '25px', border: '2px solid #3b82f6', width: '350px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginBottom: '30px', fontWeight: 'black' }}>CONNEXION PROCRM</h2>
        <input type="text" placeholder="Identifiant" style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
        <input type="password" placeholder="Mot de passe" style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', backgroundColor: '#020617', border: '1px solid #334155', color: 'white' }} />
        <Link href="/" style={{ display: 'block', backgroundColor: '#3b82f6', padding: '15px', borderRadius: '10px', color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>SE CONNECTER</Link>
      </div>
    </div>
  );
}