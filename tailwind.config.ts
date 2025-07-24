import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Vestira Brand Colors - Updated to correct values
        "deep-brand": "#3B0A45",
        "base-gray": "#6D6A75",
        "canvas-bg": "#F5F1EB", // Updated from "#F1ECE7" to new cream color
        "electric-blue": "#00B2FF",
        // Legacy aliases for compatibility
        deepBrand: "#3B0A45",
        baseGray: "#6D6A75",
        "dark-plum": "#3B0A45",
        // Additional contrast colors
        "light-gray": "#FAFAF9", // Slightly adjusted to complement new cream
        "medium-gray": "#E0DDD8", // Adjusted to work with new cream
        "border-gray": "#E0DDD8", // Consistent border color
        "brand-lightest": "#F8F9FA",
        "brand-primary": "#3B0A45",
        "brand-lighter": "#E9ECEF",
        "electric-blue-shade": "#0099E6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        vestira: "0 2px 8px rgba(59, 10, 69, 0.08)",
        "vestira-lg": "0 4px 16px rgba(59, 10, 69, 0.12)",
        "vestira-xl": "0 8px 32px rgba(59, 10, 69, 0.16)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
