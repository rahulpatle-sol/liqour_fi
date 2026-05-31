'use client'
import { useEffect, useState } from 'react'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

const ICONS: Record<string, string> = { SOL: '◎', BTC: '₿', ETH: 'Ξ', USDC: '$' }

export default function LiveTicker() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [changes, setChanges] = useState<Record<string, number>>({})
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string, number> = {}
      const c: Record<string, number> = {}
      d.markets.forEach(m => {
        p[m.market] = m.price
        c[m.market] = m.h24_change
      })
      setPrices(p)
      setChanges(c)
    })

    ;['SOL', 'BTC', 'ETH'].forEach(m => subscribe(`price:${m}`))
    
    const u = on('PRICE_UPDATE', (d: any) => {
      setPrices(prev => ({ ...prev, [d.market]: d.price }))
    })
    
    return () => { u() }
  }, [subscribe, on])

  if (!markets.length) return null

  // Duplicate items for seamless continuous ticker animation loop
  const items = [...markets, ...markets]

  return (
    <div className="relative bg-green-300 backdrop-blur-sm border-y border-gray-200/60 overflow-hidden w-full z-10">
      <div className="flex animate-ticker gap-16 py-3 whitespace-nowrap items-center">
        {items.map((m, i) => {
          const price = prices[m.market] ?? m.price
          const change = changes[m.market] ?? m.h24_change
          const up = change >= 0
          
          return (
            <div key={`${m.market}-${i}`} className="flex items-center gap-4 shrink-0 selection:bg-blue-100">
              {/* Token Symbol Icon */}
              <span className="text-gray-400 font-mono text-sm font-semibold">
                {ICONS[m.market] || '•'}
              </span>
              
              {/* Pair Name */}
              <span className="text-gray-800 font-bold text-sm tracking-tight">
                {m.market}/USDC
              </span>
              
              {/* Live Price */}
              <span className="text-gray-900 font-mono text-sm font-bold tracking-tight">
                ${price > 999 ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : price.toFixed(4)}
              </span>
              
              {/* Minimal Clean Change Badge */}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                  up 
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                    : 'text-rose-600 bg-rose-50 border-rose-100'
                }`}
              >
                {up ? '+' : ''}{change.toFixed(2)}%
              </span>
              
              {/* 24h Volume */}
              <span className="text-gray-400 text-xs font-medium tracking-tight">
                Vol: ${(m.h24_volume / 1e6).toFixed(1)}M
              </span>
              
              {/* Subtle visual separator item between tickers */}
              <span className="text-gray-200 text-xs font-light ml-2">│</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}