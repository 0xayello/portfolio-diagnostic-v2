/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paradigma Brand Colors
        paradigma: {
          dark: '#1a1b4b',      // Azul escuro principal (fundo)
          darker: '#12133a',    // Azul mais escuro
          navy: '#252659',      // Azul navy intermediário
          mint: '#3ecf8e',      // Verde menta/água (destaque principal)
          'mint-light': '#5fd9a4',
          'mint-dark': '#2eb87a',
          coral: '#ff6b6b',     // Coral para alertas
          orange: '#ff9f43',    // Laranja para gradientes
          gold: '#feca57',      // Dourado para destaques
        },
        // Semantic colors
        success: '#3ecf8e',
        warning: '#ff9f43',
        danger: '#ff6b6b',
        info: '#54a0ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-paradigma': 'linear-gradient(135deg, #1a1b4b 0%, #252659 50%, #1a1b4b 100%)',
        'gradient-mint': 'linear-gradient(135deg, #3ecf8e 0%, #2eb87a 100%)',
        'gradient-coral': 'linear-gradient(135deg, #ff6b6b 0%, #ff9f43 100%)',
        'gradient-gold': 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)',
        'gradient-hero': 'linear-gradient(135deg, #ff9f43 0%, #ff6b6b 50%, #ee5a24 100%)',
      },
      boxShadow: {
        'glow-mint': '0 0 20px rgba(62, 207, 142, 0.4)',
        'glow-mint-lg': '0 0 40px rgba(62, 207, 142, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(62, 207, 142, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(62, 207, 142, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
