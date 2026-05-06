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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}