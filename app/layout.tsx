import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ProCrm",
  description: "Solution CRM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}