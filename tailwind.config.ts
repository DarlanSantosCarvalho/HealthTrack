import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-dm-serif)", "serif"],
      },
      colors: {
        green:  { DEFAULT:"#498467", light:"#5fa37e", pale:"#eef5f1", mid:"#d6ece0" },
        blue:   { DEFAULT:"#1C6E8C", light:"#2589ae", pale:"#eaf4f8" },
        dark:   "#0f1c22",
        mid:    "#374f5c",
        muted:  "#7a94a0",
        border: { DEFAULT:"#d8e6eb", light:"#edf4f7" },
        surface:"#f4f8fa",
      },
      animation: {
        "fade-up":         "fadeUp .5s cubic-bezier(.16,1,.3,1) both",
        "fade-up-delay":   "fadeUp .5s cubic-bezier(.16,1,.3,1) .1s both",
        "fade-up-delay-2": "fadeUp .5s cubic-bezier(.16,1,.3,1) .2s both",
        "drift-1":         "drift 12s ease-in-out infinite alternate",
        "drift-2":         "drift 12s ease-in-out 4s infinite alternate",
        "pulse-dot":       "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from:{opacity:"0",transform:"translateY(16px)"}, to:{opacity:"1",transform:"translateY(0)"} },
        drift:    { "0%":{transform:"translate(0,0) scale(1)"},      "100%":{transform:"translate(30px,-20px) scale(1.08)"} },
        pulseDot: { "0%,100%":{boxShadow:"0 0 0 3px rgba(95,191,138,.25)"}, "50%":{boxShadow:"0 0 0 6px rgba(95,191,138,.1)"} },
      },
    },
  },
  plugins: [],
};

export default config;
