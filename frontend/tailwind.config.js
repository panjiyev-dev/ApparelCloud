/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fbf9eb',
          100: '#f4efa9',
          200: '#eddf77',
          300: '#e3c847',
          400: '#d9b026',
          500: '#D4AF37',
          600: '#b48a20',
          700: '#8e6518',
          800: '#6d4814',
          900: '#533310',
          950: '#2e1905',
        },
        navy: {
          900: '#080c14',
          800: '#0a0f1a',
          700: '#0e1420',
          600: '#111927',
          500: '#151f30',
          400: '#1a2640',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        gold:     '0 0 16px rgba(212, 175, 55, 0.15)',
        'gold-lg':'0 0 32px rgba(212, 175, 55, 0.25)',
        'gold-xl':'0 0 64px rgba(212, 175, 55, 0.12)',
        card:     '0 1px 4px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.4)',
        'card-lg':'0 4px 24px rgba(0,0,0,0.6), 0 8px 48px rgba(0,0,0,0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'sidebar':  '-4px 0 40px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-left': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212,175,55,0.08)' },
          '50%':      { boxShadow: '0 0 24px rgba(212,175,55,0.32)' },
        },
        'pulse-green': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 6px #10b981' },
          '50%':      { opacity: '0.6', boxShadow: '0 0 12px #10b981' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orb-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%':      { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.4s ease-out both',
        'fade-in':    'fade-in 0.3s ease-out both',
        'scale-in':   'scale-in 0.2s ease-out both',
        'slide-left': 'slide-left 0.35s ease-out both',
        shimmer:      'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'pulse-green':'pulse-green 2s ease-in-out infinite',
        float:        'float 6s ease-in-out infinite',
        'spin-slow':  'spin-slow 10s linear infinite',
        'orb-drift':  'orb-drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
