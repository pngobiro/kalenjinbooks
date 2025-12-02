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
                    DEFAULT: '#E07856',
                    dark: '#C85D3A',
                    light: '#F09B7D',
                },
                neutral: {
                    cream: '#F5F1E8',
                    brown: {
                        900: '#4A3728',
                        700: '#6B5D52',
                        500: '#9B8D82',
                    }
                },
                accent: {
                    green: '#8B9D83',
                    gold: '#D4AF37',
                },
                error: '#D64545',
                success: '#4CAF50',
            },
            fontFamily: {
                heading: ['Playfair Display', 'Georgia', 'serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
