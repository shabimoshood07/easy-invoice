/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          1: "#cad2c5",
          2: "#84a98c",
          3: "#52796f",
          4: "#354f52",
          5: "#2f3e46",
        },

        secondary: {
          1: "#e9ecef",
        },
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
};
