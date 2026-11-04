import { GeistSans } from 'geist/font/sans'

/**
 * Body font via local Geist Sans (bundled with `geist` package).
 * Avoids `next/font/google` Inter fetch failures on Vercel builds.
 */
export const inter = GeistSans
