/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFF7F0",
        surface: "#FFFFFF",
        line: "#FBE1D6",
        ink: "#3A2E39",
        muted: "#A98CA5",
        purple: "#8134AF",
        pink: "#E1306C",
        orange: "#F77737",
        mint: "#33D6A6",
      },
      fontFamily: {
        display: ["Fredoka", "sans-serif"],
        body: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};