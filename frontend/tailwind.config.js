/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        envana: {
          sidebar: '#F5EBE0',
          'sidebar-hover': '#EBD9C8',
          'sidebar-active': '#E5D0BA',
          teal: '#1e7b7d',
          'teal-light': '#2d9b9e',
          'teal-dark': '#165f61',
          coral: '#e57373',
          'coral-light': '#ef9a9a',
          'coral-dark': '#d85555',
          cream: '#FFFBF5',
          brown: '#6B5744',
          'brown-light': '#8B7564',
        },
      },
    },
  },
  plugins: [],
}
