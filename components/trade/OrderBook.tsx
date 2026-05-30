'use client'
import { useEffect, useState, useRef } from 'react'
import { getMarket } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

type Level = [number, number]

export default function OrderBook({ market }: { market: string }) {
  const [bids, setBids] = useState<Level[]>([])
  const [asks, setAsks] = useState<Level[]>([])
  const [last, setLast] = useState(0)
  const [prevLast, setPrevLast] = useState(0)
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarket(market).then(d => {
      setBids(d.orderbook.bids.slice(0,14))
      setAsks(d.orderbook.asks.slice(0,14))
      setLast(d.orderbook.last_traded_price || d.price)
    })
    subscribe(`orderbook:${market}`)
    subscribe(`price:${market}`)
    const u1 = on('ORDERBOOK_UPDATE', (d: any) => {
      if (d.market !== market) return
      setBids(d.bids?.slice(0,14) || [])
      setAsks(d.asks?.slice(0,14) || [])
    })
    const u2 = on('PRICE_UPDATE', (d: any) => {
      if (d.market !== market) return
      setLast((prev) => { setPrevLast(prev); return d.price })
    })
    return () => { u1(); u2() }
  }, [market, subscribe, on])

  const maxQ = Math.max(...bids.map(b=>b[1]),...asks.map(a=>a[1]),0.001)
  const spread = asks[0]?.[0] && bids[0]?.[0] ? (asks[0][0] - bids[0][0]).toFixed(4) : '—'
  const spreadPct = asks[0]?.[0] && bids[0]?.[0] ? ((asks[0][0]-bids[0][0])/asks[0][0]*100).toFixed(3) : '—'
  const up = last >= prevLast
  const fmtP = (n: number) => n > 999 ? n.toLocaleString('en-US',{maximumFractionDigits:2}) : n.toFixed(4)
  const fmtQ = (n: number) => n.toFixed(4)

  return (
    <div className="flex flex-col h-full bg-secondary border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-tx-primary">Order Book</span>
        <span className="text-xs text-tx-muted">Depth</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 px-3 py-1.5 text-xs text-tx-muted border-b border-border shrink-0">
        <span>Price(USDC)</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Asks — reversed display */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {[...asks].reverse().slice(0,12).map(([p,q], i) => {
          const pct = (q / maxQ) * 100
          return (
            <div key={i} className="relative grid grid-cols-2 px-3 py-[3px] hover:bg-hover group cursor-default">
              <div className="absolute inset-y-0 right-0 bg-short/8 transition-all" style={{width:`${pct}%`}}/>
              <span className="text-short text-xs font-mono relative z-10">{fmtP(p)}</span>
              <span className="text-right text-tx-secondary text-xs font-mono relative z-10">{fmtQ(q)}</span>
            </div>
          )
        })}
      </div>

      {/* Last price + spread */}
      <div className="px-3 py-2 border-y border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-between">
          <span className={`text-base font-black font-mono ${up ? 'text-long' : 'text-short'}`}>
            {up ? '↑' : '↓'} {fmtP(last)}
          </span>
          <span className="text-tx-muted text-xs">≈ ${fmtP(last)}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-tx-muted text-xs">Spread</span>
          <span className="text-tx-muted text-xs">{spread} ({spreadPct}%)</span>
        </div>
      </div>

      {/* Bids */}
      <div className="flex-1 overflow-hidden">
        {bids.slice(0,12).map(([p,q], i) => {
          const pct = (q / maxQ) * 100
          return (
            <div key={i} className="relative grid grid-cols-2 px-3 py-[3px] hover:bg-hover cursor-default">
              <div className="absolute inset-y-0 right-0 bg-long/8 transition-all" style={{width:`${pct}%`}}/>
              <span className="text-long text-xs font-mono relative z-10">{fmtP(p)}</span>
              <span className="text-right text-tx-secondary text-xs font-mono relative z-10">{fmtQ(q)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
