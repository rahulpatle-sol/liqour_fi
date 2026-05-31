'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ArrowUpRight, TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  // Floating decorative element refs
  const livePillRef = useRef<HTMLDivElement>(null)
  const solCardRef = useRef<HTMLDivElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef<HTMLDivElement>(null)
  const assetsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      // Header Animation
      tl.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      
      // Central Text Animations
      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      )

      // Floating Crypto Elements Entrances
      const elements = [
        { ref: livePillRef, x: 0, y: -20 },
        { ref: solCardRef, x: -40, y: -20 },
        { ref: lightningRef, x: -30, y: 30 },
        { ref: leaderboardRef, x: 40, y: -10 },
        { ref: positionRef, x: -40, y: 40 },
        { ref: assetsRef, x: 40, y: 40 }
      ]

      elements.forEach((item, index) => {
        gsap.fromTo(
          item.ref.current,
          { x: item.x, y: item.y, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 1.2, delay: 0.2 + index * 0.1, ease: 'power2.out' }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased selection:bg-blue-100"
    >
      {/* Background Dot Grid Effect matching image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      {/* Navigation Header */}
      {/* <nav ref={navRef} className="relative z-20 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-800">
          <div className="grid grid-cols-2 gap-1 w-5 h-5">
            <div className="bg-gray-400 rounded-[2px]" />
            <div className="bg-[#0052FF] rounded-[2px]" />
            <div className="bg-gray-800 rounded-[2px]" />
            <div className="bg-gray-400 rounded-[2px]" />
          </div>
          ChronoTrade
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/trade/SOL" className="hover:text-gray-900 transition-colors">Trade</Link>
          <Link href="/leaderboard" className="hover:text-gray-900 transition-colors">Copy Trading</Link>
          <Link href="#analytics" className="hover:text-gray-900 transition-colors">Pyth Feeds</Link>
          <Link href="#docs" className="hover:text-gray-900 transition-colors">Docs</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
          <Link href="/trade/SOL" className="text-sm font-semibold bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">Launch App</Link>
        </div>
      </nav> */}

      {/* Hero Core Layout */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-32 text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {/* Live Pill Indicator */}
        <div 
          ref={livePillRef}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-xs text-gray-600 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
          Live on Solana Devnet &mdash; Powered by Pyth Network
        </div>

        {/* Central Logo Grid Icon */}
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100/80 w-16 h-16 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1.5 w-full aspect-square">
            <div className="bg-gray-300 rounded-sm" />
            <div className="bg-[#0052FF] rounded-sm" />
            <div className="bg-gray-800 rounded-sm" />
            <div className="bg-gray-800 rounded-sm" />
          </div>
        </div>

        {/* Main Crypto Headings */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 max-w-3xl leading-[1.1] mb-6"
        >
          Trade Perps. <br />
          <span className="text-[#0052FF] font-semibold">Copy the Best.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto mb-8 font-normal leading-relaxed"
        >
          The first social copy-trading perps DEX on Solana. Follow top traders and automatically mirror positions inside a Rust-powered atomic matching engine.
        </p>

        {/* Action Button */}
        <div ref={ctaRef}>
          <Link
            href="/trade/SOL"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#0052FF] text-white font-medium text-base hover:bg-[#0045E0] transition-all shadow-md hover:shadow-lg shadow-blue-500/10 active:scale-[0.98]"
          >
            Start Trading Now
          </Link>
        </div>

        {/* --- FLOATING DECORATIVE CRYPTO CARDS (Positions matching image_9720f7.png) --- */}

        {/* Top Left: Yellow Sticky Note style — replaced with Trade Stats */}
        <div
          ref={solCardRef}
          className="hidden lg:block absolute left-[-6%] top-[10%] w-48 bg-[#FEF08A] p-4 shadow-md rotate-[-4deg] rounded-sm text-left text-xs font-medium text-amber-950 leading-relaxed"
        >
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mb-2 shadow-sm" />
          <strong>Solana Engine:</strong> Executes atomic matching under 400ms via high-throughput Rust pipelines. Seamless copy execution.
        </div>

        {/* Middle Left: Minimal Lightning Bolt Box */}
        <div
          ref={lightningRef}
          className="hidden lg:flex absolute left-[-12%] top-[38%] w-20 h-20 bg-white border border-gray-100 shadow-lg rounded-2xl items-center justify-center rotate-[8deg]"
        >
          <div className="w-10 h-10 bg-[#0052FF] text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Zap size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* Top Right: Reminders Widget — Replaced with Top Traders Leaderboard */}
        <div
          ref={leaderboardRef}
          className="hidden lg:block absolute right-[-10%] top-[14%] w-56 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl rounded-2xl p-4 text-left rotate-[3deg]"
        >
          <div className="text-[10px] font-bold text-[#0052FF] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users size={12} /> Top Copy Master
          </div>
          <div className="text-xs font-bold text-gray-800 mb-1">AlphaWhale.sol</div>
          <div className="text-[11px] text-green-600 font-semibold mb-3 flex items-center gap-1">
            <TrendingUp size={12} /> +428.5% ROI (Monthly)
          </div>
          <div className="inline-flex items-center text-[10px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded-md border border-gray-100">
            1,240 Followers Mirroring
          </div>
        </div>

        {/* Bottom Left: Tasks Summary UI — Replaced with Live Active Position */}
        <div
          ref={positionRef}
          className="hidden lg:block absolute left-[-10%] bottom-[8%] w-64 bg-white border border-gray-100/80 shadow-2xl rounded-2xl p-4 text-left"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-bold text-gray-800">Active Live Copy</div>
            <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Long 20x</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-800">SOL-PERP</span>
              </div>
              <span className="text-[11px] font-semibold text-green-500">+$1,420.50</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-800">BTC-PERP</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-400">Entry: $67,430</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Integrations Panel — Replaced with Supported Crypto Assets */}
        <div
          ref={assetsRef}
          className="hidden lg:block absolute right-[-8%] bottom-[8%] w-64 bg-white border border-gray-100/80 shadow-2xl rounded-2xl p-4 text-left rotate-[-2deg]"
        >
          <div className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#0052FF]" /> Supported Assets
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-bold text-purple-600">SOL</span>
              <span className="text-gray-400">Solana</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-bold text-amber-500">BTC</span>
              <span className="text-gray-400">Bitcoin</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-bold text-blue-500">ETH</span>
              <span className="text-gray-400">Ethereum</span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-bold text-emerald-500">USDC</span>
              <span className="text-gray-400">USD Coin</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}