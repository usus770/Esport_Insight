/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dota: {
                    black: '#0b0b0b', // Deepest Obsidian
                    charcoal: '#1A1A1D', // Panel Background
                    card: '#242428', // Lighter Panel
                    border: '#3D3D45', // Metal Border
                    radiant: {
                        DEFAULT: '#1ec02a',
                        glow: 'rgba(30, 192, 42, 0.5)',
                        dim: '#135418'
                    },
                    dire: {
                        DEFAULT: '#e62412',
                        glow: 'rgba(230, 36, 18, 0.5)',
                        dim: '#631818'
                    },
                    gold: '#FFD700',
                    silver: '#C0C0C0',
                    void: '#000000'
                }
            },
            fontFamily: {
                fantasy: ['Cinzel', 'serif'],
                radiance: ['"Trajan Pro"', '"Cinzel"', 'serif'],
                reaver: ['"Reaver"', 'serif'],
                mono: ['"Consolas"', 'monospace'] // For code/stats
            },
            backgroundImage: {
                'dota-map': "linear-gradient(to bottom, rgba(11,11,11,0.9), rgba(11,11,11,0.95)), url('/assets/dota_map_bg.jpg')",
                'hero-pattern': "url('/assets/hero_silhouette.png')",
                'metal-gradient': 'linear-gradient(180deg, #3a3a41 0%, #242428 100%)',
                'shiny-metal': 'linear-gradient(45deg, #3D3D45 25%, #585863 50%, #3D3D45 75%)',
                'radiant-gradient': 'linear-gradient(to right, rgba(30,192,42,0.1), transparent)',
                'dire-gradient': 'linear-gradient(to right, rgba(230,36,18,0.1), transparent)',
            },
            boxShadow: {
                'glow-radiant': '0 0 15px rgba(30, 192, 42, 0.4)',
                'glow-dire': '0 0 15px rgba(230, 36, 18, 0.4)',
                'glow-gold': '0 0 10px rgba(255, 215, 0, 0.3)',
                'panel': '0 4px 20px rgba(0,0,0,0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
}
