'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTABanner() {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto mb-16">
      <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-10 md:p-14 text-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-orange/5 mix-blend-color-dodge rounded-3xl pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none"> Ready to Mirror Alpha Profits?</h2>
        <p className="text-neutral-400 max-w-xl mx-auto mb-8 text-sm md:text-base">
          Connect your Phantom wallet now. Experience trading execution utilizing $1,000 allocated devnet trial funds instantly.
        </p>
        <Link href="/trade/SOL" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-orange text-white text-base font-bold rounded-xl hover:bg-orange/90 transition-all hover:scale-105 shadow-xl shadow-orange/10">
          Initialize App Context <ArrowRight size={18}/>
        </Link>
      </div>
    </section>
  )
}