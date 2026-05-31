'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ICONS: Record<string, string> = { SOL: '◎', BTC: '₿', ETH: 'Ξ' }

export default function MarketGrid() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLAnchorElement[]>([])
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string, number> = {}
      d.markets.forEach(m => { p[m.market] = m.price })
      setPrices(p)
    })
    ;['SOL', 'BTC', 'ETH'].forEach(m => subscribe(`price:${m}`))
    const u = on('PRICE_UPDATE', (d: any) => {
      setPrices(prev => ({ ...prev, [d.market]: d.price }))
    })
    return () => { u() }
  }, [subscribe, on])

  useEffect(() => {
    if (!gridRef.current || !cardsRef.current.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [markets])

  if (!markets.length) return null

  const fmt = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '$' + n.toFixed(4)

  return (
    <section className="bg-[#F8F9FA] py-24 px-6 relative overflow-hidden w-full border-t border-gray-200/40">
      {/* Background Dot Grid Overlay - Perfectly matching image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      <div className="max-w-5xl mx-auto relative z-10 selection:bg-blue-100">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">
            Live Markets
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Trade with up to <span className="text-[#0052FF] font-semibold">50× Leverage</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-base font-normal">
            Real-time pricing streamed through Pyth Network oracles.
          </p>
        </div>

        {/* Core Product Cards Grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-3 gap-6"
        >
          {markets.map((m, idx) => {
            const price = prices[m.market] ?? m.price
            const up = m.h24_change >= 0
            
            return (
              <Link
                key={m.market}
                ref={(el) => { if (el) cardsRef.current[idx] = el }}
                href={`/trade/${m.market}`}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Token Row Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                        {ICONS[m.market]}
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm tracking-tight">{m.market}/USDC</p>
                        <p className="text-gray-400 text-xs font-medium">Perpetual Futures</p>
                      </div>
                    </div>
                    {/* Compact Clean Change Pill */}
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                      up 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {up ? '+' : ''}{m.h24_change.toFixed(2)}%
                    </span>
                  </div>

                  {/* Primary Price Metric */}
                  <p className="text-3xl font-bold tracking-tight text-gray-900 font-mono mb-1.5">
                    {fmt(price)}
                  </p>
                  
                  {/* Oracle Stream Status Badge */}
                  <div className="flex items-center gap-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] opacity-80" />
                    <span className="text-[11px] text-gray-400 font-medium tracking-tight">Live via Pyth Oracle</span>
                  </div>

                  {/* High / Low 24h Data Sub-Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50/60 rounded-xl p-3 border border-gray-100">
                      <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">24h High</p>
                      <p className="text-gray-700 text-xs font-bold font-mono">{fmt(m.h24_high)}</p>
                    </div>
                    <div className="bg-gray-50/60 rounded-xl p-3 border border-gray-100">
                      <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">24h Low</p>
                      <p className="text-gray-700 text-xs font-bold font-mono">{fmt(m.h24_low)}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Strip Row */}
                <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 group-hover:bg-[#0052FF] group-hover:text-white group-hover:border-[#0052FF] transition-all duration-200">
                  Trade {m.market} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}