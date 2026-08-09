/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Single dominant accent — Signal Cyan
        'signal': {
          DEFAULT: '#34e3e6',
          deep: '#0e8a99',
          soft: '#1b6e7a',
        },
        // Secondary only — Amber (副职业 / 告警)
        'amber': {
          DEFAULT: '#f6b53d',
          deep: '#b9791f',
        },
        // Cool blue-gray neutrals
        'ink': {
          DEFAULT: '#c9d6e2',
          muted: '#8ba2b5',
          dim: '#5f7589',
          faint: '#3a4756',
        },
      },
      fontFamily: {
        'display': ['Oxanium', 'Rajdhani', 'system-ui', 'sans-serif'],
        'hud': ['Rajdhani', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        'mono': ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
        'cn': ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
