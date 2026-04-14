import type { Metadata } from 'next'
import './globals.css'

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
// Version forcee 2
