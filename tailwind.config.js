/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: "#F8D6D9",
        coral: "#E39FA9",
        teal: "#AFCADC",
        blue: "#2A5B7F",
        
        green: {
          DEFAULT: '#90CA4B',
          100: "#32A932"
        },
        gray: {
          DEFAULT: "#6F8293",
          100: "#1A2229BF",
          200: "#DDE0E2",
          300: "#F2F3F4",
          400: "#4E5C68"
        },
        white: {
          DEFAULT: "#FFFFFF",
          100: "#FFFFFFA6"
        },
        red: "#FF5BF7",
        orange: "#F59C1A",
        yellow: "#FFD900",
        purple: "#8753DE"
      }
    },
  },
  plugins: [],
}
