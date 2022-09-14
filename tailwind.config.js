module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "midnight-blue": "rgb(0, 0, 22)",
        "black-glass": "rgba(0, 0, 0, 0.65)",
        "darkened-black-glass": "rgba(0,0,0,0.95)",
        charcoal: "rgba(4, 4, 4, 0.25)",
      },
      scale: {
        110: "1.10",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
