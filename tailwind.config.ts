import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System — Brand purples
        nav:           "#170024",   // --purple-nav
        accent:        "#3a1165",   // --purple-accent
        "purple-hover":"#7C3AED",   // --purple-hover
        "logo-purple": "#A568E4",   // --purple-logo
        "purple-300":  "#d8b4fe",   // table headers
        "purple-50":   "#faf5ff",   // table stripe
        shell:         "#F5F0FA",   // --purple-shell
        "purple-border":"#E9DDF5",  // dividers

        // Design System — Foreground
        "fg-1":        "#1F1230",
        "fg-2":        "#4B3A66",
        "fg-3":        "#7A6B8E",
        "fg-disabled": "#B8AEC4",

        // Design System — Backgrounds
        "bg-app":          "#F5F0FA",
        "bg-surface":      "#FFFFFF",
        "bg-surface-alt":  "#faf5ff",
        "bg-hover":        "#F5F0FA",
        "bg-pressed":      "#E9DDF5",

        // Design System — Semantic
        success:          "#15803D",
        "success-bg":     "#DCFCE7",
        "success-border": "#86EFAC",
        warning:          "#B45309",
        "warning-bg":     "#FEF3C7",
        "warning-border": "#FCD34D",
        danger:           "#B91C1C",
        "danger-bg":      "#FEE2E2",
        "danger-border":  "#FECACA",
        info:             "#1D4ED8",
        "info-bg":        "#DBEAFE",
        "info-border":    "#93C5FD",

        // Núcleos
        gold: "#D4A017",

        // shadcn/ui tokens
        background: "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
      },
      borderRadius: {
        sm:   "6px",
        md:   "8px",
        lg:   "12px",
        pill: "999px",
        // shadcn compat
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        "elevation-1": "0 1px 2px rgba(23, 0, 36, 0.06)",
        "elevation-2": "0 8px 24px rgba(23, 0, 36, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
      },
      backgroundImage: {
        "gradient-destaque": "linear-gradient(135deg, #A568E4, #FCD34D)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
