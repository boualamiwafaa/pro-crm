import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "ProCrm - Solution CRM Professionnelle",
  description: "Plateforme de gestion de la relation client par Wafaa Agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="antialiased h-full bg-[#020617] text-white">
        <div className="p-5 font-sans">
          {children}
        </div>
      </body>
    </html>
  );
}