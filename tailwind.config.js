/** Tailwind config: brand colours and fonts live here so you can re-theme in one place. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: '#102B26', 800: '#17403A', 700: '#1F544C' }, // Midnight Emerald
        ivory: '#F8F5EF',
        gold: { DEFAULT: '#C5A46D', dark: '#9C7E48' },                 // Antique Gold
        charcoal: '#202321',
        sage: '#DDE5DC',
      },
      fontFamily: {
        // The Arabic-script font is listed in the stack so Arabic/Dari/Pashto glyphs fall back to it
        // automatically, even when a Latin font is first.
        serif: ['"Playfair Display"', '"Noto Sans Arabic"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 1px 2px rgba(16,43,38,.06), 0 8px 24px -12px rgba(16,43,38,.18)' },
    },
  },
  plugins: [],
};
