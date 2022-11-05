/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },

      colors: {
        ignite: {
          500: "#129E57",
        },
        yellow: {
          500: "#F7DD43",
          700: "#E5CD3D",
        },
        gray: {
          100: "#F5F5F5",
          300: "#8D8D99",
          600: "#323238",
          800: "#202024",
          900: "#121214",
        },
      },
    },
  },
  plugins: [],
};
