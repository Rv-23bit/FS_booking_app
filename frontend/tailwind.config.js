module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Brand colours taken from the Figma design.
      colors: {
        brand: '#50c2c9',        // main teal, used for buttons and highlights
        'brand-dark': '#2e8f95', // darker teal for hover and small text
        'brand-tint': '#dbf2f0', // light teal for badges
        page: '#f0f4f3',         // soft page background
        ink: '#1a1a1a',          // main text colour
        muted: '#737373',        // secondary text colour
      },
      fontFamily: {
        // Poppins is the main font, Righteous is only for the logo.
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        logo: ['Righteous', 'cursive'],
      },
    },
  },
  plugins: [],
};
