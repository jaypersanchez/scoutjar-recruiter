// tailwind.config.js
//import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // <- adjust if needed
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        input: "var(--input)",
        border: "var(--border)",
        ring: "var(--ring)",
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        DEFAULT: "0.375rem", // default Tailwind radius
        lg: "0.625rem", // based on your --radius
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // <- you already use this
  ],
};
