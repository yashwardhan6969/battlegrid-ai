import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1020",
        panel: "#0F162E",
        accent: "#2EE59D",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      boxShadow: {
        glow: "0 0 20px rgba(46, 229, 157, 0.3)"
      }
    },
  },
  plugins: [],
};
export default config;
