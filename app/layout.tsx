import './globals.css'; // <--- VERIFIE BIEN CETTE LIGNE
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ProCrm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}