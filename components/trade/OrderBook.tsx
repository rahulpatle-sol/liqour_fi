'use client'
import { useEffect, useState } from 'react'
import { getMarket } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

type Level = [number, number]

// Backend se [price, qty] ya {price, qty} dono handle karo
function normalizeLevel(l: any): Level {
  if (Array.isArray(l)) return [+l[0], +l[1]]
  if (l && typeof l === 'object') return [+(l.price ?? l[0] ?? 0), +(l.qty ?? l.size ?? l[1] ?? 0)]
  return [0, 0]
}

function normalizeLevels(arr: any): Level[] {
  if (!Array.isArray(arr)) return []
  return arr.map(normalizeLevel).filter(([p]) => p > 0)
}

export default function OrderBook({ market }: { market: string }) {
  const [bids, setBids]         = useState<Level[]>([])
  const [asks, setAsks]         = useState<Level[]>([])
  const [last, setLast]         = useState(0)
  const [prevLast, setPrevLast] = useState(0)
  const [flash, setFlash]       = useState<'up' | 'down' | null>(null)
  const { subscribe, on }       = useWebSocket()

  useEffect(() => {
    getMarket(market).then(d => {
      if (!d?.orderbook) return
      setBids(normalizeLevels(d.orderbook.bids).slice(0, 14))
      setAsks(normalizeLevels(d.orderbook.asks).slice(0, 14))
      setLast(d.orderbook.last_traded_price || d.price || 0)
    }).catch(() => {})

    subscribe(`orderbook:${market}`)
    subscribe(`price:${market}`)

    const u1 = on('ORDERBOOK_UPDATE', (d: any) => {
      if (!d || d.market !== market) return
      setBids(normalizeLevels(d.bids).slice(0, 14))
      setAsks(normalizeLevels(d.asks).slice(0, 14))
    })

    const u2 = on('PRICE_UPDATE', (d: any) => {
      if (!d || d.market !== market) return
      setLast(prev => {
        setPrevLast(prev)
        const dir = d.price >= prev ? 'up' : 'down'
        setFlash(dir)
        setTimeout(() => setFlash(null), 400)
        return +d.price
      })
    })

    return () => { u1(); u2() }
  }, [market, subscribe, on])

  const maxQ    = Math.max(...bids.map(b => b[1]), ...asks.map(a => a[1]), 0.001)
  const spread  = asks[0]?.[0] && bids[0]?.[0] ? (asks[0][0] - bids[0][0]).toFixed(4) : '—'
  const spreadP = asks[0]?.[0] && bids[0]?.[0]
    ? ((asks[0][0] - bids[0][0]) / asks[0][0] * 100).toFixed(3) : '—'
  const up = last >= prevLast

  const fmtP = (n: number) => n > 999
    ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : n.toFixed(4)

  return (
    <div className="flex flex-col h-full bg-[#0B0E11]">
      {/* Column headers */}
      <div className="grid grid-cols-2 px-3 py-1.5 text-[10px] text-[#848E9C] border-b border-[#2B3139] uppercase tracking-wider shrink-0">
        <span>Price (USDC)</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Asks — reversed so lowest ask is closest to mid */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {[...asks].reverse().slice(0, 12).map(([p, q], i) => {
          const pct = (q / maxQ) * 100
          return (
            <div key={i} className="relative grid grid-cols-2 px-3 py-[3.5px] hover:bg-[#1E2329] cursor-default group">
              <div
                className="absolute inset-y-0 right-0 bg-[#F6465D]/8 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
              <span className="text-[#F6465D] text-xs font-mono relative z-10 group-hover:text-[#FF6B7A]">
                {fmtP(p)}
              </span>
              <span className="text-right text-[#848E9C] text-xs font-mono relative z-10">
                {q.toFixed(4)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mid price */}
      <div className={`px-3 py-2.5 border-y border-[#2B3139] shrink-0 transition-colors duration-300 ${
        flash === 'up'   ? 'bg-[#0ECB81]/5' :
        flash === 'down' ? 'bg-[#F6465D]/5' : 'bg-[#161A1E]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-black font-mono transition-colors ${up ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {up ? '↑' : '↓'} {fmtP(last)}
          </span>
          <span className="text-[#5E6673] text-xs font-mono">≈ ${fmtP(last)}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[#5E6673] text-[10px]">Spread</span>
          <span className="text-[#5E6673] text-[10px]">{spread} ({spreadP}%)</span>
        </div>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-hidden">
        {bids.slice(0, 12).map(([p, q], i) => {
          const pct = (q / maxQ) * 100
          return (
            <div key={i} className="relative grid grid-cols-2 px-3 py-[3.5px] hover:bg-[#1E2329] cursor-default group">
              <div
                className="absolute inset-y-0 right-0 bg-[#0ECB81]/8 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
              <span className="text-[#0ECB81] text-xs font-mono relative z-10 group-hover:text-[#2EE89A]">
                {fmtP(p)}
              </span>
              <span className="text-right text-[#848E9C] text-xs font-mono relative z-10">
                {q.toFixed(4)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}