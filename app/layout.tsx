import type { Metadata, Viewport } from 'next'
import './globals.css'
import SolanaWalletProvider from '@/components/providers/WalletProvider'
import Navbar from '@/components/layout/Navbar'
import LenisScrollProvider from '@/components/landing/LenisScrollProvider'

export const viewport: Viewport = {
  themeColor: '#0B0E11',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Liqour — Social Perps on Solana',
  description: 'Trade SOL, BTC, ETH perpetuals on Solana. Copy the best traders automatically. Non-custodial, low latency, powered by Pyth oracles.',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Liqour — Social Perps on Solana',
    description: 'The first social copy-trading perps DEX on Solana. Follow top traders and automatically mirror their positions.',
    type: 'website',
    siteName: 'Liqour',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SolanaWalletProvider>
          <LenisScrollProvider>
            <div className="min-h-screen bg-black">
              <Navbar/>
              <main className="">{children}</main>
            </div>
          </LenisScrollProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
