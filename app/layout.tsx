import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ProCrm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}