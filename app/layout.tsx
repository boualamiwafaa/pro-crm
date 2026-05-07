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
          <div className="flex flex-col min-h-screen">
            {children}
            <footer className="py-4 mt-auto">
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