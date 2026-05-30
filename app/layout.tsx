import type { Metadata } from 'next'
import './globals.css'
import SolanaWalletProvider from '@/components/providers/WalletProvider'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Liqour — Social Perps on Solana',
  description: 'Trade SOL, BTC, ETH perpetuals. Copy the best traders automatically.',
  themeColor: '#0B0E11',
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
          <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-14">{children}</main>
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
