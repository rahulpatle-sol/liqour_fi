'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cpu, GitPullRequest, Activity, BarChart3, Zap, Layers, ChevronRight, Sparkles } from 'lucide-react'
import clsx from 'clsx'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: GitPullRequest,
    title: 'Alpha Trigger',
    badge: 'STAGE_01',
    label: 'Master Entry',
    desc: 'A master elite trader executes a high-leverage long/short order. The transaction hits the memory core instantly.',
    accent: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-100'
  },
  {
    icon: Cpu,
    title: 'Tokio Fan-Out',
    badge: 'ENGINE_02',
    label: 'Atomic Dispatch',
    desc: 'The Rust core multi-threaded runtime reads active follower maps and clones allocation models into memory blocks.',
    accent: 'from-blue-600 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-100'
  },
  {
    icon: Activity,
    title: 'Slot Sweep',
    badge: 'MATCH_03',
    label: 'Zero Slippage',
    desc: 'Follower orders are injected directly into the exact same log cycle thread. No routing lag, zero pricing front-run.',
    accent: 'from-purple-600 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-100'
  },
  {
    icon: BarChart3,
    title: 'Sync Feed',
    badge: 'LIVE_04',
    label: 'Telemetry Active',
    desc: 'Positions populate live. Real-time unrealized PnL matrix, risk levels, and funding factors track flawlessly.',
    accent: 'from-emerald-600 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-100'
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cascade entrance for the title elements
      gsap.fromTo('.animate-header', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out',愉stagger: 0.1,
          scrollTrigger: { trigger: '.animate-header', start: 'top 90%' }
        }
      )

      // Micro-floating accent background shapes
      gsap.to('.floating-shape-1', { y: -25, rotate: 12, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.floating-shape-2', { y: 30, rotate: -15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to('.floating-shape-3', { scale: 1.15, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      // Animate pipelines and columns together
      const columns = gsap.utils.toArray('.pipeline-col')
      columns.forEach((col: any, index: number) => {
        gsap.fromTo(col,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: col,
              start: 'top 80%',
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="bg-white py-28 px-4 sm:px-8 relative overflow-hidden w-full border-t border-gray-100 selection:bg-blue-100">
      
      {/* ── ChronoTask-Style Ultra-Clean Canvas Background Grid ── */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-70" />
      
      {/* Ambient Radial Mesh Layer */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-50/40 via-purple-50/20 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── Charmi-Style Abstract Playful Micro Accent Shapes ── */}
      <div className="floating-shape-1 absolute top-24 left-10 md:left-20 w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-xl flex items-center justify-center font-bold text-xl text-amber-500 shadow-sm pointer-events-none select-none z-10 opacity-80">
        ⚡
      </div>
      <div className="floating-shape-2 absolute bottom-20 right-12 w-16 h-16 bg-purple-100 border-2 border-purple-300 rounded-full flex items-center justify-center font-bold text-2xl text-purple-500 shadow-sm pointer-events-none select-none z-10 opacity-80">
        🪐
      </div>
      <div className="floating-shape-3 absolute top-1/3 right-10 md:right-24 w-10 h-10 bg-emerald-100 border-2 border-emerald-300 rotate-45 rounded-lg flex items-center justify-center font-bold text-lg text-emerald-600 shadow-sm pointer-events-none select-none z-10 opacity-70">
        ✦
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ── Dynamic Header Unit ── */}
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <div className="animate-header inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0052FF] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
            <Sparkles size={12} className="animate-pulse" /> ENGINE_ARCHITECTURE
          </div>
          <h2 className="animate-header text-4xl sm:text-5xl font-black tracking-tight text-gray-950 leading-[1.1]">
            How Atomic Copy Execution Works
          </h2>
          <p className="animate-header text-gray-500 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Every follow trade bypasses standard public mempools entirely. We execute copy allocations inside the identical thread logic cycle block.
          </p>
        </div>

        {/* ── INTERACTIVE LIVE TIMELINE ENGINE INTERFACE ── */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Connecting Laser Wire Pipeline Track */}
          <div className="absolute top-24 left-4 right-4 h-[2px] bg-gray-100 hidden md:block z-0" />
          
          {STEPS.map((s, i) => {
            const IconComponent = s.icon
            const isSelected = activeTab === i

            return (
              <div 
                key={s.title}
                className="pipeline-col flex flex-col z-10 group/card cursor-pointer"
                onMouseEnter={() => setActiveTab(i)}
              >
                {/* Upper Telemetry Readout Indicator */}
                <div className="hidden md:flex items-center gap-2 mb-6 pl-4">
                  <span className={clsx(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all',
                    isSelected 
                      ? 'bg-gray-950 text-white border-gray-950 shadow-xs' 
                      : 'bg-white text-gray-400 border-gray-200'
                  )}>
                    {s.badge}
                  </span>
                  <div className={clsx(
                    'h-1 flex-1 rounded-full transition-all duration-500',
                    isSelected ? 'bg-[#0052FF] scale-x-100' : 'bg-gray-100 scale-x-50 origin-left'
                  )} />
                </div>

                {/* Main Dynamic Execution Card */}
                <div className={clsx(
                  'bg-white border rounded-2xl p-6 flex flex-col h-full transition-all duration-300 relative',
                  isSelected 
                    ? 'border-gray-950 shadow-[0_20px_50px_rgba(0,0,0,0.06)] -translate-y-2' 
                    : 'border-gray-200/80 shadow-xs hover:border-gray-300 hover:-translate-y-1'
                )}>
                  
                  {/* Decorative corner node index */}
                  <span className="absolute top-4 right-5 text-xs font-mono font-bold text-gray-300 group-hover/card:text-gray-400 transition-colors">
                    //0{i + 1}
                  </span>

                  {/* Icon Module Container */}
                  <div className={clsx(
                    'w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-all duration-300 mb-5',
                    isSelected ? `bg-gradient-to-br ${s.accent} text-white border-transparent rotate-6` : 'bg-gray-50 text-gray-700 border-gray-200'
                  )}>
                    <IconComponent size={18} strokeWidth={isSelected ? 2.5 : 2} />
                  </div>

                  {/* Content Elements */}
                  <p className={clsx('text-[11px] font-bold uppercase tracking-wider mb-1', s.textColor)}>
                    {s.label}
                  </p>
                  <h3 className="text-gray-950 font-extrabold text-lg tracking-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed flex-1">
                    {s.desc}
                  </p>

                  {/* Interaction footer arrow indicator */}
                  <div className="flex items-center gap-1.5 pt-4 mt-4 border-t border-gray-50 text-[11px] font-bold text-gray-400 group-hover/card:text-gray-900 transition-colors">
                    <span>Inspect Pipeline</span>
                    <ChevronRight size={12} className="group-hover/card:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── TECHNICAL VISUALIZATION HANDSHAKE INTERFACE ── */}
        <div className="mt-16 bg-gray-950 rounded-2xl p-6 sm:p-8 border border-gray-900 shadow-xl relative overflow-hidden">
          {/* Grid effect inside darker workspace box */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <p className="text-[10px] text-blue-400 font-mono font-bold tracking-widest uppercase">
                  Thread Status: REALTIME_MATCH_SYNCED
                </p>
              </div>
              <h4 className="text-white font-bold text-lg tracking-tight">
                Atomic Execution Segment: <span className="text-blue-400">{STEPS[activeTab].title}</span>
              </h4>
              <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                Active visual telemetry focusing on step {activeTab + 1}. System verification demonstrates perfect processing logic alignment within sub-millisecond network epochs.
              </p>
            </div>

            {/* Atomic Slot Simulation Visualization Box */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4 bg-gray-900/60 border border-gray-800 p-4 rounded-xl min-w-full sm:min-w-[460px]">
              <div className="flex flex-col gap-1 w-full sm:w-1/2">
                <span className="text-[10px] text-gray-500 font-mono font-bold">SOLANA SLOT BLOCK</span>
                <div className="h-9 px-3 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-300">#294810482</span>
                  <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md border border-blue-500/20 font-bold animate-pulse">ACTIVE</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-1/2">
                <span className="text-[10px] text-gray-500 font-mono font-bold">MATCHING POOL DISPATCH</span>
                <div className="h-9 px-2.5 rounded-lg bg-[#0052FF] flex items-center justify-between text-white shadow-md shadow-blue-600/10">
                  <div className="flex items-center gap-1.5">
                    <Layers size={12} className="animate-spin [animation-duration:3s]" />
                    <span className="text-xs font-mono font-black tracking-tight">ATOMIC_CYCLE</span>
                  </div>
                  <span className="text-[9px] font-mono bg-white/20 text-white px-1.5 py-0.5 rounded-md font-bold">
                    ±0.00ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}