'use client'

import { useEffect, useState } from 'react'
import { getLeaderboard, type Trader } from '@/lib/api'
import { TraderCard } from '@/components/leaderboard/TraderCard'
import { Trophy, DollarSign, Target, BarChart3, Users, Loader2 } from 'lucide-react'
import clsx from 'clsx'

const SORTS = [
  { key: 'pnl',       label: 'Top PnL' },
  { key: 'winrate',   label: 'Win Rate' },
  { key: 'volume',    label: 'Volume' },
  { key: 'followers', label: 'Most Copied' },
]

export default function LeaderboardPage() {
  const [traders, setTraders] = useState<Trader[]>([])
  const [sort, setSort]       = useState('pnl')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getLeaderboard(sort, 20)
      .then(d => setTraders(d.traders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sort])

  // Dynamic Lucide Icons Helper for Tabs
  const getSortIcon = (key: string) => {
    switch (key) {
      case 'pnl':       return <DollarSign size={16} />
      case 'winrate':   return <Target size={16} />
      case 'volume':    return <BarChart3 size={16} />
      case 'followers': return <Users size={16} />
      default:          return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 mt-24">

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Trophy size={22} className="text-yellow animate-pulse" />
          <h1 className="text-2xl font-bold text-tx-primary">Leaderboard</h1>
        </div>
        <p className="text-tx-secondary text-sm">
          Top traders on Liqour. Copy their positions automatically.
        </p>
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {SORTS.map(s => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={clsx(
              'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              sort === s.key
                ? 'bg-orange text-white shadow-sm shadow-orange/30'
                : 'bg-card border border-border text-tx-secondary hover:border-border-l hover:text-tx-primary'
            )}
          >
            <span className={clsx(sort === s.key ? 'text-white' : 'text-tx-muted')}>
              {getSortIcon(s.key)}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Skeleton / Loading */}
      {loading && (
        <div className="space-y-6">
          <div className="flex justify-center py-4">
            <Loader2 size={24} className="animate-spin text-orange" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl skeleton animate-pulse bg-card/50 border border-border/50" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && traders.length === 0 && (
        <div className="text-center py-24 text-tx-muted">
          <Trophy size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No traders yet. Be the first to trade!</p>
        </div>
      )}

      {/* Trader Cards Grid */}
      {!loading && traders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {traders.map((t, i) => (
            <TraderCard key={t.user_id} trader={t} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}