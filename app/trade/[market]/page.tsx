'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getMarket } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import dynamic from 'next/dynamic'
import OrderBook from '@/components/trade/OrderBook'
import OrderForm from '@/components/trade/OrderForm'
import PositionsTable from '@/components/trade/PositionsTable'
import RecentTrades from '@/components/trade/RecentTrades'

const TradingChart = dynamic(() => import('@/components/trade/TradingChart'), { ssr: false })

export default function TradePage() {
  const params = useParams()
  const market = (params.market as string).toUpperCase()
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const [funding, setFunding] = useState(0.0001)
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarket(market).then(d => { setPrice(d.price) })
    subscribe(`price:${market}`)
    const u = on('PRICE_UPDATE', (d:any) => { if(d.market===market) setPrice(d.price) })
    return u
  }, [market, subscribe, on])

  const fmtP = (n: number) => n > 999 ? n.toLocaleString('en-US',{maximumFractionDigits:2}) : n.toFixed(4)
  const up = change >= 0

  return (
    <div className="flex flex-col bg-primary" style={{height:'calc(100vh - 56px)'}}>
      {/* Top ticker */}
      <div className="flex items-center gap-6 px-4 h-11 bg-secondary border-b border-border overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-tx-primary font-bold">{market}/USDC</span>
          <span className="text-tx-muted text-xs">Perp</span>
        </div>
        <span className={`text-base font-black font-mono shrink-0 ${up?'text-long':'text-short'}`}>${fmtP(price)}</span>
        <TickerStat label="24h Change" value={`${up?'+':''}${change.toFixed(2)}%`} color={up?'text-long':'text-short'} />
        <TickerStat label="24h Vol" value="$12.4M" />
        <TickerStat label="Open Interest" value="$4.2M" />
        <TickerStat label="Funding/1h" value={`${(funding*100).toFixed(4)}%`} color="text-sky" />
        <TickerStat label="Index" value={`$${fmtP(price*0.9998)}`} />
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-long animate-pulse2"/>
          <span className="text-tx-muted text-xs">Pyth Live</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex flex-1 min-h-0">
        {/* Chart — takes most space */}
        <div className="flex-1 min-w-0 min-h-0">
          <TradingChart market={market} />
        </div>
        {/* Orderbook */}
        <div className="w-[220px] shrink-0 min-h-0">
          <OrderBook market={market} />
        </div>
        {/* Form */}
        <div className="w-[260px] shrink-0 overflow-y-auto bg-secondary border-l border-border">
          <OrderForm market={market} price={price} />
        </div>
      </div>

      {/* Bottom panel */}
      <div className="h-44 shrink-0 border-t border-border overflow-hidden">
        <PositionsTable />
      </div>
    </div>
  )
}

function TickerStat({label,value,color='text-tx-secondary'}:{label:string;value:string;color?:string}) {
  return (
    <div className="shrink-0">
      <span className="text-tx-muted text-xs">{label} </span>
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
    </div>
  )
}
