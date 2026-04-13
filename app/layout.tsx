import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { auth } from '@/lib/auth'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ParasitePro | AI Parasite Identification — notworms.com',
  description:
    'AI-assisted educational parasite identification for Australians. Upload photos of samples, rashes, or bites and receive structured educational assessments to help you prepare for your GP visit.',
  keywords: [
    'parasite identification australia',
    'worm identification',
    'skin rash identification',
    'tropical disease australia',
    'educational health tool',
    'queensland parasites',
  ],
  openGraph: {
    title: 'ParasitePro — AI Parasite Identification',
    description: 'Educational AI tool for Australians. Not a diagnosis. Always see your GP.',
    url: 'https://notworms.com',
    siteName: 'ParasitePro',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Pre-fetch session server-side so it's available immediately without flash
  const session = await auth()

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-background font-body antialiased">
        <AuthProvider session={session}>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
