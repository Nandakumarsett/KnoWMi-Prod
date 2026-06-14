/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFF0E0',
          mid: '#FFBC70',
          dark: '#E07A00',
        },
        green: {
          india: '#138808',
          light: '#E8F5E3',
        },
        navy: {
          DEFAULT: '#000080',
          light: '#E8E8F5',
        },
        ink: {
          DEFAULT: '#0A0A0F',
          2: '#2A2A35',
          3: '#5A5A6E',
          4: '#9A9AAE',
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'phone-float': 'phoneFloat 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        phoneFloat: {
          '0%,100%': { transform: 'translateY(0px) rotateY(0deg) rotateX(0deg)' },
          '25%': { transform: 'translateY(-8px) rotateY(2deg) rotateX(1deg)' },
          '75%': { transform: 'translateY(-4px) rotateY(-2deg) rotateX(-1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(0.97)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
