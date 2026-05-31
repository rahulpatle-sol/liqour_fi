'use client'
import { useEffect, useState, useRef } from 'react'
import { getTrades } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import clsx from 'clsx'

type Trade = {
  fill_id: string
  price: number
  qty: number
  side?: string
  created_at: string
}

export default function RecentTrades({ market }: { market: string }) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [flash, setFlash]   = useState<string | null>(null)
  const { subscribe, on }   = useWebSocket()

  useEffect(() => {
    getTrades(market).then(d => {
      if (!d?.trades?.length) return
      setTrades(d.trades.slice(0, 30))
    }).catch(() => {})

    subscribe(`market:${market}`)
    const u = on('FILL', (d: any) => {
      if (!d || d.market !== market) return
      setTrades(prev => [d, ...prev].slice(0, 30))
      setFlash(d.fill_id)
      setTimeout(() => setFlash(null), 600)
    })
    return () => { u() }
  }, [market, subscribe, on])

  const fmtP = (n: number) =>
    n > 999
      ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : n.toFixed(4)

  const fmtTime = (s: string) =>
    new Date(s).toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    })

  return (
    <div className="flex flex-col h-full bg-[#0B0E11]">
      {/* Header */}
      <div className="grid grid-cols-3 px-3 py-2 text-[10px] text-[#848E9C] border-b border-[#2B3139] sticky top-0 bg-[#161A1E] uppercase tracking-wider">
        <span>Price</span>
        <span className="text-center">Size</span>
        <span className="text-right">Time</span>
      </div>

      {/* Trades list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {trades.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[#848E9C] text-xs">
            Waiting for trades...
          </div>
        ) : (
          trades.map((t, i) => {
            const p = +t.price
            const q = +t.qty
            const dir = t.side || (
              i < trades.length - 1
                ? (p >= +trades[i + 1].price ? 'long' : 'short')
                : 'long'
            )
            const isLong = dir === 'long'
            const isNew  = flash === t.fill_id

            return (
              <div
                key={t.fill_id}
                className={clsx(
                  'grid grid-cols-3 px-3 py-[3px] text-xs transition-all duration-300',
                  isNew
                    ? isLong ? 'bg-[#0ECB81]/10' : 'bg-[#F6465D]/10'
                    : 'hover:bg-[#1E2329]'
                )}
              >
                <span className={clsx(
                  'font-mono font-semibold',
                  isLong ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                )}>
                  {fmtP(p)}
                </span>
                <span className="font-mono text-[#848E9C] text-center">
                  {q.toFixed(3)}
                </span>
                <span className="text-[#5E6673] text-right text-[10px]">
                  {fmtTime(t.created_at)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}