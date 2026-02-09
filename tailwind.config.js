/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./*.html" 
  ],
  theme: {
    extend: {
                  colors: {
              brand: {
                red: "#E31C25", // الأحمر (لون الزر الرئيسي)
                blue: "#0F172A", // الأزرق الداكن (لون النصوص)
                dark: "#1a1a1a",
                light: "#f8f8f8",
              },
            },
            fontFamily: {
              sans: ["Cairo", "sans-serif"],
            },
            boxShadow: {
              glow: "0 0 20px rgba(227, 28, 37, 0.3)",
            },
    },
  },
  plugins: [],
}
