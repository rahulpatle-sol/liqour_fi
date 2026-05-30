'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ICONS: Record<string, string> = { SOL:'◎', BTC:'₿', ETH:'Ξ' }

export default function MarketGrid() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string,number>>({})
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLAnchorElement[]>([])
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string,number> = {}
      d.markets.forEach(m => { p[m.market] = m.price })
      setPrices(p)
    })
    ;['SOL','BTC','ETH'].forEach(m => subscribe(`price:${m}`))
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
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [markets])

  if (!markets.length) return null

  const fmt = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US',{maximumFractionDigits:2}) : '$' + n.toFixed(4)

  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-[#0052FF] text-xs font-semibold tracking-widest uppercase mb-3 block">
            Live Markets
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Trade with up to <span className="text-[#0052FF]">50× Leverage</span>
          </h2>
          <p className="text-white/40 mt-3 max-w-md mx-auto">
            Real-time pricing streamed through Pyth Network oracles.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid md:grid-cols-3 gap-4"
        >
          {markets.map((m, idx) => {
            const price = prices[m.market] ?? m.price
            const up = m.h24_change >= 0
            return (
              <Link
                key={m.market}
                ref={(el) => { if (el) cardsRef.current[idx] = el }}
                href={`/trade/${m.market}`}
                className="group relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-[#0052FF]/40 hover:shadow-[0_0_40px_rgba(0,82,255,0.08)] transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white/60">
                      {ICONS[m.market]}
                    </div>
                    <div>
                      <p className="text-white font-bold">{m.market}/USDC</p>
                      <p className="text-white/30 text-xs">Perpetual Futures</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${up ? 'bg-[#0ECB81]/10 text-[#0ECB81]' : 'bg-[#F6465D]/10 text-[#F6465D]'}`}>
                    {up ? '+' : ''}{m.h24_change.toFixed(2)}%
                  </span>
                </div>

                <p className={`text-3xl font-black font-mono mb-1 ${up ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                  {fmt(price)}
                </p>
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                  <span className="text-xs text-white/30">Live via Pyth</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                    <p className="text-white/30 text-xs mb-0.5">24h High</p>
                    <p className="text-white/70 text-xs font-mono">{fmt(m.h24_high)}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                    <p className="text-white/30 text-xs mb-0.5">24h Low</p>
                    <p className="text-white/70 text-xs font-mono">{fmt(m.h24_low)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 text-sm text-white/40 group-hover:text-white/80 group-hover:border-white/10 transition-all">
                  Trade {m.market} <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
