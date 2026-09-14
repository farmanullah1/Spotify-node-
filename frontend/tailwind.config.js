/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-black': '#000000',
        'spotify-base': '#121212',
        'spotify-surface': '#181818',
        'spotify-card': '#181818',
        'spotify-card-hover': '#282828',
        'spotify-green': '#1DB954',
        'spotify-green-hover': '#1ed760',
        'spotify-subtext': '#B3B3B3',
        'spotify-muted': '#727272',
        'spotify-border': '#282828',
      },
      fontFamily: {
        sans: ['Inter', 'Circular Std', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'spotify-card': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'spotify-glow': '0 0 20px rgba(29, 185, 84, 0.4)',
        'spotify-glow-lg': '0 0 35px rgba(29, 185, 84, 0.6)',
      },
      animation: {
        'equalizer-1': 'equalizer1 1.2s ease-in-out infinite',
        'equalizer-2': 'equalizer2 1.4s ease-in-out infinite',
        'equalizer-3': 'equalizer3 1.1s ease-in-out infinite',
        'equalizer-4': 'equalizer4 1.3s ease-in-out infinite',
      },
      keyframes: {
        equalizer1: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '16px' },
        },
        equalizer2: {
          '0%, 100%': { height: '14px' },
          '50%': { height: '6px' },
        },
        equalizer3: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '18px' },
        },
        equalizer4: {
          '0%, 100%': { height: '12px' },
          '50%': { height: '4px' },
        },
      },
    },
  },
  plugins: [],
}
