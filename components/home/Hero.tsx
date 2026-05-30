'use client'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-height-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sky/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/80 text-xs text-neutral-400 mb-8 backdrop-blur-md shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium tracking-wide">Live on Solana Devnet · Powered by Pyth Oracle</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.15]">
          Trade Perps. <br />
          <span className="bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent">
            Copy the Masters.
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          The first social copy-trading perpetuals DEX on Solana. Follow alpha traders, mirror execution instantly, and retain 100% self-custody.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/trade/SOL"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange text-white font-bold hover:bg-orange/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange/20 text-base">
            Start Trading <ArrowRight size={18} />
          </Link>
          <Link href="/leaderboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-semibold hover:bg-neutral-800/60 hover:border-neutral-700 transition-all text-base backdrop-blur-sm">
            <Zap size={18} className="text-orange" /> Copy Top Traders
          </Link>
        </div>
      </div>
    </section>
  )
}