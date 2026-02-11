/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#40B59D',
        'background-light': '#f6f8f7',
        'background-dark': '#12201d',
        'foreground-light': '#1f2937',
        'foreground-dark': '#f9fafb',
        'muted-light': '#6b7280',
        'muted-dark': '#9ca3af',
        'subtle-light': '#e5e7eb',
        'subtle-dark': '#2a3835',
        'content-light': '#111827',
        'content-dark': '#f3f4f6',
        'surface-light': '#ffffff',
        'surface-dark': '#1f2f2b',
        'border-light': '#DCE4E3',
        'border-dark': '#2A3F3A',
        'text-light': '#111827',
        'text-dark': '#f3f4f6',
        'placeholder-light': '#9ca3af',
        'placeholder-dark': '#6b7280',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
