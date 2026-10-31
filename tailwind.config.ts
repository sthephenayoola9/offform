import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offform: {
          bg: "#F8F5F0",
          surface: "#FFFFFF",
          "surface-alt": "#F3EFE9",
          text: "#252321",
          "text-muted": "#77716D",
          "text-subtle": "#A49E99",
          border: "#E7E1DB",
          "border-dark": "#D1C8BF",
          crimson: "#A92735",
          "crimson-dark": "#791D29",
          "crimson-light": "#C93B4B",
          "crimson-tint": "#FDF2F4",
          "crimson-badge": "#FBECEE",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.08em",
        tightest: "-0.04em",
      },
      backgroundImage: {
        "editorial-hero": "radial-gradient(ellipse at 80% 20%, rgba(169, 39, 53, 0.12) 0%, rgba(248, 245, 240, 0) 70%)",
        "crimson-gradient": "linear-gradient(135deg, #A92735 0%, #791D29 100%)",
      },
      boxShadow: {
        editorial: "0 20px 40px -15px rgba(37, 35, 33, 0.05)",
        card: "0 2px 8px -2px rgba(37, 35, 33, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
