import type { Config } from "tailwindcss";
import { stages } from "@career/design-tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: stages,
      },
      fontFamily: {
        sans: [
          "var(--font-pretendard)",
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Apple SD Gothic Neo",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
