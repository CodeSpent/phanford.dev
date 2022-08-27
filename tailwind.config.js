module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "midnight-blue": "rgb(0, 0, 22)",
        "black-glass": "rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
