'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Activity, Zap, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: Activity,
    title: 'Atomic Copy Trading',
    desc: 'When a Master Trader opens a position, a copy order is atomically inserted inside the matching engine — same slot, same price. No race conditions, no front-running.',
    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop',
  },
  {
    icon: Zap,
    title: 'Low-Latency Rust Backend',
    desc: 'Tokio multi-threaded runtime handles order matching in sub-millisecond time. Built for high-frequency perp trading with zero GC pauses.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
  },
  {
    icon: Shield,
    title: 'Non-Custodial by Design',
    desc: 'Your wallet, your keys. Sign messages via Phantom or Backpack to authenticate — no private keys ever leave your device.',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  },
]

export default function FeatureScroll() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      FEATURES.forEach((_, i) => {
        const card = sectionRef.current?.querySelector(`[data-feat="${i}"]`)
        const img = sectionRef.current?.querySelector(`[data-feat-img="${i}"]`)
        if (!card || !img) return

        gsap.fromTo(
          card,
          { x: -80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 75%' },
          }
        )
        gsap.fromTo(
          img,
          { x: 80, opacity: 0, scale: 0.95 },
          {
            x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: img, start: 'top 75%' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-black py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#0052FF] text-xs font-semibold tracking-widest uppercase mb-3 block">
            Engineered for Performance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Built Different.
          </h2>
        </div>

        <div className="space-y-24">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 items-center`}
            >
              <div data-feat={i} className="flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/20 flex items-center justify-center mb-6">
                  <f.icon size={24} className="text-[#0052FF]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{f.title}</h3>
                <p className="text-white/50 leading-relaxed text-base max-w-lg">{f.desc}</p>
              </div>
              <div data-feat-img={i} className="flex-1">
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-72 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
