/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Hairqare Challenge sub-brand palette (figma-holiniq-brand brand book).
        white: '#FFFFFF',
        periwinkle: '#B2BAE0',
        plum: '#7375A6', // primary
        violet: '#E9EBFB', // light plum tint — card/panel backgrounds
        almond: '#EEDBC8',
        'almond-warm': '#F2DAC6',
        tangerine: '#F2B485', // accent / CTA buttons ONLY — never a background fill
        'tangerine-deep': '#DD8144', // hover for tangerine CTAs / text-links
        'cta-orange': '#FE6903', // bright orange CONTINUE pill in the live quiz
        'cta-orange-deep': '#E55E00', // hover for the bright orange CTA
        'reveal-bg': '#FFF9E6', // idx-10 reveal card background (light yellow)
        'reveal-border': '#FFE6B3', // idx-10 reveal card border
        'rich-black': '#3A2D32', // primary text (warm dark brown-black)
        shadow: '#696969', // muted text
        dove: '#F5F5F5', // soft background
        // Neutral ramp (warm) — borders, dividers, muted surfaces.
        neutral: {
          900: '#3A2D32',
          700: '#4E4247',
          500: '#756C70',
          400: '#9C9698',
          200: '#D8D5D6',
          100: '#EBEAEB',
        },
      },
      fontFamily: {
        // Body = Inter (loaded via @fontsource/inter in index.css).
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Headlines = Reckless Neue if available; graceful serif fallback
        // (no Reckless Neue font files ship in figma-holiniq-brand/).
        display: ['"Reckless Neue"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      borderRadius: {
        xl: '1rem', // 16px — cards
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px — feature cards
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(58, 45, 50, 0.18)',
        card: '0 2px 12px -6px rgba(115, 117, 166, 0.25)',
      },
    },
  },
  plugins: [],
}
