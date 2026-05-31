'use client'
import { useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import Hero from '@/components/landing/Hero'
import LiveTicker from '@/components/landing/LiveTicker'
import MarketGrid from '@/components/landing/MarketGrid'
import FeatureScroll from '@/components/landing/FeatureScroll'
import HowItWorks from '@/components/landing/HowItWorks'
import LeaderboardPreview from '@/components/landing/LeaderboardPreview'
import CTABanner from '@/components/landing/CTABanner'
import Footer from '@/components/layout/Footer'

export default function Home() {
  const { subscribe } = useWebSocket()

  useEffect(() => {
    ;['SOL', 'BTC', 'ETH'].forEach(m => subscribe(`price:${m}`))
  }, [subscribe])

  return (
    <>
      <Hero />
      <LiveTicker />
      <MarketGrid />
      <FeatureScroll />
      <HowItWorks />
      <LeaderboardPreview />
      <CTABanner />
      <Footer/>
    </>
  )
}
