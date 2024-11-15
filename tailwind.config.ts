import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
				'background-secondary': 'hsl(var(--background-secondary))',
  			foreground: 'hsl(var(--foreground))',
				primary: {
					'9': 'hsl(var(--primary-9))',
					'8': 'hsl(var(--primary-8))',
					'7': 'hsl(var(--primary-7))',
					'6': 'hsl(var(--primary-6))',
					'5': 'hsl(var(--primary-5))',
					'4': 'hsl(var(--primary-4))',
					'3': 'hsl(var(--primary-3))',
					'2': 'hsl(var(--primary-2))',
					'1': 'hsl(var(--primary-1))'
				},
				secondary: {
					'9': 'hsl(var(--secondary-9))',
					'8': 'hsl(var(--secondary-8))',
					'7': 'hsl(var(--secondary-7))',
					'6': 'hsl(var(--secondary-6))',
					'5': 'hsl(var(--secondary-5))',
					'4': 'hsl(var(--secondary-4))',
					'3': 'hsl(var(--secondary-3))',
					'2': 'hsl(var(--secondary-2))',
					'1': 'hsl(var(--secondary-1))'
				},
				warning: {
					'2': 'hsl(var(--warning-2))',
					'1': 'hsl(var(--warning-1))'
				},
				danger: {
					'2': 'hsl(var(--danger-2))',
					'1': 'hsl(var(--danger-1))'
				},
				success: {
					'2': 'hsl(var(--success-2))',
					'1': 'hsl(var(--success-1))',
				},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			margin: {
				'center': '0 auto'
			}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
