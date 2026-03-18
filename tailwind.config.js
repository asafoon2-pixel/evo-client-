// Enhanced by EVO Agent
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'evo-black':    '#0A0A0A',
        'evo-surface':  '#141414',
        'evo-card':     '#1A1A1A',
        'evo-elevated': '#222222',
        'evo-border':   '#2A2A2A',
        'evo-accent':   '#C9A96E',
        'evo-muted':    '#888888',
        'evo-dim':      '#444444',
        'evo-success':  '#10b981',
        'evo-warning':  '#f59e0b',
        'evo-error':    '#ef4444',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      borderRadius: {
        'evo':    '16px',
        'evo-sm': '10px',
        'evo-lg': '24px',
      },
      boxShadow: {
        'evo-sm':     '0 1px 3px rgba(0,0,0,0.4)',
        'evo-md':     '0 4px 16px rgba(0,0,0,0.5)',
        'evo-lg':     '0 8px 32px rgba(0,0,0,0.6)',
        'evo-accent': '0 4px 24px rgba(201,169,110,0.2)',
      },
      transitionTimingFunction: {
        'evo': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both',
        'fade-in':   'fadeIn 0.4s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in':  'scaleIn 0.35s cubic-bezier(0.4,0,0.2,1) both',
        'shimmer':   'shimmer 1.6s infinite linear',
        'spin-slow': 'spin 1.4s linear infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:  { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer:  { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
    },
  },
  plugins: [],
}
