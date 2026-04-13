import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// On commente temporairement la ligne ci-dessous car elle bloque le build Vercel
// import "./globals.css"; 
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProCrm",
  description: "Système de gestion d'appels et supervision d'élite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" style={{ backgroundColor: '#0b0f1a', color: 'white' }}>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          backgroundColor: '#0b0f1a', 
          color: 'white',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          fontFamily: 'sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}