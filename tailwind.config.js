/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        black: '#000000',
        glass: 'rgba(255, 255, 255, 0.02)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        accent: '#ffffff',
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 0, 0, 0.08)',
        'glow-dark': '0 0 25px rgba(255, 255, 255, 0.08)',
        'glow-strong': '0 0 50px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        spin: 'spin 6s linear infinite',
        'spin-reverse': 'spin 3s linear infinite reverse',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        typingDot: 'typingDot 1.4s infinite ease-in-out both',
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        slideUp: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        toastEnter: 'toastEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        typingDot: {
          '0%, 80%, 100%': { transform: 'scale(0.4)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        toastEnter: {
          from: { opacity: '0', transform: 'translateY(15px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
