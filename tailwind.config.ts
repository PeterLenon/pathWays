import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep navy (trust, authority)
        "primary": "#00366d",
        "primary-container": "#1a4d8c",
        "on-primary": "#ffffff",
        "on-primary-container": "#9abfff",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#a8c8ff",
        "on-primary-fixed": "#001b3c",
        "on-primary-fixed-variant": "#0f4685",
        "inverse-primary": "#a8c8ff",
        "surface-tint": "#315f9f",
        // Secondary — forest green (growth, upward mobility)
        "secondary": "#1b6d24",
        "secondary-container": "#a0f399",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#217128",
        "secondary-fixed": "#a3f69c",
        "secondary-fixed-dim": "#88d982",
        "on-secondary-fixed": "#002204",
        "on-secondary-fixed-variant": "#005312",
        // Tertiary — deep teal
        "tertiary": "#003e35",
        "tertiary-container": "#00574c",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#7bccbc",
        "tertiary-fixed": "#a0f2e1",
        "tertiary-fixed-dim": "#84d5c5",
        "on-tertiary-fixed": "#00201b",
        "on-tertiary-fixed-variant": "#005046",
        // Surface hierarchy — blue-tinted whites
        "background": "#f3faff",
        "surface": "#f3faff",
        "surface-bright": "#f3faff",
        "surface-dim": "#c7dde9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#e6f6ff",
        "surface-container": "#dbf1fe",
        "surface-container-high": "#d5ecf8",
        "surface-container-highest": "#cfe6f2",
        "surface-variant": "#cfe6f2",
        // On-surface
        "on-background": "#071e27",
        "on-surface": "#071e27",
        "on-surface-variant": "#424750",
        "inverse-surface": "#1e333c",
        "inverse-on-surface": "#dff4ff",
        // Outline
        "outline": "#737781",
        "outline-variant": "#c3c6d2",
        // Error
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
