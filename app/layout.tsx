import './globals.css';
import type { Metadata } from 'next';
// Correction de l'import : Utilise le chemin relatif si l'alias @ pose problème
import AuthProvider from './components/AuthProvider'; 

export const metadata: Metadata = {
  title: "ProCrm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-[#020617] text-white">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1 min-h-0">{children}</div>
            <footer className="shrink-0 border-t border-white/5 py-4">
              <p className="text-center text-xs text-slate-400">
                © 2026 Wafaa Boualami - Casablanca Elite Services. Tous droits réservés.
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}