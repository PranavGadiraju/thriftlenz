import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        canvas: "#F7F5F1",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1C1B18",
          soft: "#3A3833",
        },
        muted: {
          DEFAULT: "#767268",
          foreground: "#8D897E",
        },
        line: {
          DEFAULT: "#E4E0D8",
          strong: "#D3CEC3",
        },
        accent: {
          DEFAULT: "#5F6B54",
          hover: "#4C563F",
          soft: "#ECEEE6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.14em" }],
      },
      borderRadius: {
        card: "1.25rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,27,24,0.04)",
        lift: "0 18px 40px -24px rgba(28,27,24,0.28)",
        panel: "0 24px 60px -32px rgba(28,27,24,0.35)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
