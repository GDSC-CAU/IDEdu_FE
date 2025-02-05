/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2B2E59",
        secondary: "#E2E2ED",
        letter: "#554E4E",
      },
      fontFamily: {
        jetbrains: ["JetBrains Mono", "monospace"],
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
