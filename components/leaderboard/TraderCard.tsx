'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Trader } from '@/lib/api'
import { followTrader, unfollowTrader } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Trophy, Copy, User, CheckCircle2, AlertTriangle, Bell, Shield, TrendingDown, Sliders } from 'lucide-react'
import clsx from 'clsx'

const STORAGE_KEY = 'liqour_copy_settings'

export type CopySettings = {
  leader_id: string
  amount: number
  maxLoss: number
  alertThreshold: number
  autoUnfollow: boolean
}

function getSettings(): Record<string, CopySettings> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function saveSettings(id: string, s: CopySettings) {
  const all = getSettings()
  all[id] = s
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

function removeSettings(id: string) {
  const all = getSettings()
  delete all[id]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getCopyAlerts(): { leader_id: string; type: 'loss_threshold' | 'max_loss'; current: number; settings: CopySettings }[] {
  return []
}

export function TraderCard({ trader, rank }: { trader: Trader; rank: number }) {
  const [showCopy, setShowCopy] = useState(false)
  const up = trader.total_pnl >= 0
  const addr = trader.wallet_address

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.03 }}
        className="bg-card border border-border rounded-2xl p-4 hover:border-border-l transition-all hover:shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx(
            'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0',
            rank === 1 ? 'bg-yellow/20 text-yellow' :
            rank === 2 ? 'bg-secondary text-tx-secondary' :
            rank === 3 ? 'bg-orange/10 text-orange' :
            'bg-secondary text-tx-muted'
          )}>
            {rank <= 3 ? <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}><Trophy size={15} /></motion.span> : rank}
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
            <motion.p
              key={trader.total_pnl}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={clsx('font-semibold text-sm font-mono', up ? 'text-long' : 'text-short')}
            >
              {up ? '+' : '-'}${Math.abs(trader.total_pnl).toFixed(2)}
            </motion.p>
            <p className="text-tx-muted text-xs mt-0.5">Total PnL</p>
          </div>
        </div>

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

        {trader.open_positions.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {trader.open_positions.slice(0, 2).map(pos => {
              const posUp = +pos.unrealized_pnl >= 0
              return (
                <motion.div
                  key={pos.position_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-xs bg-secondary rounded-lg px-3 py-2"
                >
                  <span className="text-tx-secondary font-medium">
                    {pos.market} {pos.leverage}×
                  </span>
                  <span className={clsx('font-semibold uppercase', pos.side === 'long' ? 'text-long' : 'text-short')}>
                    {pos.side}
                  </span>
                  <motion.span
                    key={pos.unrealized_pnl}
                    animate={{ scale: [1, 1.05, 1] }}
                    className={clsx('font-mono', posUp ? 'text-long' : 'text-short')}
                  >
                    {posUp ? '+' : '-'}${Math.abs(+pos.unrealized_pnl).toFixed(2)}
                  </motion.span>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCopy(true)}
          className="w-full py-2.5 rounded-xl border border-orange/30 bg-orange/5 text-orange text-sm font-semibold hover:bg-orange hover:text-white hover:border-orange transition-all flex items-center justify-center gap-2"
        >
          <Copy size={14} />
          Copy Trade
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showCopy && <CopyModal trader={trader} onClose={() => setShowCopy(false)} />}
      </AnimatePresence>
    </>
  )
}

function CopyModal({ trader, onClose }: { trader: Trader; onClose: () => void }) {
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState<'amount' | 'protect' | 'done'>('amount')
  const [amount, setAmount] = useState('100')
  const [maxLoss, setMaxLoss] = useState('50')
  const [alertThreshold, setAlertThreshold] = useState('25')
  const [autoUnfollow, setAutoUnfollow] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const addr = trader.wallet_address
  const name = trader.username || addr.slice(0, 6) + '...' + addr.slice(-4)

  const handleCopy = async () => {
    if (!isAuthenticated) { setError('Connect wallet first'); return }
    const n = parseFloat(amount)
    if (!n || n <= 0) { setError('Enter a valid amount'); return }
    setLoading(true)
    setError('')
    try {
      const res = await followTrader(trader.user_id, n)
      saveSettings(trader.user_id, {
        leader_id: trader.user_id,
        amount: n,
        maxLoss: parseFloat(maxLoss) || 50,
        alertThreshold: parseFloat(alertThreshold) || 25,
        autoUnfollow,
      })
      setCopiedId(trader.user_id)
      setStep('done')
      setTimeout(onClose, 2000)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) => n > 999 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : n.toFixed(2)
  const pnlUp = trader.total_pnl >= 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-9 h-9 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0"
            >
              {step === 'done' ? <CheckCircle2 size={18} className="text-long" /> : <Copy size={16} />}
            </motion.div>
            <div>
              <p className="text-tx-primary font-bold text-sm">
                {step === 'done' ? 'Copy Activated!' : 'Copy Trade'}
              </p>
              <p className="text-tx-muted text-[11px] font-medium">{name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-tx-muted hover:text-tx-primary p-1 rounded-lg hover:bg-hover transition-colors"
          >
            <X size={16} />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-5 space-y-4"
            >
              {/* Trader stats banner */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-secondary rounded-xl border border-border">
                {[
                  { label: 'Win Rate', value: `${(+trader.win_rate).toFixed(1)}%`, color: +trader.win_rate > 60 ? 'text-long' : 'text-tx-primary' },
                  { label: 'Total PnL', value: `${pnlUp ? '+' : '-'}$${fmt(Math.abs(trader.total_pnl))}`, color: pnlUp ? 'text-long' : 'text-short' },
                  { label: 'Trades', value: String(trader.total_trades), color: 'text-tx-primary' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-tx-muted text-[10px] font-medium">{s.label}</p>
                    <p className={`text-xs font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-tx-muted mb-1.5 block font-medium flex items-center gap-1.5">
                  <span>Copy Amount (USDC)</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                  disabled={loading}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-tx-primary font-mono text-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange/30 transition-colors disabled:opacity-50"
                />
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 500, 1000].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className={clsx(
                      'py-1.5 text-xs font-semibold rounded-lg border transition-colors',
                      parseFloat(amount) === v
                        ? 'bg-orange/10 text-orange border-orange/30'
                        : 'bg-secondary text-tx-muted border-border hover:border-border-l'
                    )}
                  >
                    ${v}
                  </button>
                ))}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-short text-xs bg-short/5 border border-short/20 rounded-lg px-3 py-2 font-medium flex items-center gap-1.5"
                >
                  <AlertTriangle size={12} />
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('protect')}
                disabled={loading || !parseFloat(amount) || parseFloat(amount) <= 0}
                className="w-full py-3 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Shield size={14} />
                Continue — Set Protection
              </motion.button>
            </motion.div>
          )}

          {step === 'protect' && (
            <motion.div
              key="protect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-5 space-y-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sliders size={14} className="text-orange" />
                <p className="text-xs font-bold text-tx-primary uppercase tracking-wider">Protection Settings</p>
              </div>

              {/* Max Loss */}
              <div>
                <label className="text-xs text-tx-muted mb-1.5 block font-medium flex items-center gap-1.5">
                  <TrendingDown size={12} className="text-short" />
                  Max Loss Limit (USDC)
                </label>
                <input
                  type="number"
                  value={maxLoss}
                  onChange={e => setMaxLoss(e.target.value)}
                  min="1"
                  disabled={loading}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-tx-primary font-mono text-sm focus:border-short focus:outline-none focus:ring-1 focus:ring-short/30 transition-colors disabled:opacity-50"
                />
                <p className="text-tx-muted text-[10px] mt-1">
                  Auto-unfollow if trader's PnL drops below this amount
                </p>
              </div>

              {/* Alert threshold */}
              <div>
                <label className="text-xs text-tx-muted mb-1.5 block font-medium flex items-center gap-1.5">
                  <Bell size={12} className="text-yellow" />
                  Alert on Loss (USDC)
                </label>
                <input
                  type="number"
                  value={alertThreshold}
                  onChange={e => setAlertThreshold(e.target.value)}
                  min="1"
                  disabled={loading}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-tx-primary font-mono text-sm focus:border-yellow focus:outline-none focus:ring-1 focus:ring-yellow/30 transition-colors disabled:opacity-50"
                />
                <p className="text-tx-muted text-[10px] mt-1">
                  Get notified when the trader hits this loss level
                </p>
              </div>

              {/* Auto-unfollow toggle */}
              <div className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border">
                <div className="flex items-center gap-2.5">
                  <Shield size={14} className={autoUnfollow ? 'text-long' : 'text-tx-muted'} />
                  <div>
                    <p className="text-xs font-semibold text-tx-primary">Auto-Unfollow on Max Loss</p>
                    <p className="text-[10px] text-tx-muted">Automatically stop copying at max loss</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoUnfollow(!autoUnfollow)}
                  className={clsx(
                    'w-10 h-5 rounded-full transition-colors relative',
                    autoUnfollow ? 'bg-short' : 'bg-border'
                  )}
                >
                  <motion.div
                    animate={{ x: autoUnfollow ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-xl p-3 space-y-1.5 border border-border">
                <p className="text-[10px] text-tx-muted font-semibold uppercase tracking-wider">Summary</p>
                <div className="flex justify-between text-xs">
                  <span className="text-tx-muted">Copy Amount</span>
                  <span className="text-tx-primary font-mono font-semibold">${fmt(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-tx-muted">Max Loss Protection</span>
                  <span className="text-short font-mono font-semibold">${fmt(parseFloat(maxLoss) || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-tx-muted">Alert At</span>
                  <span className="text-yellow font-mono font-semibold">${fmt(parseFloat(alertThreshold) || 0)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-tx-muted">Auto-Unfollow</span>
                  <span className={autoUnfollow ? 'text-long font-semibold' : 'text-tx-muted'}>{autoUnfollow ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-short text-xs bg-short/5 border border-short/20 rounded-lg px-3 py-2 font-medium flex items-center gap-1.5"
                >
                  <AlertTriangle size={12} />
                  {error}
                </motion.p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('amount')}
                  disabled={loading}
                  className="py-3 rounded-xl bg-secondary border border-border text-tx-secondary font-semibold text-sm hover:text-tx-primary transition-all disabled:opacity-40"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  disabled={loading}
                  className="py-3 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {loading ? 'Copying...' : 'Start Copying'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="p-8 flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-long/10 flex items-center justify-center border border-long/20"
              >
                <CheckCircle2 size={28} className="text-long" />
              </motion.div>
              <div className="text-center">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-tx-primary font-bold text-base"
                >
                  Now Copying {name}! 🎯
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-tx-muted text-xs mt-1"
                >
                  ${fmt(parseFloat(amount))} allocated · Max loss ${fmt(parseFloat(maxLoss))}
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-long/5 border border-long/10 rounded-lg"
              >
                <Shield size={12} className="text-long" />
                <span className="text-[10px] text-long font-semibold">
                  {autoUnfollow ? 'Auto-unfollow enabled' : 'Alerts active'}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {step !== 'done' && (
          <div className="px-5 pb-4">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                animate={{ width: step === 'amount' ? '50%' : '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full rounded-full bg-orange"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className={clsx('text-[10px] font-medium', step === 'amount' ? 'text-orange' : 'text-tx-muted')}>Amount</span>
              <span className={clsx('text-[10px] font-medium', step === 'protect' ? 'text-orange' : 'text-tx-muted')}>Protection</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
