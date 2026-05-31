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
    // Clean minimal tech abstract image placeholders that pop nicely on white backgrounds
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', 
  },
  {
    icon: Zap,
    title: 'Low-Latency Rust Backend',
    desc: 'Tokio multi-threaded runtime handles order matching in sub-millisecond time. Built for high-frequency perp trading with zero GC pauses.',
    img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop',
  },
  {
    icon: Shield,
    title: 'Non-Custodial by Design',
    desc: 'Your wallet, your keys. Sign messages via Phantom or Backpack to authenticate — no private keys ever leave your device.',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
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
          { y: 30, opacity: 0 },
          {
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 80%' },
          }
        )
        gsap.fromTo(
          img,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.9, 
            ease: 'power3.out',
            scrollTrigger: { trigger: img, start: 'top 80%' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#F8F9FA] py-24 px-6 relative overflow-hidden w-full border-t border-gray-200/40">
      {/* Background Dot Grid Effect matching image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      <div className="max-w-5xl mx-auto relative z-10 selection:bg-blue-100">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">
            Engineered for Performance
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Built Different.
          </h2>
        </div>

        {/* Feature Blocks Stack */}
        <div className="space-y-28 md:space-y-36">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-16 items-center`}
            >
              {/* Text Side */}
              <div data-feat={i} className="flex-1 text-left">
                {/* Modernized Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mb-6">
                  <f.icon size={20} className="text-[#0052FF]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-4">
                  {f.title}
                </h3>
                <p className="text-gray-500 font-normal leading-relaxed text-base max-w-lg">
                  {f.desc}
                </p>
              </div>

              {/* Graphic/Image Box Side */}
              <div data-feat-img={i} className="flex-1 w-full">
                <div className="relative bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-3 group">
                  <div className="relative overflow-hidden rounded-xl h-72 sm:h-80 w-full bg-gray-50">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-cover grayscale opacity-90 contrast-[1.05] group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    {/* Soft light gloss gradient vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}