'use client'
import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  Shield, Zap, Globe, Users, Cpu, ArrowRight, CheckCircle2,
  BarChart3, Sparkles, Quote, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import clsx from 'clsx'

const TEAM = [
  { name: 'Alex Chen', role: 'Founder & CEO', bio: 'Ex-Jump Trading, 6 yrs Solana infra', emoji: '🧠' },
  { name: 'Maya Patel', role: 'CTO', bio: 'Rust core engineer, former Anchor contributor', emoji: '⚡' },
  { name: 'Omar Hassan', role: 'Head of Product', bio: 'Built perp DEX products handling $2B+ volume', emoji: '🎯' },
  { name: 'Sarah Kim', role: 'Lead Solana Engineer', bio: 'Multiple SVM L2 deployments, SIP author', emoji: '🔧' },
]

const MILESTONES = [
  { year: '2023 Q4', title: 'Idea & Research', desc: 'Identified the copy-trading gap in Solana perps. Began rust-core matching engine design.' },
  { year: '2024 Q1', title: 'MVP Development', desc: 'Built the atomic copy-execution engine. Integrated Pyth oracles for real-time pricing.' },
  { year: '2024 Q2', title: 'Devnet Launch', desc: 'Launched on Solana devnet with SOL, BTC, ETH markets. 50x leverage, paper trading.' },
  { year: '2024 Q3', title: 'Social Features', desc: 'Added copy-trading, leaderboard, portfolio tracking. Onboarded 100+ test users.' },
]

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function StaggerList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export default function AboutPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
          <div className="absolute inset-0 bg-[radial-gradient(#0052FF08_1px,transparent_1px)] [background-size:24px_24px]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-blue-100/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border border-indigo-100/50"
          />
        </motion.div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0052FF] text-xs font-bold mb-6"
            >
              <Sparkles size={12} /> About Liqour
            </motion.span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Redefining{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] to-indigo-500">
                Social Trading
              </span>{' '}
              on Solana
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building the first atomic copy-trading perpetuals DEX — where following top traders
              means instant, trustless execution inside a Rust-powered matching engine.
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowRight size={20} className="text-gray-300 rotate-90" />
        </motion.div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">Our Mission</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Democratize Perpetual Trading</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Copy trading shouldn&apos;t mean sacrificing control or paying premium fees.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Atomic Execution', desc: 'Copy trades execute in the same slot as the master — no delays, no front-running.', color: '#0052FF' },
              { icon: Shield, title: 'Non-Custodial', desc: 'Funds stay in your wallet. Liqour never holds your private keys or USDC.', color: '#059669' },
              { icon: Globe, title: 'Permissionless', desc: 'Anyone can trade, anyone can be copied. No KYC, no barriers, pure DeFi.', color: '#D97706' },
              { icon: BarChart3, title: '50x Leverage', desc: 'Trade SOL, BTC, ETH with up to 50x leverage. Long or short, your choice.', color: '#DC2626' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.04)' }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: item.color + '10', border: '1px solid ' + item.color + '20' }}>
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="text-gray-900 font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">Journey</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Our Roadmap</h2>
              <p className="text-gray-400 text-lg">From ideation to devnet — what we&apos;ve built so far.</p>
            </div>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#0052FF] via-blue-200 to-transparent hidden md:block" />
            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.15}>
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative pl-16 md:pl-20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200, delay: i * 0.1 }}
                      className="absolute left-3 md:left-4 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#0052FF] flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
                    </motion.div>
                    <span className="text-[#0052FF] text-xs font-bold tracking-wider">{m.year}</span>
                    <h3 className="text-gray-900 font-bold text-xl mt-1">{m.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-lg">{m.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">Team</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Built by Engineers</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Former Jump, Anchor, and multiple Solana ecosystem contributors.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-gray-200 transition-all cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-2xl mx-auto mb-4"
                  >
                    {t.emoji}
                  </motion.div>
                  <h3 className="text-gray-900 font-bold text-sm">{t.name}</h3>
                  <p className="text-[#0052FF] text-xs font-semibold mt-0.5">{t.role}</p>
                  <p className="text-gray-400 text-xs mt-2">{t.bio}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-blue-50/50 border-t border-gray-100">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Start Trading</h2>
            <p className="text-gray-400 text-lg mb-8">Join the first social perps DEX on Solana. Paper trade on devnet today.</p>
            <Link
              href="/trade/SOL"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0052FF] text-white font-bold text-sm hover:bg-[#0045E0] transition-all shadow-lg shadow-blue-500/20"
            >
              Launch App <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>
      <Footer />
    </div>
  )
}
