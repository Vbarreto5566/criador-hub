import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#07070f',
        s1: '#0f0f1a',
        s2: '#161625',
        s3: '#1c1c2e',
        acc: '#ff3b6b',
        acc2: '#7c3aff',
        teal: '#00e5c3',
        ylw: '#ffe14d',
        txt: '#f0eeff',
        mut: '#6b6b8a',
      },
    },
  },
  plugins: [],
}
export default config
