'use client'
import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { depositUSDC } from '@/lib/deposit'
import { verifyDeposit, requestWithdraw } from '@/lib/api'
import { Wallet, ArrowDownToLine, ArrowUpFromLine, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

type Mode = 'deposit' | 'withdraw'

export default function WalletActions({ onUpdate }: { onUpdate?: () => void }) {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('deposit')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const handleSubmit = async () => {
    if (!publicKey || !signTransaction) return
    setLoading(true)
    setStatus('idle')
    try {
      const amt = parseFloat(amount)
      if (isNaN(amt) || amt <= 0) throw new Error('Invalid amount')

      if (mode === 'deposit') {
        const sig = await depositUSDC(connection, { publicKey, signTransaction }, amt)
        await verifyDeposit(sig)
        setMsg(`Deposited ${amt} USDC successfully!`)
      } else {
        const res = await requestWithdraw(amt)
        setMsg(`Withdraw ${amt} USDC submitted! Tx: ${res.tx_signature.slice(0, 8)}...`)
      }
      setStatus('success')
      setAmount('')
      onUpdate?.()
    } catch (e: any) {
      setStatus('error')
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!connected) return null

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg text-sm font-semibold hover:bg-orange/90 transition-colors">
        <Wallet size={14} /> Wallet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button onClick={() => { setMode('deposit'); setStatus('idle') }} className={clsx('px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors', mode === 'deposit' ? 'bg-long/20 text-long' : 'text-tx-muted hover:text-tx-secondary')}>Deposit</button>
                <button onClick={() => { setMode('withdraw'); setStatus('idle') }} className={clsx('px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors', mode === 'withdraw' ? 'bg-short/20 text-short' : 'text-tx-muted hover:text-tx-secondary')}>Withdraw</button>
              </div>
              <button onClick={() => setOpen(false)} className="text-tx-muted hover:text-tx-primary"><X size={18} /></button>
            </div>

            <div className="mb-4">
              <label className="text-xs text-tx-muted block mb-1">Amount (USDC)</label>
              <input type="number" step="0.01" min="0" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-hover border border-border rounded-xl px-4 py-3 text-lg font-mono text-tx-primary outline-none focus:border-orange transition-colors" />
            </div>

            <button onClick={handleSubmit} disabled={loading || !amount}
              className={clsx(
                'w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all',
                mode === 'deposit'
                  ? 'bg-long text-white hover:bg-long/90'
                  : 'bg-short text-white hover:bg-short/90',
                (loading || !amount) && 'opacity-50 cursor-not-allowed'
              )}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : mode === 'deposit' ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
              {loading ? 'Processing...' : mode === 'deposit' ? 'Deposit' : 'Withdraw'}
            </button>

            {status === 'success' && (
              <div className="mt-4 flex items-center gap-2 text-long text-sm bg-long/5 p-3 rounded-xl">
                <CheckCircle size={16} /> {msg}
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 flex items-center gap-2 text-short text-sm bg-short/5 p-3 rounded-xl">
                <AlertCircle size={16} /> {msg}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
