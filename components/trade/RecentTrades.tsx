'use client'
import { useEffect, useState } from 'react'
import { getTrades } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

type Trade = { fill_id:string; price:number; qty:number; created_at:string }

export default function RecentTrades({ market }: { market:string }) {
  const [trades, setTrades] = useState<Trade[]>([])
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getTrades(market).then(d => setTrades(d.trades.slice(0,20)))
    subscribe(`market:${market}`)
    const u = on('FILL', (d:any) => {
      if (d.market!==market) return
      setTrades(prev => [d,...prev].slice(0,20))
    })
    return u
  }, [market, subscribe, on])

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-3 px-3 py-1.5 text-xs text-tx-muted border-b border-border sticky top-0 bg-secondary">
        <span>Price</span><span className="text-center">Amount</span><span className="text-right">Time</span>
      </div>
      {trades.map(t => {
        const p = +t.price
        const q = +t.qty
        return (
          <div key={t.fill_id} className="grid grid-cols-3 px-3 py-1 hover:bg-hover text-xs">
            <span className="font-mono text-long">{p>999?p.toLocaleString('en-US',{maximumFractionDigits:2}):p.toFixed(4)}</span>
            <span className="font-mono text-tx-secondary text-center">{q.toFixed(4)}</span>
            <span className="text-tx-muted text-right">{new Date(t.created_at).toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
          </div>
        )
      })}
    </div>
  )
}
