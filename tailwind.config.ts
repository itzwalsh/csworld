import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      colors: {
        text: "#e9f8fc",
        background: "#0B0E0F",
        primary: "#7c2613",
        secondary: "#031316",
        accent: "#c83d1e",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
