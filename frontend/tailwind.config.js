/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2B2E59",
        letter: "#554E4E",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
