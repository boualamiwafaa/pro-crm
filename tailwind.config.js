/** @type {import('tailwindcss').Config} */
module.exports = {
  // On s'assure que Tailwind regarde absolument partout dans ton projet Next.js
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // Ajouté pour tes fichiers utilitaires
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        // Ajout d'une couleur "slate" personnalisée pour ton design de luxe
        card: "#0f172a",
        border: "rgba(255, 255, 255, 0.1)",
      },
      // Permet d'utiliser tes arrondis personnalisés plus facilement
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      }
    },
  },
  plugins: [],
}