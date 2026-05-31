'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cpu, GitPullRequest, Activity, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: GitPullRequest,
    title: '1. Master Opens Position',
    desc: 'A Master Trader opens a long or short position on SOL/USDC perps inside the Rust matching engine.',
  },
  {
    icon: Cpu,
    title: '2. Tokio Dispatches Copy Orders',
    desc: 'The atomic copy-trading runtime scans active followers and dispatches copy orders at the same execution slot — no delay, no slippage.',
  },
  {
    icon: Activity,
    title: '3. Mirror Orders Enter the Book',
    desc: 'Copy orders hit the order book as independent limit/market orders. Each follower gets proportional sizing based on their allocation.',
  },
  {
    icon: BarChart3,
    title: '4. Positions Are Tracked On-Chain',
    desc: 'All positions — master and copies — are tracked in real time. Unrealized PnL, liquidation prices, and funding are synced automatically.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      STEPS.forEach((_, i) => {
        const card = sectionRef.current?.querySelector(`[data-step="${i}"]`)
        if (!card) return

        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        )
      })

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, 
            duration: 1.2, 
            ease: 'none',
            scrollTrigger: { 
              trigger: sectionRef.current, 
              start: 'top 40%', 
              end: 'bottom 60%', 
              scrub: 0.5 
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#F8F9FA] py-24 px-6 relative overflow-hidden w-full border-t border-gray-200/40">
      {/* Background Dot Grid Effect matching image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
      
      {/* Subtle light ambient light blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 selection:bg-blue-100">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">
            Execution Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Atomic Copy Sequence
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-base font-normal">
            Every copy trade executes atomically inside the matching engine — same Rust runtime, same slot.
          </p>
        </div>

        {/* Timeline Flow Container */}
        <div className="relative max-w-2xl mx-auto">
          
          {/* Base Background Track Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-200 hidden md:block" />
          
          {/* Animated Blue Progress Line */}
          <div
            ref={lineRef}
            className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-[#0052FF] to-blue-400 hidden md:block"
            style={{ height: 'calc(100% - 32px)' }}
          />

          {/* Cards Stack */}
          <div className="space-y-8 md:space-y-12">
            {STEPS.map((s, i) => (
              <div key={s.title} data-step={i} className="flex gap-6 md:gap-8 items-start group">
                
                {/* Node Milestone Icon */}
                <div className="relative z-10 shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center transition-colors group-hover:border-[#0052FF]/40">
                    <s.icon size={16} className="text-[#0052FF]" />
                  </div>
                </div>
                
                {/* Clean Content Card Panel */}
                <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-2xl p-6 flex-1 transition-all duration-300">
                  <h3 className="text-gray-900 font-bold text-base mb-1.5 tracking-tight">{s.title}</h3>
                  <p className="text-gray-500 text-sm font-normal leading-relaxed">{s.desc}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}