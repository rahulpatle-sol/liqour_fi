'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import ConnectWallet from './ConnectWallet'
import { BarChart2, Trophy, Briefcase, ChevronDown, Globe, Menu, X } from 'lucide-react'
import clsx from 'clsx'

const MARKETS = ['SOL', 'BTC', 'ETH']
const NAV = [
  { href: '/leaderboard', label: 'Copy Trading', icon: Trophy },
  { href: '/portfolio',   label: 'Portfolio',   icon: Briefcase },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, auth, logout } = useAuth()
  const { disconnect } = useWallet()
  const [showConnect, setShowConnect] = useState(false)
  const [showMarkets, setShowMarkets] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isTrading = pathname.startsWith('/trade')
  const currentMarket = isTrading ? pathname.split('/')[2]?.toUpperCase() : null

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-secondary/95 backdrop-blur-md flex items-center">
        <div className="flex items-center w-full px-4 gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6 shrink-0">
            <span className="text-xl">🥃</span>
            <span className="font-black text-base tracking-tight text-tx-primary">
              LIQ<span className="text-orange">OUR</span>
            </span>
          </Link>

          {/* Markets dropdown */}
          <div className="relative mr-2" onMouseLeave={() => setShowMarkets(false)}>
            <button onMouseEnter={() => setShowMarkets(true)}
              className={clsx(
                'flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                isTrading ? 'text-orange' : 'text-tx-secondary hover:text-tx-primary'
              )}>
              <BarChart2 size={15} />
              {currentMarket ? `${currentMarket}/USDC` : 'Trade'}
              <ChevronDown size={12} className={clsx('transition-transform', showMarkets && 'rotate-180')} />
            </button>
            {showMarkets && (
              <div className="absolute top-full left-0 mt-0.5 w-44 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in">
                {MARKETS.map(m => (
                  <Link key={m} href={`/trade/${m}`}
                    className={clsx(
                      'flex items-center justify-between px-4 py-2.5 text-sm hover:bg-hover transition-colors',
                      currentMarket === m ? 'text-orange' : 'text-tx-secondary hover:text-tx-primary'
                    )}>
                    <span className="font-medium">{m}/USDC</span>
                    <span className="text-tx-muted text-xs">Perp</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                  pathname.startsWith(href) ? 'text-tx-primary bg-hover' : 'text-tx-secondary hover:text-tx-primary hover:bg-hover'
                )}>
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-card border border-border">
                  <div className="w-1.5 h-1.5 rounded-full bg-long animate-pulse2" />
                  <span className="text-xs text-tx-secondary font-mono">
                    {auth.username || (auth.walletAddress?.slice(0, 4) + '...' + auth.walletAddress?.slice(-4))}
                  </span>
                </div>
                <button onClick={() => { disconnect(); logout() }}
                  className="px-3 py-1.5 rounded text-xs text-tx-muted hover:text-tx-secondary hover:bg-card transition-colors border border-transparent hover:border-border">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={() => setShowConnect(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange text-white text-sm font-semibold hover:bg-orange/90 transition-all active:scale-95 shadow-lg shadow-orange/20">
                Connect Wallet
              </button>
            )}
            <button className="md:hidden text-tx-secondary p-1" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="absolute top-14 left-0 right-0 bg-secondary border-b border-border py-2 animate-fade-in">
            {MARKETS.map(m => (
              <Link key={m} href={`/trade/${m}`} onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-tx-secondary hover:text-tx-primary hover:bg-hover">
                {m}/USDC Perpetual
              </Link>
            ))}
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-tx-secondary hover:text-tx-primary hover:bg-hover">
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {showConnect && <ConnectWallet onClose={() => setShowConnect(false)} />}
    </>
  )
}
