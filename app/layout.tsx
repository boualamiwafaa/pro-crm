import './globals.css';
import type { Metadata } from 'next';
// Correction de l'import : Utilise le chemin relatif si l'alias @ pose problème
import AuthProvider from './components/AuthProvider'; 

export const metadata: Metadata = {
  title: "ProCrm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className="h-full">
      <body className="h-full bg-[#020617] text-white">
        <AuthProvider>
          <div className="flex h-full min-h-screen flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            <footer className="mt-auto shrink-0 py-4">
              <p className="text-center text-xs text-gray-500 italic">
                © 2026 Wafaa Boualami - Casablanca Elite Services. Tous droits réservés.
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}