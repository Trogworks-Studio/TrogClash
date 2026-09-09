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
        "card-lg": "0 10px 0 rgba(0,0,0,0.4), 0 18px 28px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.15)",
        "gem": "inset 0 2px 3px rgba(255,255,255,0.55), inset 0 -3px 4px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.5)",
        "frame": "0 0 0 3px rgba(211,166,43,0.55), 0 0 0 6px rgba(14,26,22,0.9), 0 14px 34px rgba(0,0,0,0.55)",
        "glow-legendary": "0 0 0 3px rgba(211,166,43,0.6), 0 0 24px rgba(211,166,43,0.55), 0 10px 0 rgba(0,0,0,0.4)",
        "glow-epic": "0 0 0 3px rgba(122,74,155,0.6), 0 0 20px rgba(122,74,155,0.5), 0 10px 0 rgba(0,0,0,0.4)",
        "glow-rare": "0 0 0 3px rgba(56,189,248,0.55), 0 0 16px rgba(56,189,248,0.45), 0 10px 0 rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "swamp-grain":
          "radial-gradient(circle at 20% 10%, rgba(211,166,43,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(122,74,155,0.08), transparent 45%)",
        "board-felt":
          "radial-gradient(circle at 50% 0%, rgba(211,166,43,0.08), transparent 55%), radial-gradient(circle at 15% 100%, rgba(122,74,155,0.10), transparent 50%), radial-gradient(circle at 85% 100%, rgba(56,189,248,0.06), transparent 50%), linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.05) 85%, rgba(0,0,0,0.3))",
        "gem-shine": "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
