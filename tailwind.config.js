/** @type {import('tailwindcss').Config} */
module.exports = {
  // On force Tailwind à scanner tous les dossiers possibles pour ne rien rater
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tes couleurs de base pour le CRM
        background: "#020617",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        // Couleurs spécifiques pour tes cartes et bordures "Elite"
        card: "#0f172a",
        border: "rgba(255, 255, 255, 0.1)",
      },
      // Tes arrondis personnalisés pour l'effet moderne
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      }
    },
  },
  plugins: [],
}