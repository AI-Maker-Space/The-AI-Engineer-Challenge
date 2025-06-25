module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wenge: 'hsl(346, 8%, 31%)',
        jasper: 'hsl(6, 65%, 57%)',
        'persian-orange': 'hsl(23, 51%, 60%)',
        isabelline: 'hsl(50, 21%, 95%)',
        mint: 'hsl(161, 49%, 58%)',
      },
    },
  },
  plugins: [],
};