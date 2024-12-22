import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

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
  			'background-neutral': 'hsl(var(--background-neutral))',
  			'background-normal': 'hsl(var(--background-normal))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'1': 'hsl(var(--primary-1))',
  				'2': 'hsl(var(--primary-2))',
  				'3': 'hsl(var(--primary-3))',
  				'4': 'hsl(var(--primary-4))',
  				'5': 'hsl(var(--primary-5))',
  				'6': 'hsl(var(--primary-6))',
  				'7': 'hsl(var(--primary-7))',
  				'8': 'hsl(var(--primary-8))',
  				'9': 'hsl(var(--primary-9))'
  			},
  			secondary: {
  				'1': 'hsl(var(--secondary-1))',
  				'2': 'hsl(var(--secondary-2))',
  				'3': 'hsl(var(--secondary-3))',
  				'4': 'hsl(var(--secondary-4))',
  				'5': 'hsl(var(--secondary-5))',
  				'6': 'hsl(var(--secondary-6))',
  				'7': 'hsl(var(--secondary-7))',
  				'8': 'hsl(var(--secondary-8))',
  				'9': 'hsl(var(--secondary-9))'
  			},
  			warning: {
  				'1': 'hsl(var(--warning-1))',
  				'2': 'hsl(var(--warning-2))'
  			},
  			danger: {
  				'1': 'hsl(var(--danger-1))',
  				'2': 'hsl(var(--danger-2))'
  			},
  			success: {
  				'1': 'hsl(var(--success-1))',
  				'2': 'hsl(var(--success-2))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		margin: {
  			center: '0 auto'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default withUt(config);
