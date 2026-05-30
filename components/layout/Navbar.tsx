'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import ConnectWallet from './ConnectWallet'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BarChart2, Trophy, Briefcase, ChevronDown, Menu, X, Zap } from 'lucide-react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const MARKETS = ['SOL', 'BTC', 'ETH']
const NAV = [
  { href: '/leaderboard', label: 'Copy Trading', icon: Trophy },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
]

const staggerItem = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0 },
}

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, auth, logout } = useAuth()
  const { disconnect } = useWallet()
  const [showConnect, setShowConnect] = useState(false)
  const [showMarkets, setShowMarkets] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -48px',
        end: 99999,
        onUpdate: (self) => {
          setScrolled(self.progress > 0)
        },
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  const isTrading = pathname.startsWith('/trade')
  const currentMarket = isTrading ? pathname.split('/')[2]?.toUpperCase() : null

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-500',
          scrolled
            ? 'h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'h-16 bg-transparent'
        )}
      >
        <div className="flex items-center w-full px-6 gap-0">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link href="/" className="flex items-center gap-2.5 mr-8 shrink-0 group">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                className="text-xl"
              >
                🥃
              </motion.div>
              <span className="font-black text-base tracking-tight text-white">
                LIQ<span className="text-[#0052FF]">OUR</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/20 text-[#0052FF] text-[10px] font-semibold tracking-wider ml-1">
                <Zap size={10} /> PERPS
              </span>
            </Link>
          </motion.div>

          {/* Markets dropdown */}
          <div
            className="relative mr-2"
            onMouseEnter={() => setShowMarkets(true)}
            onMouseLeave={() => setShowMarkets(false)}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                isTrading
                  ? 'text-[#0052FF] bg-[#0052FF]/5 border border-[#0052FF]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
              )}
            >
              <BarChart2 size={15} />
              {currentMarket ? `${currentMarket}/USDC` : 'Trade'}
              <motion.div animate={{ rotate: showMarkets ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showMarkets && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-1.5 w-44 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {MARKETS.map((m, i) => (
                    <motion.div
                      key={m}
                      variants={staggerItem}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/trade/${m}`}
                        className={clsx(
                          'flex items-center justify-between px-4 py-3 text-sm transition-colors',
                          currentMarket === m
                            ? 'text-[#0052FF] bg-[#0052FF]/5'
                            : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                        )}
                      >
                        <span className="font-medium">{m}/USDC</span>
                        <span className="text-[10px] text-white/20 font-mono">Perp</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <motion.div key={href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={href}
                    className={clsx(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'text-white bg-white/[0.06] border border-white/10'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse shadow-[0_0_6px_#0ECB81]" />
                  <span className="text-xs text-white/60 font-mono">
                    {auth.username || (auth.walletAddress?.slice(0, 4) + '...' + auth.walletAddress?.slice(-4))}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { disconnect(); logout() }}
                  className="px-3.5 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/10"
                >
                  Disconnect
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConnect(true)}
                className="relative group inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0052FF] text-white text-sm font-semibold overflow-hidden"
              >
                <span className="relative z-10">Connect Wallet</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#0045E0] to-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 rounded-xl shadow-[0_0_25px_rgba(0,82,255,0.4)] group-hover:shadow-[0_0_40px_rgba(0,82,255,0.6)] transition-shadow duration-300" />
              </motion.button>
            )}

            {/* Mobile hamurger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
                <div className="flex flex-col items-center gap-1 w-full max-w-xs">
                  <p className="text-white/20 text-xs font-semibold tracking-widest uppercase mb-2">Markets</p>
                  {MARKETS.map((m) => (
                    <motion.div
                      key={m}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full"
                    >
                      <Link
                        href={`/trade/${m}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/10"
                      >
                        <span className="font-semibold">{m}/USDC</span>
                        <span className="text-xs text-white/20">Perp</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center gap-1 w-full max-w-xs">
                  <p className="text-white/20 text-xs font-semibold tracking-widest uppercase mb-2">Navigate</p>
                  {NAV.map(({ href, label }, i) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="w-full"
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="block w-full px-6 py-4 rounded-2xl text-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-all text-center"
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
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
