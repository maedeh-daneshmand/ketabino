import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#183d36",
        mint: "#dff3e9",
        cream: "#faf9f4",
        clay: "#bd725f",
      },
      fontFamily: { sans: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
