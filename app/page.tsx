'use client'
import { useEffect, useState } from 'react'
import { getMarkets, type Market } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'

// Component Imports
import Hero from '@/components/home/Hero'
import LiveTicker from '../components/home/LiveTicker';

import MarketGrid from '@/components/home/MarketGrid'
import FeatureScroll from '@/components/home/FeatureScroll'
import HowItWorks from '@/components/home/HowItWorks'
import LeaderboardPreview from '../components/home/LeaderBoardPreview';

import TechStack from '@/components/home/TechStack'
import CTABanner from '@/components/home/CTABanner'

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})
  const { subscribe, on } = useWebSocket()

  useEffect(() => {
    getMarkets().then(d => {
      setMarkets(d.markets)
      const p: Record<string, number> = {}
      d.markets.forEach(m => p[m.market] = m.price)
      setPrices(p)
    })

    const targetMarkets = ['SOL', 'BTC', 'ETH']
    targetMarkets.forEach(m => subscribe(`price:${m}`))

    const unsubscribe = on('PRICE_UPDATE', (d: any) => {
      setPrices(prev => ({ ...prev, [d.market]: d.price }))
    })

    return () => { unsubscribe() }
  }, [subscribe, on])

  return (
    <div className="bg-neutral-950 min-h-screen text-white antialiased selection:bg-orange/30 overflow-x-hidden">
      <Hero />
      <LiveTicker prices={prices} />
      <MarketGrid markets={markets} prices={prices} />
      <FeatureScroll />
      <HowItWorks />
      <LeaderboardPreview />
      <TechStack />
      <CTABanner />
    </div>
  )
}