'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLeaderboard, type Trader } from '@/lib/api'
import { Trophy, ArrowRight, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function LeaderboardPreview() {
  const [traders, setTraders] = useState<Trader[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getLeaderboard('pnl', 5).then(d => setTraders(d.traders))
  }, [])

  useEffect(() => {
    const el = tableRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('tr'),
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [traders])

  const fmt = (n: number) => (n >= 0 ? '+' : '') + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2 })

  return (
    <section ref={sectionRef} className="bg-black py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#0052FF] text-xs font-semibold tracking-widest uppercase mb-3 block">
              Top Traders
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Alpha Leaderboard
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="hidden sm:flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div
          ref={tableRef}
          className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Rank', 'Trader', 'Win Rate', 'Total PnL', 'Trades', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traders.map((t, i) => {
                const up = t.total_pnl >= 0
                return (
                  <tr key={t.user_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-white/60 font-bold text-sm">
                        {i <= 2 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold text-sm">
                        {t.username || t.wallet_address.slice(0, 6) + '...' + t.wallet_address.slice(-4)}
                      </p>
                      <p className="text-white/30 text-xs font-mono">{t.wallet_address.slice(0, 8)}...</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/70 text-sm font-semibold">{t.win_rate}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold font-mono ${up ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {fmt(t.total_pnl)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/50 text-sm">{t.total_trades}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/portfolio?copy=${t.user_id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0052FF]/10 border border-[#0052FF]/20 text-[#0052FF] text-xs font-semibold hover:bg-[#0052FF]/20 transition-all"
                      >
                        Copy <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!traders.length && (
            <div className="py-12 text-center text-white/30">
              <Trophy size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No traders yet. Be the first!</p>
            </div>
          )}
        </div>

        <Link
          href="/leaderboard"
          className="sm:hidden flex items-center justify-center gap-1 mt-4 text-sm text-white/40 hover:text-white transition-colors"
        >
          View Full Leaderboard <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}
