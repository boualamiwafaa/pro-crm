"use client";
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck size={48} className="text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-slate-900">ProCrm Login</h1>
          <p className="text-slate-500">Accès réservé aux agents</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="nom@agence.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Mot de passe</label>
            <input type="password" className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all">
            SE CONNECTER
          </button>
        </form>
      </div>
    </div>
  );
}