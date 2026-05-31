'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import ConnectWallet from './ConnectWallet'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Trophy, Briefcase, ChevronDown, Menu, X, Zap, Copy, Check, Compass } from 'lucide-react'
import clsx from 'clsx'

const MARKETS = [
  { sym: 'SOL', color: '#9945FF', change: '+2.4%', up: true },
  { sym: 'BTC', color: '#F7931A', change: '-0.8%', up: false },
  { sym: 'ETH', color: '#627EEA', change: '+1.2%', up: true },
]

const NAV = [
  { href: '/leaderboard', label: 'Copy Trading', icon: Trophy },
  { href: '/portfolio',   label: 'Portfolio',    icon: Briefcase },
]

export default function Navbar() {
  const pathname        = usePathname()
  const { isAuthenticated, auth, logout } = useAuth()
  const { disconnect, connected, publicKey } = useWallet()
  const [showConnect,  setShowConnect]  = useState(false)
  const [showMarkets,  setShowMarkets]  = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [copied,       setCopied]       = useState(false)

  // ── scroll detection ──────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── wallet disconnect bug fix ─────────────────────────────
  useEffect(() => {
    if (!connected && isAuthenticated) logout()
  }, [connected])

  const isTrading     = pathname.startsWith('/trade')
  const currentMarket = isTrading ? pathname.split('/')[2]?.toUpperCase() : null

  const activeAddress = auth?.walletAddress || publicKey?.toBase58()

  const copyAddr = () => {
    if (!activeAddress) return
    navigator.clipboard.writeText(activeAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const shortAddr = activeAddress
    ? activeAddress.slice(0, 4) + '...' + activeAddress.slice(-4)
    : ''

  const isUserConnected = connected || isAuthenticated

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full px-4 sm:px-8',
          scrolled
            ? 'h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
            : 'h-16 bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center h-full justify-between gap-4">

          {/* ── Left Side Layout Block ── */}
          <div className="flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-4 shrink-0 group">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                className="text-lg select-none"
              >🥃</motion.span>
              <span className="font-bold text-[16px] tracking-tight text-gray-900">
                LIQ<span className="text-[#0052FF]">OUR</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[#0052FF] text-[10px] font-bold tracking-wider">
                <Zap size={9} strokeWidth={3} /> PERPS
              </span>
            </Link>

            {/* Markets dropdown trigger */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setShowMarkets(true)}
              onMouseLeave={() => setShowMarkets(false)}
            >
              <button className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all border',
                isTrading
                  ? 'text-[#0052FF] bg-blue-50/50 border-blue-100'
                  : 'text-gray-500 hover:text-gray-900 border-transparent hover:bg-gray-100/70'
              )}>
                <BarChart2 size={13} strokeWidth={2.5} />
                {currentMarket ? `${currentMarket}/USDC` : 'Trade'}
                <motion.span
                  animate={{ rotate: showMarkets ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown size={11} />
                </motion.span>
              </button>

              <AnimatePresence>
                {showMarkets && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{  opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 pt-3 pb-1.5">
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
                        Perpetuals
                      </p>
                    </div>
                    {MARKETS.map((m, i) => (
                      <motion.div
                        key={m.sym}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          href={`/trade/${m.sym}`}
                          className={clsx(
                            'flex items-center gap-2.5 px-4 py-2.5 transition-colors group',
                            currentMarket === m.sym
                              ? 'bg-blue-50/50 text-[#0052FF]'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          )}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: m.color, boxShadow: `0 0 4px ${m.color}40` }}
                          />
                          <span className="flex-1 font-semibold text-xs">
                            {m.sym}<span className="text-gray-400 font-medium">/USDC</span>
                          </span>
                          <span className={clsx(
                            'text-[11px] font-mono font-bold',
                            m.up ? 'text-emerald-600' : 'text-rose-600'
                          )}>
                            {m.change}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50">
                      <p className="text-[10px] text-gray-400 font-medium text-center">Devnet · Paper Trading</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Navigation links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <Link key={href} href={href} className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                    active
                      ? 'text-gray-900 bg-white border-gray-200/60 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 border-transparent hover:bg-gray-100/70'
                  )}>
                    <Icon size={13} strokeWidth={active ? 2.5 : 2} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* ── Right Side Action Block ── */}
          <div className="flex items-center gap-3">

            {/* Live indicator widget */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-emerald-600 font-bold tracking-wider">LIVE</span>
            </div>

            {/* Wallet Integration Layer */}
            <AnimatePresence mode="wait">
              {isUserConnected ? (
                <motion.div
                  key="authed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  {/* Address Copy chip */}
                  <button
                    onClick={copyAddr}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/80 border border-gray-200/50 hover:border-gray-300 hover:bg-gray-100 transition-all group"
                  >
                    <span className="text-xs text-gray-600 font-mono font-medium group-hover:text-gray-900 transition-colors">
                      {auth?.username || shortAddr || 'Connected'}
                    </span>
                    {copied
                      ? <Check size={11} className="text-emerald-600" />
                      : <Copy size={11} className="text-gray-400 group-hover:text-gray-500" />
                    }
                  </button>

                  {/* Disconnect Action */}
                  <button
                    onClick={() => { disconnect(); logout() }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    Exit
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="connect"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{  scale: 0.98 }}
                  onClick={() => setShowConnect(true)}
                  className="relative overflow-hidden flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0052FF] text-white text-xs font-bold shadow-sm shadow-blue-500/10 hover:bg-[#0045E0] transition-colors"
                >
                  <span>Connect Wallet</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile responsive menu button trigger */}
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-transparent active:border-gray-200/60"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x"  initial={{rotate:-40,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:40,opacity:0}} transition={{duration:0.12}}><X size={18}/></motion.span>
                  : <motion.span key="m"  initial={{rotate:40,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-40,opacity:0}} transition={{duration:0.12}}><Menu size={18}/></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile responsive fullscreen sliding tray ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1,  y: 0 }}
              exit={{   opacity: 0,  y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed inset-0 top-0 z-[-1] bg-white border-b border-gray-200/80 shadow-xl md:hidden pt-20 px-6 pb-8 h-fit max-h-[90vh] overflow-y-auto"
            >
              <div className="relative flex flex-col gap-6 max-w-sm mx-auto">
                
                {/* Mobile Trading Markets Area */}
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Live Markets</p>
                  <div className="grid grid-cols-1 gap-1">
                    {MARKETS.map((m, i) => (
                      <motion.div
                        key={m.sym}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={`/trade/${m.sym}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all border border-transparent active:border-gray-100"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                          <span className="flex-1 font-bold text-xs">{m.sym}/USDC</span>
                          <span className={clsx('font-mono text-xs font-bold', m.up ? 'text-emerald-600' : 'text-rose-600')}>
                            {m.change}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Core Navigation Section */}
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Navigate Platform</p>
                  <div className="grid grid-cols-1 gap-1">
                    {/* Explicitly mapping core subpages */}
                    {NAV.map(({ href, label, icon: Icon }, i) => (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.04 }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-xs font-bold"
                        >
                          <Icon size={14} className="text-gray-400" />
                          <span>{label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA Bottom Panel */}
                <div className="mt-2">
                  {!isUserConnected ? (
                    <button
                      onClick={() => { setMobileOpen(false); setShowConnect(true) }}
                      className="w-full py-3 rounded-xl bg-[#0052FF] hover:bg-[#0045E0] text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMobileOpen(false); disconnect(); logout() }}
                      className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 font-bold text-xs transition-colors"
                    >
                      Disconnect Wallet ({shortAddr || 'Account'})
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showConnect && <ConnectWallet onClose={() => setShowConnect(false)} />}
    </>
  )
}