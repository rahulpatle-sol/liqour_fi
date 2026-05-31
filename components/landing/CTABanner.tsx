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
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 80%' 
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#F8F9FA] text-[#1A1A1A] py-24 w-full border-t border-gray-200/50"
    >
      {/* Background Dot Grid Overlay - Exact match with image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      {/* Soft, clean background ambient lighting circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Modernized Promo Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 text-xs font-semibold text-[#0052FF] mb-8 shadow-sm">
          <Sparkles size={13} className="text-[#0052FF]" />
          1000 USDC Paper Money on Sign-Up
        </div>

        {/* Clean, Premium Headings */}
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-2xl">
          Ready to Trade? <br />
          <span className="text-[#0052FF] font-semibold">Start Copying Winners.</span>
        </h2>

        {/* Desaturated, readable description */}
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto mb-10 font-normal leading-relaxed">
          Connect your Phantom or Backpack wallet and start trading with zero upfront commitment.
        </p>

        {/* Dynamic CTA Button matching image_9720f7.png core theme */}
        <Link
          href="/trade/SOL"
          className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0052FF] text-white font-medium text-base hover:bg-[#0045E0] transition-all shadow-md hover:shadow-lg shadow-blue-500/10 active:scale-[0.98]"
        >
          Launch App
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Fine print footnote */}
        <p className="text-gray-400 text-xs mt-6 font-medium tracking-tight">
          No gas fees. No private key upload. Just sign and trade.
        </p>
      </div>
    </section>
  )
}