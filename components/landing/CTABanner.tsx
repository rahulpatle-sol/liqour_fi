'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#0052FF]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#3B82F6]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs text-white/50 mb-8">
          <Sparkles size={14} className="text-[#0052FF]" />
          1000 USDC Paper Money on Sign-Up
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.05] mb-6">
          Ready to Trade?
          <br />
          <span className="bg-gradient-to-r from-[#0052FF] to-[#3B82F6] bg-clip-text text-transparent">
            Start Copying Winners.
          </span>
        </h2>

        <p className="text-white/40 text-lg max-w-lg mx-auto mb-10">
          Connect your Phantom or Backpack wallet and start trading with zero upfront commitment.
        </p>

        <Link
          href="/trade/SOL"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0052FF] text-white font-bold text-lg hover:bg-[#0045E0] transition-all shadow-[0_0_40px_rgba(0,82,255,0.35)] hover:shadow-[0_0_60px_rgba(0,82,255,0.5)] active:scale-[0.97]"
        >
          Launch App
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-white/20 text-xs mt-6">
          No gas fees. No private key upload. Just sign and trade.
        </p>
      </div>
    </section>
  )
}
