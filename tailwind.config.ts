import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#C66B4C',
                    dark: '#A8563B',
                    light: '#D88A6F',
                },
                neutral: {
                    cream: '#F7F5F0',
                    brown: {
                        900: '#2D241E',
                        700: '#4A4A4A',
                        500: '#9B8D82',
                    }
                },
                accent: {
                    green: '#4E6E50',
                    gold: '#D4AF37',
                },
                error: '#D64545',
                success: '#4CAF50',
            },
            fontFamily: {
                heading: ['Merriweather', 'Playfair Display', 'Georgia', 'serif'],
                body: ['Roboto', 'Helvetica Neue', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            borderRadius: {
                'button': '24px',
                'card': '12px',
                'nav': '4px',
                'icon': '8px',
            },
        },
    },
    plugins: [],
};

export default config;
