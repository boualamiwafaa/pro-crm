import type { Config } from "tailwindcss";

const config: Config = {
content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ".//**/*.{js,ts,jsx,tsx,mdx}", // Ajoute cette ligne pour scanner TOUT le projet
  ],
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;