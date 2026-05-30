'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Activity } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const glassRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current?.children || [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          '-=0.3'
        )

      gsap.fromTo(
        glassRef.current,
        { x: -80, y: -40, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 1.5, delay: 0.6, ease: 'power2.out' }
      )
      gsap.fromTo(
        glassRef2.current,
        { x: 80, y: 40, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 1.5, delay: 0.8, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background — abstract dark tech */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
      </div>

      {/* Floating glass blocks */}
      <div
        ref={glassRef}
        className="absolute top-[18%] right-[8%] w-56 h-56 rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_60px_rgba(0,82,255,0.08)]"
      />
      <div
        ref={glassRef2}
        className="absolute bottom-[22%] left-[6%] w-72 h-72 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-[0_0_80px_rgba(0,82,255,0.06)]"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Live pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs text-white/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]" />
          Live on Solana Devnet &mdash; Powered by Pyth Network
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
        >
          Trade Perps.
          <br />
          <span className="bg-gradient-to-r from-[#0052FF] to-[#3B82F6] bg-clip-text text-transparent">
            Copy the Best.
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The first social copy-trading perps DEX on Solana. Follow top traders
          and automatically mirror their positions inside a Rust-powered atomic
          matching engine.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/trade/SOL"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0052FF] text-white font-bold text-base hover:bg-[#0045E0] transition-all shadow-[0_0_30px_rgba(0,82,255,0.35)] hover:shadow-[0_0_50px_rgba(0,82,255,0.5)] active:scale-[0.97]"
          >
            Launch App
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-white/80 font-semibold text-base hover:bg-white/[0.06] hover:text-white transition-all backdrop-blur-sm"
          >
            <Activity size={18} />
            Top Traders
          </Link>
        </div>
      </div>
    </section>
  )
}
