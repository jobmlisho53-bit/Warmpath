/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: { 50:'#FFF8F0',100:'#FFECD6',200:'#FFD4A8',300:'#FFB870',400:'#FF9A3C',500:'#F07A1A',600:'#D4600A',700:'#B04A06',800:'#8C3A07',900:'#6E2E08',950:'#3D1604' },
        terra:  { 50:'#FDF4F0',100:'#FAE4D8',200:'#F5C4AA',300:'#ED9B75',400:'#E3703F',500:'#C85528',600:'#A8421C',700:'#883318',800:'#6B2814',900:'#561F10',950:'#2E0E07' },
        sand:   { 50:'#FDFAF5',100:'#FAF3E7',200:'#F3E4C8',300:'#E8CFA0',400:'#D9B276',500:'#C49552',600:'#A87A3C',700:'#895F2E',800:'#6E4C26',900:'#5A3D20',950:'#301F0F' },
        ink:    { 50:'#F7F6F4',100:'#EDEAE5',200:'#D8D3CA',300:'#BCB4A8',400:'#9C9186',500:'#7E7268',600:'#655A51',700:'#504843',800:'#413B37',900:'#36312D',950:'#1C1815' },
        sage:   { 400:'#7FB069',500:'#5A8F48',600:'#466E38' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'subtle':     '0 1px 3px 0 rgba(28,24,21,0.08),0 1px 2px -1px rgba(28,24,21,0.06)',
        'card':       '0 4px 12px -2px rgba(28,24,21,0.12),0 2px 6px -2px rgba(28,24,21,0.08)',
        'lifted':     '0 10px 30px -4px rgba(28,24,21,0.18),0 4px 12px -4px rgba(28,24,21,0.12)',
        'glow-ember': '0 0 0 1px rgba(240,122,26,0.2),0 8px 24px -4px rgba(240,122,26,0.3)',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'scale-in':  'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':   'shimmer 2s linear infinite',
        'float':     'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { '0%':{ opacity:0, transform:'translateY(24px)' }, '100%':{ opacity:1, transform:'translateY(0)' } },
        fadeIn:  { '0%':{ opacity:0 }, '100%':{ opacity:1 } },
        scaleIn: { '0%':{ opacity:0, transform:'scale(0.92)' }, '100%':{ opacity:1, transform:'scale(1)' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        float:   { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}
