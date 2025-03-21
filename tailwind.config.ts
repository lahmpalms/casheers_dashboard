import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom breakpoints for consistent responsive design
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: {
          DEFAULT: "#ED6C1F", // Primary brand color
          hover: "#DD5300", // Hover state
          pressed: "#C04800", // Pressed state
          light: "#F7B589", // Light variant
          dark: "#A03A00", // Dark variant
        },
        text: {
          primary: "#1A1A1A", // Primary text
          secondary: "#7F7F7F", // Secondary text
          white: "#FFFFFF", // White text
        },
        accent: {
          blue: "#2A84FC", // Blue accent
          success: "#1AB079", // Success
          error: "#F20C1A", // Error
          warning: "#E09E1F", // Warning
        },
        background: {
          white: "#FFFFFF", // White background
          dark: "#1A1A1A", // Dark background
          gray: "#2A2A2A", // Gray background
          disabled: "#F7B589", // Disabled state
          light: {
            error: "#FFEAEA", // Light error background
            success: "#E1F5EE", // Light success background
            warning: "#FCF3E4", // Light warning background
            blue: "#E5EFFF", // Light blue background
          },
        },
        border: {
          DEFAULT: "#E6E6E6", // Default border
          select: "#ED6C1F", // Selected border
          button: "#F3F3F3", // Button border
          disabled: "#F7F7F7", // Disabled border
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
};

export default config; 