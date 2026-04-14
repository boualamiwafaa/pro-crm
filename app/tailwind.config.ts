import type { Config } from "tailwindcss";

const config: Config = {
  // Cette section est CRUCIALE pour que le style apparaisse sur tes nouvelles pages
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // Scanne tout le dossier app (login, admin, etc.)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // Au cas où tu utilises le dossier pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scanne tes composants réutilisables
    "./src/**/*.{js,ts,jsx,tsx,mdx}",      // Pour la sécurité si tu as un dossier src
  ],
  theme: {
    extend: {
      // Tu pourras ajouter tes couleurs personnalisées ici plus tard
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;