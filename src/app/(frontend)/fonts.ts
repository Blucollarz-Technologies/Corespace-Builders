import { Inter } from 'next/font/google'

export const inter = Inter({
  adjustFontFallback: true,
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})
