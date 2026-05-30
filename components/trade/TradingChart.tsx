'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { createChart } from 'lightweight-charts'
import { getCandles } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

const TF_MS: Record<string, number> = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 }

export default function TradingChart({ market }: { market: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleRef = useRef<any>(null)
  const volRef = useRef<any>(null)
  const [tf, setTf] = useState('1m')
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const [high, setHigh] = useState(0)
  const [low, setLow] = useState(0)
  const { subscribe, on } = useWebSocket()

  const initChart = useCallback(() => {
    if (!containerRef.current) return
    if (chartRef.current) { chartRef.current.remove(); chartRef.current = null }

    const chart = createChart(containerRef.current, {
      layout: { background: { color: '#161A1E' }, textColor: '#848E9C' },
      grid: { vertLines: { color: '#2B3139' }, horzLines: { color: '#2B3139' } },
      crosshair: { vertLine: { color: '#5E6673', labelBackgroundColor: '#2B3139' }, horzLine: { color: '#5E6673', labelBackgroundColor: '#2B3139' } },
      rightPriceScale: { borderColor: '#2B3139', scaleMargins: { top: 0.1, bottom: 0.25 } },
      timeScale: { borderColor: '#2B3139', timeVisible: true, secondsVisible: false },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    })

    const candle = chart.addCandlestickSeries({
      upColor: '#0ECB81', downColor: '#F6465D',
      borderUpColor: '#0ECB81', borderDownColor: '#F6465D',
      wickUpColor: '#0ECB81', wickDownColor: '#F6465D',
    })

    const volume = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
    })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })

    chartRef.current = chart
    candleRef.current = candle
    volRef.current = volume

    getCandles(market, 300).then(({ candles }) => {
      if (!candles.length) return
      const cData = candles.map(c => ({ time: c.timestamp as any, open: +c.open, high: +c.high, low: +c.low, close: +c.close }))
      const vData = candles.map(c => ({ time: c.timestamp as any, value: +c.volume || 0, color: +c.close >= +c.open ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)' }))
      candle.setData(cData)
      volume.setData(vData)
      const last = cData[cData.length - 1]
      const first = cData[0]
      setPrice(last.close)
      setHigh(Math.max(...cData.map(c => c.high)))
      setLow(Math.min(...cData.map(c => c.low)))
      setChange(((last.close - first.open) / first.open) * 100)
      chart.timeScale().fitContent()
    })

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [market])

  useEffect(() => { const cleanup = initChart(); return cleanup }, [initChart])

  useEffect(() => {
    subscribe(`price:${market}`)
    let lastCandle: any = null
    const unsub = on('PRICE_UPDATE', (d: any) => {
      if (d.market !== market || !candleRef.current) return
      const p = +d.price
      setPrice(p)
      const nowMin = Math.floor(Date.now() / 60000) * 60
      if (!lastCandle || lastCandle.time !== nowMin) {
        lastCandle = { time: nowMin, open: p, high: p, low: p, close: p }
      } else {
        lastCandle.high = Math.max(lastCandle.high, p)
        lastCandle.low = Math.min(lastCandle.low, p)
        lastCandle.close = p
      }
      candleRef.current.update(lastCandle)
      if (volRef.current) volRef.current.update({ time: nowMin as any, value: 0, color: p >= lastCandle.open ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)' })
    })
    return unsub
  }, [market, subscribe, on])

  const fmtP = (n: number) => n > 999 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : n.toFixed(4)
  const up = change >= 0

  return (
    <div className="flex flex-col h-full bg-secondary">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border flex-wrap shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-tx-primary font-bold">{market}/USDC</span>
          <span className={`text-lg font-black font-mono ${up ? 'text-long' : 'text-short'}`}>{fmtP(price)}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${up ? 'bg-long/10 text-long' : 'bg-short/10 text-short'}`}>
            {up ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-tx-muted">
          <span>H: <span className="text-tx-secondary">{fmtP(high)}</span></span>
          <span>L: <span className="text-tx-secondary">{fmtP(low)}</span></span>
        </div>
        <div className="ml-auto flex gap-1">
          {Object.keys(TF_MS).map(t => (
            <button key={t} onClick={() => setTf(t)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${tf === t ? 'bg-orange/15 text-orange' : 'text-tx-muted hover:text-tx-secondary hover:bg-hover'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0" />
    </div>
  )
}