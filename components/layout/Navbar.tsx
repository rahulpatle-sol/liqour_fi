'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import ConnectWallet from './ConnectWallet'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Trophy, Briefcase, ChevronDown, Menu, X, Zap, Copy, Check } from 'lucide-react'
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
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── wallet disconnect bug fix ─────────────────────────────
  useEffect(() => {
    if (!connected && isAuthenticated) logout()
  }, [connected])

  const isTrading     = pathname.startsWith('/trade')
  const currentMarket = isTrading ? pathname.split('/')[2]?.toUpperCase() : null

  // Fallback tracking active address from either backend auth or direct public key
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

  // Is user effectively logged in (Solana Connected OR Backend Authenticated)
  const isUserConnected = connected || isAuthenticated

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'h-14 bg-[#0B0E11]/90 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'h-16 bg-transparent'
        )}
      >
        <div className="flex items-center h-full w-full px-5 gap-1">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 mr-6 shrink-0 group">
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6 }}
              className="text-xl select-none"
            >🥃</motion.span>
            <span className="font-black text-[15px] tracking-tight text-white">
              LIQ<span className="text-[#0052FF]">OUR</span>
            </span>
            <span className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/25 text-[#4F8EFF] text-[10px] font-bold tracking-widest">
              <Zap size={9} strokeWidth={2.5} /> PERPS
            </span>
          </Link>

          {/* ── Markets dropdown ── */}
          <div
            className="relative mr-1"
            onMouseEnter={() => setShowMarkets(true)}
            onMouseLeave={() => setShowMarkets(false)}
          >
            <button className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
              isTrading
                ? 'text-[#4F8EFF] bg-[#0052FF]/8 border border-[#0052FF]/20'
                : 'text-white/40 hover:text-white border border-transparent hover:bg-white/[0.04]'
            )}>
              <BarChart2 size={14} strokeWidth={2} />
              {currentMarket ? `${currentMarket}/USDC` : 'Trade'}
              <motion.span
                animate={{ rotate: showMarkets ? 180 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>

            <AnimatePresence>
              {showMarkets && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{  opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-52 bg-[#0F1217] border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-[10px] text-white/25 font-semibold tracking-widest uppercase">
                      Perpetuals
                    </p>
                  </div>
                  {MARKETS.map((m, i) => (
                    <motion.div
                      key={m.sym}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/trade/${m.sym}`}
                        className={clsx(
                          'flex items-center gap-3 px-4 py-3 transition-colors group',
                          currentMarket === m.sym
                            ? 'bg-[#0052FF]/8 text-white'
                            : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                        )}
                      >
                        {/* Dot */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: m.color, boxShadow: `0 0 6px ${m.color}60` }}
                        />
                        <span className="flex-1 font-medium text-sm">
                          {m.sym}<span className="text-white/25">/USDC</span>
                        </span>
                        <span className={clsx(
                          'text-xs font-mono font-semibold',
                          m.up ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                        )}>
                          {m.change}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="px-4 py-2 border-t border-white/[0.05]">
                    <p className="text-[10px] text-white/20 text-center">Devnet · Paper Trading</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Nav links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} className={clsx(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'text-white bg-white/[0.07] border border-white/[0.08]'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
                )}>
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* ── Right ── */}
          <div className="ml-auto flex items-center gap-2.5">

            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0ECB81]/5 border border-[#0ECB81]/15">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ECB81] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0ECB81]" />
              </span>
              <span className="text-[10px] text-[#0ECB81] font-semibold tracking-wide">LIVE</span>
            </div>

            {/* ── Auth state (Fixed Condition Layer) ── */}
            <AnimatePresence mode="wait">
              {isUserConnected ? (
                <motion.div
                  key="authed"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.92 }}
                  className="flex items-center gap-2"
                >
                  {/* Wallet chip */}
                  <button
                    onClick={copyAddr}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all group"
                  >
                    <span className="text-xs text-white/60 font-mono group-hover:text-white/90 transition-colors">
                      {auth?.username || shortAddr || 'Wallet Connected'}
                    </span>
                    {copied
                      ? <Check size={11} className="text-[#0ECB81]" />
                      : <Copy size={11} className="text-white/25 group-hover:text-white/50" />
                    }
                  </button>

                  {/* Disconnect */}
                  <button
                    onClick={() => { disconnect(); logout() }}
                    className="px-3 py-1.5 rounded-xl text-xs text-white/30 hover:text-[#F6465D] hover:bg-[#F6465D]/5 hover:border-[#F6465D]/20 border border-transparent transition-all"
                  >
                    Disconnect
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="connect"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.92 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{  scale: 0.97 }}
                  onClick={() => setShowConnect(true)}
                  className="relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0052FF] text-white text-sm font-semibold"
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                  />
                  <span className="relative z-10">Connect Wallet</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x"  initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.15}}><X size={20}/></motion.span>
                  : <motion.span key="m"  initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.15}}><Menu size={20}/></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile fullscreen menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1,  y: 0 }}
              exit={{   opacity: 0,  y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-0 z-[-1] bg-[#0B0E11]/98 backdrop-blur-2xl md:hidden pt-20 px-6"
            >
              {/* Close tap area */}
              <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

              <div className="relative flex flex-col gap-8 max-w-xs mx-auto">
                {/* Markets */}
                <div>
                  <p className="text-[10px] text-white/25 font-bold tracking-widest uppercase mb-3">Markets</p>
                  <div className="flex flex-col gap-1">
                    {MARKETS.map((m, i) => (
                      <motion.div
                        key={m.sym}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Link
                          href={`/trade/${m.sym}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.08]"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                          <span className="flex-1 font-semibold">{m.sym}/USDC</span>
                          <span className={m.up ? 'text-[#0ECB81] text-xs' : 'text-[#F6465D] text-xs'}>
                            {m.change}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Nav */}
                <div>
                  <p className="text-[10px] text-white/25 font-bold tracking-widest uppercase mb-3">Navigate</p>
                  <div className="flex flex-col gap-1">
                    {NAV.map(({ href, label, icon: Icon }, i) => (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + i * 0.06 }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-all"
                        >
                          <Icon size={16} />
                          <span className="font-semibold">{label}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Auth in mobile (Fixed condition) */}
                {!isUserConnected ? (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { setMobileOpen(false); setShowConnect(true) }}
                    className="w-full py-3.5 rounded-2xl bg-[#0052FF] text-white font-bold text-sm"
                  >
                    Connect Wallet
                  </motion.button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); disconnect(); logout() }}
                    className="w-full py-3.5 rounded-2xl bg-[#F6465D]/10 text-[#F6465D] border border-[#F6465D]/20 font-bold text-sm"
                  >
                    Disconnect ({shortAddr || 'Wallet'})
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showConnect && <ConnectWallet onClose={() => setShowConnect(false)} />}
    </>
  )
}