'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { TrendingUp, TrendingDown, Zap, Users, Shield, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

const ICONS: Record<string, string> = { SOL:'◎', BTC:'₿', ETH:'Ξ' }

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string,number>>({})
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string,number> = {}
      d.markets.forEach(m => p[m.market] = m.price)
      setPrices(p)
    })
    ;['SOL','BTC','ETH'].forEach(m => subscribe(`price:${m}`))
    const u = on('PRICE_UPDATE', (d:any) => setPrices(prev => ({...prev,[d.market]:d.price})))
    return u
  }, [subscribe, on])

  const fmt = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US',{maximumFractionDigits:2}) : '$' + n.toFixed(4)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-tx-secondary mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-long animate-pulse2"/>
          Live on Solana Devnet · Pyth Oracle
        </div>
        <h1 className="text-5xl font-black text-tx-primary mb-4 leading-tight">
          Trade Perps.<br/>
          <span className="text-orange">Copy</span> the Best.
        </h1>
        <p className="text-tx-secondary text-lg max-w-lg mx-auto mb-8">
          The first social copy-trading perps DEX on Solana. Follow top traders and automatically mirror their positions.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/trade/SOL"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange text-white font-bold hover:bg-orange/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange/20">
            Start Trading <ArrowRight size={16}/>
          </Link>
          <Link href="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border text-tx-primary font-semibold hover:border-border-l transition-all">
            📋 Copy Traders
          </Link>
        </div>
      </div>

      {/* Market cards */}
      <div className="grid md:grid-cols-3 gap-3 mb-10">
        {markets.map(m => {
          const lp = prices[m.market] || m.price
          const up = m.h24_change >= 0
          return (
            <Link key={m.market} href={`/trade/${m.market}`}
              className="group bg-card border border-border rounded-xl p-5 hover:border-border-l hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-xl font-black text-tx-secondary">{ICONS[m.market]}</div>
                  <div>
                    <p className="text-tx-primary font-bold">{m.market}/USDC</p>
                    <p className="text-tx-muted text-xs">Perpetual Futures</p>
                  </div>
                </div>
                <span className={clsx('text-xs font-bold px-2 py-1 rounded',up?'bg-long/10 text-long':'bg-short/10 text-short')}>
                  {up?'+':''}{m.h24_change.toFixed(2)}%
                </span>
              </div>

              <p className={clsx('text-2xl font-black font-mono mb-1',up?'text-long':'text-short')}>{fmt(lp)}</p>
              <div className="flex gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-long animate-pulse2 mt-1.5"/>
                <span className="text-xs text-tx-muted">Live</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-secondary rounded-lg p-2">
                  <p className="text-tx-muted text-xs">24h High</p>
                  <p className="text-tx-secondary text-xs font-mono">{fmt(m.h24_high)}</p>
                </div>
                <div className="bg-secondary rounded-lg p-2">
                  <p className="text-tx-muted text-xs">24h Low</p>
                  <p className="text-tx-secondary text-xs font-mono">{fmt(m.h24_low)}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-tx-muted group-hover:text-tx-primary group-hover:bg-hover transition-all border border-transparent group-hover:border-border">
                Trade {m.market} <ArrowRight size={14}/>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { icon:'📋', title:'Copy Trading', desc:'Auto-mirror top traders proportionally. Set your allocation, they trade, you profit.', color:'text-orange' },
          { icon:'⚡', title:'Low Latency', desc:'Rust backend with Tokio multi-threading. Sub-millisecond matching engine.', color:'text-sky' },
          { icon:'🔒', title:'Non-Custodial', desc:'Your wallet, your keys. Connect Phantom and trade without giving up custody.', color:'text-long' },
        ].map(f => (
          <div key={f.title} className="bg-card border border-border rounded-xl p-5">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className={`font-bold mb-2 ${f.color}`}>{f.title}</h3>
            <p className="text-tx-secondary text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
