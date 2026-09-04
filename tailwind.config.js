/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF1F6",
          100: "#D6DCE8",
          200: "#AEB9D1",
          300: "#8595B9",
          400: "#5C71A1",
          500: "#3D5285",
          600: "#243A6B",
          700: "#152A54",
          800: "#0F1E3D",
          900: "#0A1428",
          950: "#060B18",
        },
        ink: {
          50: "#F7F8FA",
          100: "#EEF0F3",
          200: "#DFE3E9",
          300: "#C7CDD6",
          400: "#9AA4B2",
          500: "#6B7684",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: { 50: "#ECFDF3", 500: "#12A150", 600: "#0E8A44" },
        warning: { 50: "#FFFBEB", 500: "#D69411", 600: "#B57A0C" },
        danger: { 50: "#FEF2F2", 500: "#DC2A2A", 600: "#B91C1C" },
        gold: { 50: "#FBF7ED", 400: "#D2A94B", 500: "#B8912F", 600: "#96741F" },
      },
      fontFamily: {
        sans: ["Public Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 30, 61, 0.06), 0 1px 3px 0 rgba(15, 30, 61, 0.08)",
        raised: "0 4px 14px 0 rgba(15, 30, 61, 0.10)",
        popover: "0 12px 32px -8px rgba(10, 20, 40, 0.22)",
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      spacing: { 18: "4.5rem", 88: "22rem" },
      maxWidth: { content: "1200px" },
      keyframes: {
        "fade-in": { "0%": { opacity: 0, transform: "translateY(4px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        "sheet-up": { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
        "sheet-up": "sheet-up 220ms cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
