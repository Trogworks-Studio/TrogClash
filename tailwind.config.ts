import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        swamp: {
          950: "#0E1A16",
          900: "#142A23",
          800: "#1F3A32",
          700: "#2C4F44",
          600: "#3D6B5A",
        },
        moss: {
          500: "#5C8A63",
          400: "#7FAA76",
        },
        parchment: {
          100: "#F3E7C9",
          200: "#E8D8AC",
          300: "#D9C48A",
        },
        goblin: {
          gold: "#D3A62B",
          copper: "#B4702E",
        },
        witch: {
          700: "#5B3573",
          500: "#7A4A9B",
        },
        ember: {
          600: "#C85A22",
          500: "#DB6E2E",
        },
        blood: {
          600: "#8C2E2E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Baloo 2", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 0 rgba(0,0,0,0.35), 0 10px 18px rgba(0,0,0,0.35)",
        panel: "inset 0 0 0 2px rgba(211,166,43,0.25), 0 10px 30px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "swamp-grain":
          "radial-gradient(circle at 20% 10%, rgba(211,166,43,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(122,74,155,0.08), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
