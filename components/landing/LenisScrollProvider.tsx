'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'

export default function LenisScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // 1. Force remove native smooth scrolling CSS conflict
    document.documentElement.style.scrollBehavior = 'auto'

    const lenis = new Lenis({
      duration: 1.2, // Slightly reduced to make it snappy yet buttery smooth
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Normalizes mouse input tracking
    })

    lenisRef.current = lenis

    // 2. Optimized High-Performance RAF Loop
    let rafId: number
    
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    
    rafId = requestAnimationFrame(raf)

    // 3. Clean up explicitly
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return <>{children}</>
}