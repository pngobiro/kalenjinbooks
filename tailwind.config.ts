import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1.5rem',
                lg: '3rem',
            },
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#E07856',
                    dark: '#C85D3A',
                    light: '#F09B7D',
                },
                'neutral-cream': '#F5F1E8',
                'neutral-brown': {
                    50: '#FAF8F5',
                    100: '#F0EBE4',
                    200: '#E0D5C7',
                    300: '#C5B8A8',
                    400: '#A89888',
                    500: '#9B8D82',
                    600: '#7D7068',
                    700: '#6B5D52',
                    800: '#574A3F',
                    900: '#4A3728',
                },
                'accent-green': '#8B9D83',
                'accent-gold': '#D4AF37',
                error: '#D64545',
                success: '#4CAF50',
            },
            fontFamily: {
                heading: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            borderRadius: {
                'button': '24px',
                'card': '12px',
                'nav': '4px',
                'icon': '8px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
