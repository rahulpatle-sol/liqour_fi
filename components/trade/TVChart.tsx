'use client'
import { useEffect, useRef } from 'react'

const SYMBOL_MAP: Record<string, string> = {
  SOL: 'BINANCE:SOLUSDT',
  BTC: 'BINANCE:BTCUSDT',
  ETH: 'BINANCE:ETHUSDT',
}

export default function TVChart({ market }: { market: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const symbol = SYMBOL_MAP[market] || `BINANCE:${market}USDT`
    let widget: any = null

    const init = () => {
      if (!containerRef.current || typeof (window as any).TradingView === 'undefined') return
      widget = new (window as any).TradingView.widget({
        container_id: containerRef.current.id,
        symbol,
        interval: '60',
        timezone: 'exchange',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#0B0E11',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        autosize: true,
        studies: [
          'MACD@tv-basicstudies',
          'StochasticRSI@tv-basicstudies',
          'TripleEMA@tv-basicstudies',
        ],
      })
    }

    if (typeof (window as any).TradingView !== 'undefined') {
      init()
    } else {
      const s = document.createElement('script')
      s.src = 'https://s3.tradingview.com/tv.js'
      s.async = true
      s.onload = init
      document.head.appendChild(s)
    }

    return () => {
      if (widget) {
        try { widget.remove() } catch {}
        widget = null
      }
    }
  }, [market])

  return (
    <div className="flex flex-col h-full bg-[#0B0E11]">
      <div
        id="tv-chart-container"
        ref={containerRef}
        className="flex-1 min-h-0 w-full"
      />
    </div>
  )
}
