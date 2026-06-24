'use client'
import { useEffect, useRef } from 'react'

const SYMBOLS = [
  { proName: 'BINANCE:SOLUSDT',   title: 'SOL/USDT' },
  { proName: 'BINANCE:BTCUSDT',   title: 'BTC/USDT' },
  { proName: 'BINANCE:ETHUSDT',   title: 'ETH/USDT' },
  { proName: 'BINANCE:BNBUSDT',   title: 'BNB/USDT' },
  { proName: 'BINANCE:ADAUSDT',   title: 'ADA/USDT' },
  { proName: 'BINANCE:DOTUSDT',   title: 'DOT/USDT' },
  { proName: 'UNISWAP:UNIUSDT',   title: 'UNI/USDT' },
]

export default function TVTickerTape() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadWidget = () => {
      if (!containerRef.current) return
      if (typeof (window as any).TradingView === 'undefined') return

      new (window as any).TradingView.widget({
        container_id: containerRef.current.id,
        widgetType: 'tickerTape',
        symbols: SYMBOLS,
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: 'adaptive',
        colorTheme: 'dark',
        autosize: true,
        locale: 'en',
      })
    }

    if (typeof (window as any).TradingView !== 'undefined') {
      loadWidget()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = loadWidget
    document.head.appendChild(script)
  }, [])

  return (
    <div
      id="tv-ticker-tape"
      ref={containerRef}
      className="w-full h-12 shrink-0"
    />
  )
}
