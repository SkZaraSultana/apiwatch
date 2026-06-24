/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        // Premium brand colors
        plum: {
          50: "#f5f1fa",
          100: "#ebe3f5",
          200: "#d7c7eb",
          300: "#c3abe1",
          400: "#8c5ba8",
          500: "#5B2A86", // Primary deep plum
          600: "#4a2270",
          700: "#3a185a",
          800: "#2a1044",
          900: "#1a082e",
        },
        coral: {
          50: "#fef5f2",
          100: "#fdebe7",
          200: "#fbd7cf",
          300: "#f9c3b7",
          400: "#f58d7f",
          500: "#FF7A70", // Secondary warm coral
          600: "#e65c52",
          700: "#cd3e34",
          800: "#b42016",
          900: "#9b0800",
        },
        gold: {
          50: "#fffbf0",
          100: "#fff8e1",
          200: "#fff1c3",
          300: "#ffeca5",
          400: "#f8c96d",
          500: "#F4B942", // Accent soft gold
          600: "#e6a320",
          700: "#d89100",
          800: "#b87900",
          900: "#986000",
        },
        slate: {
          50: "#f9f8f7",
          100: "#f3f1f0",
          200: "#e7e5e3",
          300: "#dbd8d5",
          400: "#9d9a95",
          500: "#5f5c57",
          600: "#3d3a35",
          700: "#2F2D3A", // Text dark slate
          800: "#1f1d28",
          900: "#0f0d12",
        },
        // Legacy brand color (kept for compatibility with existing dashboard)
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          800: "#312e81",
          900: "#1e1b4b",
        },
      },
      backgroundColor: {
        "cream": "#FFFDF8",
        "light": "#faf8f6",
      },
      textColor: {
        "dark-slate": "#2F2D3A",
      },
      backgroundImage: {
        "gradient-plum-coral": "linear-gradient(135deg, #5B2A86 0%, #FF7A70 100%)",
        "gradient-coral-peach": "linear-gradient(135deg, #FF7A70 0%, #ffb3a8 100%)",
        "gradient-gold-white": "linear-gradient(135deg, #F4B942 0%, #FFFDF8 100%)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(91, 42, 134, 0.08)",
        "soft": "0 20px 50px rgba(91, 42, 134, 0.12)",
        "premium": "0 20px 60px rgba(91, 42, 134, 0.15)",
        "card": "0 4px 20px rgba(91, 42, 134, 0.08)",
        "glow": "0 0 20px rgba(255, 122, 112, 0.3)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 122, 112, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 122, 112, 0.5)" },
        },
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

