'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLeaderboard, type Trader } from '@/lib/api'
import { Trophy, ArrowRight, ChevronRight, Users } from 'lucide-react'

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
        el.querySelectorAll('tbody tr'),
        { y: 20, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [traders])

  const fmt = (n: number) => (n >= 0 ? '+' : '') + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2 })

  return (
    <section ref={sectionRef} className="bg-[#F8F9FA] py-24 px-6 relative overflow-hidden w-full border-t border-gray-200/40">
      {/* Background Dot Grid Effect matching image_9720f7.png */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      <div className="max-w-4xl mx-auto relative z-10 selection:bg-blue-100">
        
        {/* Header Block */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#0052FF] text-xs font-bold tracking-widest uppercase mb-3 block">
              Top Traders
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Alpha Leaderboard
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-[#0052FF] transition-colors group"
          >
            View Full List <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Clean White Table Panel */}
        <div
          ref={tableRef}
          className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Rank', 'Trader', 'Win Rate', 'Total PnL', 'Trades', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {traders.map((t, i) => {
                  const up = t.total_pnl >= 0
                  return (
                    <tr key={t.user_id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Rank Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-800">
                          {i === 0 && <span className="text-base">🥇</span>}
                          {i === 1 && <span className="text-base">🥈</span>}
                          {i === 2 && <span className="text-base">🥉</span>}
                          {i > 2 && `#${i + 1}`}
                        </span>
                      </td>

                      {/* Trader Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold text-sm">
                            {t.username || t.wallet_address.slice(0, 6) + '...' + t.wallet_address.slice(-4)}
                          </span>
                          <span className="text-gray-400 text-xs font-mono tracking-tight">
                            {t.wallet_address.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Win Rate */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700 text-sm font-semibold">{t.win_rate}%</span>
                      </td>

                      {/* PnL Tracker */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md border ${
                            up 
                              ? 'text-emerald-600 bg-emerald-50 border-emerald-100/50' 
                              : 'text-rose-600 bg-rose-50 border-rose-100/50'
                          }`}
                        >
                          {fmt(t.total_pnl)}
                        </span>
                      </td>

                      {/* Total Trades Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-500 font-medium text-sm">{t.total_trades}</span>
                      </td>

                      {/* Copy Action Trigger */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/portfolio?copy=${t.user_id}`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#0052FF] text-white text-xs font-medium hover:bg-[#0045E0] shadow-sm hover:shadow-md shadow-blue-500/10 active:scale-[0.97] transition-all"
                        >
                          Copy <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Fallback Empty State Container */}
          {!traders.length && (
            <div className="py-16 text-center text-gray-400 bg-white">
              <Trophy size={36} className="mx-auto mb-3 text-gray-300 stroke-[1.5]" />
              <p className="text-sm font-medium">No top masters active. Be the first to build alpha!</p>
            </div>
          )}
        </div>

        {/* Mobile View Fallback Button */}
        <Link
          href="/leaderboard"
          className="sm:hidden flex items-center justify-center gap-1 mt-6 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          View Full Leaderboard <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}