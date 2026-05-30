'use client'
import Link from 'next/link'
import { ArrowUpRight, Award } from 'lucide-react'

export default function LeaderboardPreview() {
  const leaders = [
    { name: 'SolWhale_01', winRate: '92.4%', profit: '+$14,250', followers: 421 },
    { name: 'MadLadsAlum', winRate: '87.1%', profit: '+$9,810', followers: 219 },
    { name: 'Harkirat_Alpha', winRate: '81.5%', profit: '+$7,440', followers: 804 }
  ]

  return (
    <section className="py-24 bg-neutral-950/40 border-y border-neutral-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Top Performing Alpha Leaders</h2>
            <p className="text-neutral-400 text-sm mt-1">Review active profit performance analytics directly from the chain states.</p>
          </div>
          <Link href="/leaderboard" className="text-sm font-bold text-orange hover:underline flex items-center gap-1 self-start sm:self-center">
            View Live Leaderboard <ArrowUpRight size={16}/>
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/20 backdrop-blur-md">
          <div className="grid grid-cols-4 px-6 py-4 bg-neutral-900/50 text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
            <div>Trader Name</div>
            <div className="text-center">Win Rate</div>
            <div className="text-center">Cumulative PnL</div>
            <div className="text-right">Followers</div>
          </div>
          <div className="divide-y divide-neutral-900">
            {leaders.map((l, i) => (
              <div key={i} className="grid grid-cols-4 px-6 py-5 items-center text-sm text-neutral-300 font-medium hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Award size={16} className={i === 0 ? 'text-amber-400' : 'text-neutral-500'} />
                  {l.name}
                </div>
                <div className="text-center font-mono text-emerald-400 font-semibold">{l.winRate}</div>
                <div className="text-center font-mono text-emerald-400 font-bold">{l.profit}</div>
                <div className="text-right font-mono text-neutral-400">{l.followers}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}