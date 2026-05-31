'use client'

import { useState } from 'react'
import type { Trader } from '@/lib/api'
import { followTrader } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { X, Loader2, Trophy, Copy, User, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

export function TraderCard({ trader, rank }: { trader: Trader; rank: number }) {
  const [showCopy, setShowCopy] = useState(false)
  const up = trader.total_pnl >= 0
  const addr = trader.wallet_address

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-4 hover:border-border-l transition-all hover:shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0',
            rank === 1 ? 'bg-yellow/20 text-yellow' :
            rank === 2 ? 'bg-secondary text-tx-secondary' :
            rank === 3 ? 'bg-orange/10 text-orange' :
            'bg-secondary text-tx-muted'
          )}>
            {rank <= 3 ? <Trophy size={15} /> : rank}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-tx-primary font-semibold text-sm truncate">
              {trader.username || addr.slice(0, 6) + '...' + addr.slice(-4)}
            </p>
            <p className="text-tx-muted text-xs font-mono mt-0.5">
              {addr.slice(0, 8)}...
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className={clsx(
              'font-semibold text-sm font-mono',
              up ? 'text-long' : 'text-short'
            )}>
              {up ? '+' : '-'}${Math.abs(trader.total_pnl).toFixed(2)}
            </p>
            <p className="text-tx-muted text-xs mt-0.5">Total PnL</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Win Rate', value: `${(+trader.win_rate).toFixed(1)}%` },
            { label: 'Trades',   value: String(trader.total_trades) },
            { label: 'Followers', value: String(trader.follower_count) },
          ].map(s => (
            <div key={s.label} className="bg-secondary rounded-xl p-2.5 text-center">
              <p className="text-tx-muted text-xs mb-1">{s.label}</p>
              <p className="text-tx-primary font-semibold text-sm">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        {trader.open_positions.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {trader.open_positions.slice(0, 2).map(pos => (
              <div key={pos.position_id}
                className="flex items-center justify-between text-xs bg-secondary rounded-lg px-3 py-2">
                <span className="text-tx-secondary font-medium">
                  {pos.market} {pos.leverage}×
                </span>
                <span className={clsx(
                  'font-semibold uppercase tracking-wide',
                  pos.side === 'long' ? 'text-long' : 'text-short'
                )}>
                  {pos.side}
                </span>
                <span className={clsx(
                  'font-mono',
                  +pos.unrealized_pnl >= 0 ? 'text-long' : 'text-short'
                )}>
                  {+pos.unrealized_pnl >= 0 ? '+' : '-'}${Math.abs(+pos.unrealized_pnl).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={() => setShowCopy(true)}
          className="w-full py-2.5 rounded-xl border border-orange/30 bg-orange/5 text-orange text-sm font-semibold hover:bg-orange hover:text-white hover:border-orange transition-all flex items-center justify-center gap-2"
        >
          <Copy size={14} />
          Copy Trade
        </button>
      </div>

      {showCopy && (
        <CopyModal trader={trader} onClose={() => setShowCopy(false)} />
      )}
    </>
  )
}

function CopyModal({ trader, onClose }: { trader: Trader; onClose: () => void }) {
  const { isAuthenticated } = useAuth()
  const [amount, setAmount]   = useState('100')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  const handle = async () => {
    if (!isAuthenticated) { setError('Connect wallet first'); return }
    const n = parseFloat(amount)
    if (!n || n <= 0) { setError('Enter a valid amount'); return }
    setLoading(true)
    setError('')
    try {
      await followTrader(trader.user_id, n)
      setDone(true)
      setTimeout(onClose, 1500)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const addr = trader.wallet_address
  const name = trader.username || addr.slice(0, 6) + '...' + addr.slice(-4)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl transition-all scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-tx-primary font-semibold text-base">Copy Trade</h3>
          <button
            onClick={onClose}
            className="text-tx-muted hover:text-tx-primary p-1.5 rounded-lg hover:bg-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Trader Preview */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-secondary rounded-xl border border-border">
          <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-tx-primary font-semibold text-sm truncate">{name}</p>
            <p className="text-long text-xs mt-0.5 font-medium">
              {(+trader.win_rate).toFixed(1)}% win rate · {trader.total_trades} trades
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-xs text-tx-muted mb-1.5 block font-medium">
            Copy Amount (USDC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
            disabled={loading || done}
            className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-tx-primary font-mono text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange/30 transition-colors disabled:opacity-50"
          />
          <p className="text-xs text-tx-muted mt-1.5">
            Proportionally mirrors {name}'s positions.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <p className="text-short text-xs mb-3 bg-short/5 border border-short/20 rounded-lg px-3 py-2 font-medium">
            {error}
          </p>
        )}

        {/* Action Button / Success State */}
        {done ? (
          <div className="text-center py-3 text-long font-semibold text-sm flex items-center justify-center gap-2 bg-long/5 border border-long/20 rounded-xl">
            <CheckCircle2 size={16} className="text-long animate-bounce" />
            Now copying {name}!
          </div>
        ) : (
          <button
            onClick={handle}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Copy size={14} />
            )}
            {loading ? 'Processing...' : 'Start Copying'}
          </button>
        )}
      </div>
    </div>
  )
}