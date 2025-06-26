/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "selective-yellow": "#FFB703",
        "eerie-black-1": "#171717",
        "eerie-black-2": "#121212",
        "quick-silver": "#A6A6A6",
        "radical-red": "#FF2D55",
        "light-gray": "#CCCCCC",
        isabelline: "#F5F2ED",
        "gray-x-11": "#BABABA",
        kappel: "#2ABDBB",
        platinum: "#E6E6E6",
        "gray-web": "#808080",
      },
      fontFamily: {
        "league-spartan": ['"League Spartan"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
