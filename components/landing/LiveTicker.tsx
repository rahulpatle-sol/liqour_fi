'use client'
import { useEffect, useState } from 'react'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

const ICONS: Record<string, string> = { SOL:'◎', BTC:'₿', ETH:'Ξ' }

export default function LiveTicker() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string,number>>({})
  const [changes, setChanges] = useState<Record<string,number>>({})
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string,number> = {}
      const c: Record<string,number> = {}
      d.markets.forEach(m => {
        p[m.market] = m.price
        c[m.market] = m.h24_change
      })
      setPrices(p)
      setChanges(c)
    })
    ;['SOL','BTC','ETH'].forEach(m => subscribe(`price:${m}`))
    const u = on('PRICE_UPDATE', (d: any) => {
      setPrices(prev => ({ ...prev, [d.market]: d.price }))
    })
    return () => { u() }
  }, [subscribe, on])

  if (!markets.length) return null

  const items = [...markets, ...markets]

  return (
    <div className="relative bg-black border-y border-white/5 overflow-hidden">
      <div className="flex animate-ticker gap-16 py-3 whitespace-nowrap">
        {items.map((m, i) => {
          const price = prices[m.market] ?? m.price
          const change = changes[m.market] ?? m.h24_change
          const up = change >= 0
          return (
            <div key={`${m.market}-${i}`} className="flex items-center gap-4 shrink-0">
              <span className="text-white/30 font-mono text-sm">{ICONS[m.market]}</span>
              <span className="text-white/80 font-semibold text-sm">{m.market}/USDC</span>
              <span className="text-white font-mono text-sm font-bold">
                ${price > 999 ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : price.toFixed(4)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  up ? 'text-[#0ECB81] bg-[#0ECB81]/10' : 'text-[#F6465D] bg-[#F6465D]/10'
                }`}
              >
                {up ? '+' : ''}{change.toFixed(2)}%
              </span>
              <span className="text-[#0052FF]/40 text-xs font-mono">24h Vol ${(m.h24_volume / 1e6).toFixed(1)}M</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
