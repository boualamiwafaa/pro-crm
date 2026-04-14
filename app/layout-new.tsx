import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ backgroundColor: '#020617', color: 'white', margin: 0, padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ border: '2px solid yellow', padding: '10px', marginBottom: '20px' }}>
          ✅ LE LAYOUT EST ENFIN CHARGÉ
        </div>
        {children}
      </body>
    </html>
  );
}