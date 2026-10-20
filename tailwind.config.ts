import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E8E0CA", // manila — the page
        card: "#F5F0E1", // card stock
        cocoa: "#3B2417", // chocolate ink — text
        bark: "#6E5644", // secondary text
        olive: "#5E6330", // stamp ink — the one accent
        rule: "#C7B892", // drawer wood / hairlines
      },
      fontFamily: {
        display: ["Gloock", "Georgia", "serif"],
        sans: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
        type: ['"Courier Prime"', '"Courier New"', "monospace"],
      },
      screens: { xs: "420px" },
    },
  },
  plugins: [],
};

export default config;
