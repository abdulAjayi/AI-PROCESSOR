/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        screens:{
          'md':"680px"
        },
        colors:{
          deep1: "#12141a",
          deep2: "#1e2021",
          light1: "#2c2e2f",
          lightText: "#747577",
          detectionText: "#3a3c3e",
        }
      },
    },
    plugins: [require("tailwind-scrollbar-hide")],
  };
  