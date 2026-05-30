'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Cpu, GitPullRequest, Activity, BarChart3 } from 'lucide-react'

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
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 80%' },
          }
        )
      })

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.5, ease: 'power2.inOut',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 40%', scrub: 1 },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-black py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0052FF]/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#0052FF] text-xs font-semibold tracking-widest uppercase mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Atomic Copy Sequence
          </h2>
          <p className="text-white/40 mt-3 max-w-lg mx-auto">
            Every copy trade executes atomically inside the matching engine — same Rust runtime, same slot.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />
          <div
            ref={lineRef}
            className="absolute left-[19px] top-0 w-px bg-gradient-to-b from-[#0052FF] to-[#3B82F6] hidden md:block"
            style={{ height: '100%' }}
          />

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((s, i) => (
              <div key={s.title} data-step={i} className="flex gap-6 md:gap-10">
                <div className="relative z-10 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center">
                    <s.icon size={18} className="text-[#0052FF]" />
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex-1 hover:border-[#0052FF]/30 transition-colors">
                  <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
