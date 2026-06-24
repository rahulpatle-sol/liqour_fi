'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
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
  const { publicKey } = useWallet()
  const [price, setPrice]     = useState(0)
  const [prevPrice, setPrev]  = useState(0)
  const [change, setChange]   = useState(0)
  const [vol, setVol]         = useState('$12.4M')
  const [oi, setOi]           = useState('$4.2M')
  const [funding, setFunding] = useState(0.0001)
  const [indexPrice, setIndexPrice] = useState(0)
  const [activePanel, setActivePanel] = useState<'book'|'trades'>('book')
  const [mobileTab, setMobileTab] = useState<'book'|'trade'|'positions'>('book')
  const { subscribe, on }     = useWebSocket()

  useEffect(() => {
    getMarket(market).then(d => {
      setPrice(d.price)
      setChange(d.h24_change || 0)
      setVol('$' + (d.h24_volume || 12.4).toLocaleString('en-US', { maximumFractionDigits: 0 }))
      setFunding(d.funding_rate ?? 0.0001)
      setIndexPrice(d.orderbook?.index_price ?? 0)
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
      className="flex flex-col bg-[#0B0E11] mt-14 lg:mt-24"
      style={{ height: 'calc(100dvh - 56px)'  }}
    >
      {/* ── Top Ticker ── */}
      <div className="flex items-center gap-2 lg:gap-5 px-2 lg:px-4 h-10 lg:h-12 bg-[#161A1E] border-b border-[#2B3139] overflow-x-auto shrink-0 scrollbar-hide scroll-container">
        {/* Pair */}
        <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
          <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-[9px] lg:text-[10px] font-bold text-white shrink-0">
            {market[0]}
          </div>
          <span className="text-white font-bold text-xs lg:text-sm">{market}/USDC</span>
          <span className="text-[#848E9C] text-[9px] lg:text-[10px] bg-[#1E2329] px-1 lg:px-1.5 py-0.5 rounded hidden sm:inline">Perp</span>
        </div>

        {/* Price — big + animated */}
        <div className="shrink-0 flex flex-col">
          <span
            key={price}
            className={`text-base lg:text-lg font-black font-mono transition-colors duration-300 leading-tight ${priceUp ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
          >
            ${fmtP(price)}
          </span>
          <span className={`text-[9px] lg:text-[10px] font-semibold ${up ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
            {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>

        <div className="w-px h-5 lg:h-6 bg-[#2B3139] shrink-0" />

        <TickerStat label="24h Vol"  value={vol} />
        <TickerStat label="OI"       value={oi} className="hidden sm:flex" />
        <TickerStat label="Funding"  value={`${(funding * 100).toFixed(4)}%`} color="text-[#F0B90B]" />
        <TickerStat label="Index"    value={indexPrice > 0 ? `$${fmtP(indexPrice)}` : '—'} color="text-[#848E9C]" className="hidden lg:flex" />

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ECB81] opacity-75"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ECB81]"/>
          </span>
          <span className="text-[#848E9C] text-xs hidden sm:inline">Live</span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">

        {/* Chart */}
        <div className="flex-1 min-w-0 min-h-0 relative max-lg:max-h-[50%] lg:max-h-full">
          <TradingChart market={market} />
        </div>

        {/* ── Desktop: Right Panels (lg+) ── */}
        {/* Orderbook + Trades toggle */}
        <div className="hidden lg:flex w-[220px] shrink-0 flex-col border-l border-[#2B3139]">
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
        <div className="hidden lg:block w-[260px] shrink-0 overflow-y-auto bg-[#161A1E] border-l border-[#2B3139]">
          <OrderForm market={market} price={price} />
        </div>

        {/* ── Mobile: Bottom Panel (< lg) ── */}
        <div className="flex flex-col lg:hidden flex-1 min-h-0 border-t border-[#2B3139]">
          {/* Tab bar */}
          <div className="flex border-b border-[#2B3139] shrink-0 bg-[#161A1E]">
            {(['book', 'trade', 'positions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors capitalize ${
                  mobileTab === tab
                    ? 'text-white border-b-2 border-[#F0B90B] bg-[#0B0E11]'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                {tab === 'book' ? 'Orderbook' : tab === 'trade' ? 'Trade' : 'Positions'}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-y-auto scroll-container">
            {mobileTab === 'book' && (
              <div className="flex h-full">
                {/* Mini tabs for book/trades inside the mobile panel */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex border-b border-[#2B3139] shrink-0">
                    {(['book', 'trades'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setActivePanel(p)}
                        className={`flex-1 py-1.5 text-[10px] font-semibold transition-colors capitalize ${
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
              </div>
            )}
            {mobileTab === 'trade' && <OrderForm market={market} price={price} />}
            {mobileTab === 'positions' && <PositionsTable key={publicKey?.toBase58() || 'no-wallet'} />}
          </div>
        </div>
      </div>

      {/* ── Desktop: Bottom Panel ── */}
      <div className="hidden lg:block h-48 shrink-0 border-t border-[#2B3139] overflow-hidden">
        <PositionsTable key={publicKey?.toBase58() || 'no-wallet'} />
      </div>
    </div>
  )
}

function TickerStat({
  label, value, color = 'text-[#EAECEF]', className = ''
}: { label: string; value: string; color?: string; className?: string }) {
  return (
    <div className={`shrink-0 flex flex-col ${className}`}>
      <span className="text-[#848E9C] text-[10px]">{label}</span>
      <span className={`text-xs font-semibold font-mono ${color}`}>{value}</span>
    </div>
  )
}