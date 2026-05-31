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
  const raw = params?.market
  const market = (typeof raw === 'string' ? raw : 'SOL').toUpperCase()
  const [price, setPrice]     = useState(0)
  const [prevPrice, setPrev]  = useState(0)
  const [change, setChange]   = useState(0)
  const [vol, setVol]         = useState('$12.4M')
  const [oi, setOi]           = useState('$4.2M')
  const [funding]             = useState(0.0001)
  const [activePanel, setActivePanel] = useState<'book'|'trades'>('book')
  const { subscribe, on }     = useWebSocket()

  useEffect(() => {
    getMarket(market).then(d => {
      setPrice(d.price)
      setChange(d.h24_change || 0)
    }).catch(() => {})
    subscribe(`price:${market}`)
    const u = on('PRICE_UPDATE', (d: any) => {
      if (d.market !== market) return
      setPrice(prev => { setPrev(prev); return d.price })
    })
    return () => { u() }
  }, [market, subscribe, on])

  const fmtP = (n: number) => n > 999
    ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : n.toFixed(4)
  const up = change >= 0
  const priceUp = price >= prevPrice

  return (
    <div
      className="flex flex-col bg-[#0B0E11] mt-24"
      style={{ height: 'calc(100vh - 56px)'  }}
    >
      {/* ── Top Ticker ── */}
      <div className="flex items-center gap-5 px-4 h-12 bg-[#161A1E] border-b border-[#2B3139] overflow-x-auto shrink-0 scrollbar-hide scroll-container">
        {/* Pair */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-[10px] font-bold text-white">
            {market[0]}
          </div>
          <span className="text-white font-bold text-sm">{market}/USDC</span>
          <span className="text-[#848E9C] text-[10px] bg-[#1E2329] px-1.5 py-0.5 rounded">Perp</span>
        </div>

        {/* Price — big + animated */}
        <div className="shrink-0 flex flex-col">
          <span
            key={price}
            className={`text-lg font-black font-mono transition-colors duration-300 ${priceUp ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
          >
            ${fmtP(price)}
          </span>
          <span className={`text-[10px] font-semibold ${up ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>

        <div className="w-px h-6 bg-[#2B3139] shrink-0" />

        <TickerStat label="24h Vol"  value={vol} />
        <TickerStat label="OI"       value={oi} />
        <TickerStat label="Funding"  value={`${(funding * 100).toFixed(4)}%`} color="text-[#F0B90B]" />
        <TickerStat label="Index"    value={`$${fmtP(price * 0.9998)}`} color="text-[#848E9C]" />

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ECB81] opacity-75"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ECB81]"/>
          </span>
          <span className="text-[#848E9C] text-xs">Live</span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Chart */}
        <div className="flex-1 min-w-0 min-h-0 relative">
          <TradingChart market={market} />
        </div>

        {/* Right Panel — Orderbook + Trades toggle */}
        <div className="w-[220px] shrink-0 flex flex-col border-l border-[#2B3139]">
          {/* Tab switcher */}
          <div className="flex border-b border-[#2B3139] shrink-0">
            {(['book', 'trades'] as const).map(p => (
              <button
                key={p}
                onClick={() => setActivePanel(p)}
                className={`flex-1 py-2 text-xs font-semibold transition-colors capitalize ${
                  activePanel === p
                    ? 'text-white border-b-2 border-[#F0B90B]'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                {p === 'book' ? 'Order Book' : 'Trades'}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            {activePanel === 'book'
              ? <OrderBook market={market} />
              : <RecentTrades market={market} />
            }
          </div>
        </div>

        {/* Order Form */}
        <div className="w-[260px] shrink-0 overflow-y-auto bg-[#161A1E] border-l border-[#2B3139]">
          <OrderForm market={market} price={price} />
        </div>
      </div>

      {/* ── Bottom Panel ── */}
      <div className="h-48 shrink-0 border-t border-[#2B3139] overflow-hidden">
        <PositionsTable />
      </div>
    </div>
  )
}

function TickerStat({
  label, value, color = 'text-[#EAECEF]'
}: { label: string; value: string; color?: string }) {
  return (
    <div className="shrink-0 flex flex-col">
      <span className="text-[#848E9C] text-[10px]">{label}</span>
      <span className={`text-xs font-semibold font-mono ${color}`}>{value}</span>
    </div>
  )
}