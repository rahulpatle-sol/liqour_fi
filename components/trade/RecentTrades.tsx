'use client'
import { useEffect, useState, useRef } from 'react'
import { getTrades } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import clsx from 'clsx'

type Trade = { fill_id:string; price:number; qty:number; side?:string; created_at:string }

export default function RecentTrades({ market }: { market:string }) {
  const [trades, setTrades] = useState<Trade[]>([])
  const prevPrice = useRef(0)
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getTrades(market).then(d => {
      if (!d?.trades?.length) return
      const arr = Array.isArray(d.trades) ? d.trades : []
      setTrades(arr.slice(0,20))
      if (arr.length) prevPrice.current = +arr[0].price
    }).catch(() => {})
    subscribe(`market:${market}`)
    const u = on('FILL', (d:any) => {
      if (!d || d.market!==market) return
      setTrades(prev => {
        const arr = Array.isArray(prev) ? prev : []
        return [d,...arr].slice(0,20)
      })
    })
    return () => { u() }
  }, [market, subscribe, on])

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-3 px-3 py-1.5 text-xs text-[#848E9C] border-b border-[#2B3139] sticky top-0 bg-[#161A1E]">
        <span>Price</span><span className="text-center">Amount</span><span className="text-right">Time</span>
      </div>
      {trades.map((t,i) => {
        const p = +t.price
        const q = +t.qty
        const direction = t.side || (i < trades.length-1 ? (p >= +trades[i+1].price ? 'long' : 'short') : 'long')
        const color = direction === 'long' ? 'text-[#0ECB81]' : 'text-[#F6465D]'
        return (
          <div key={t.fill_id} className="grid grid-cols-3 px-3 py-1 hover:bg-[#252A2F] text-xs">
            <span className={clsx('font-mono', color)}>{p>999?p.toLocaleString('en-US',{maximumFractionDigits:2}):p.toFixed(4)}</span>
            <span className="font-mono text-[#848E9C] text-center">{q.toFixed(4)}</span>
            <span className="text-[#5E6673] text-right">{new Date(t.created_at).toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
          </div>
        )
      })}
    </div>
  )
}
