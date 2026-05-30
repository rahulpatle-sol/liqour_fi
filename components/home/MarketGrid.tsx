'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { type Market } from '@/lib/api'

interface MarketGridProps {
  markets: Market[]
  prices: Record<string, number>
}

const ICONS: Record<string, string> = { SOL: '◎', BTC: '₿', ETH: 'Ξ' }

export default function MarketGrid({ markets, prices }: MarketGridProps) {
  const fmt = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '$' + n.toFixed(4)

  return (
    <section className="py-24 max-w-6xl mx-auto px-4">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Supported Perp Markets</h2>
        <p className="text-neutral-400 text-sm">Trade top layer-1 assets with up to 50x sub-second execution speed.</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {markets.map(m => {
          const currentPrice = prices[m.market] || m.price
          const isUp = m.h24_change >= 0

          return (
            <Link key={m.market} href={`/trade/${m.market}`}
              className="group relative bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 hover:border-neutral-700 hover:bg-neutral-900/80 transition-all duration-300 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center text-xl font-black text-neutral-300 group-hover:text-orange transition-colors">
                    {ICONS[m.market]}
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wide">{m.market}/USDC</p>
                    <p className="text-neutral-500 text-xs">Perpetual Futures</p>
                  </div>
                </div>
                <span className={clsx('text-xs font-bold px-2.5 py-1 rounded-md tracking-wider font-mono', isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>
                  {isUp ? '+' : ''}{m.h24_change.toFixed(2)}%
                </span>
              </div>

              <div className="mb-4">
                <p className={clsx('text-3xl font-black font-mono tracking-tight transition-colors duration-200', isUp ? 'text-emerald-400' : 'text-rose-400')}>
                  {fmt(currentPrice)}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Oracle Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/60 text-xs">
                <div>
                  <p className="text-neutral-500 mb-0.5">24h High</p>
                  <p className="text-neutral-300 font-mono font-medium">{fmt(m.h24_high)}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-0.5">24h Low</p>
                  <p className="text-neutral-300 font-mono font-medium">{fmt(m.h24_low)}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-neutral-400 bg-neutral-950/40 group-hover:text-white group-hover:bg-orange transition-all duration-300 border border-neutral-800/60 group-hover:border-transparent">
                Open Position <ArrowRight size={14} />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}