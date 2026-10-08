/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system"]
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(circle at top, rgba(59,130,246,0.4), transparent 60%), radial-gradient(circle at bottom, rgba(236,72,153,0.25), transparent 55%)"
      },
      boxShadow: {
        "soft-glass":
          "0 18px 45px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.15)"
      },
      backdropBlur: {
        xs: "2px"
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite"
      }
    }
  },
  plugins: []
};



