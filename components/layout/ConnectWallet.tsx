'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react'

type Step = 'choose' | 'connecting' | 'signing' | 'done' | 'error'

const WALLETS = [
  { name: 'Phantom',  emoji: '👻', desc: 'Most popular Solana wallet',  color: '#AB9FF2' },
  { name: 'Backpack', emoji: '🎒', desc: 'xNFT wallet by Coral',        color: '#E33E3F' },
  { name: 'Solflare', emoji: '🔆', desc: 'Non-custodial Solana wallet',  color: '#FC9018' },
]

export default function ConnectWallet({ onClose }: { onClose: () => void }) {
  const { select, wallets, connected } = useWallet()
  const { authenticate, loading, error } = useAuth()
  const [step, setStep] = useState<Step>('choose')
  const [chosen, setChosen] = useState('')

  const doAuth = useCallback(async () => {
    setStep('signing')
    try {
      await authenticate()
      setStep('done')
    } catch {
      setStep('error')
    }
  }, [authenticate])

  // Fires when wallet connects after selection
  useEffect(() => {
    if (connected && step === 'connecting') {
      doAuth()
    }
  }, [connected, step, doAuth])

  // Auto close after done
  useEffect(() => {
    if (step === 'done') {
      const t = setTimeout(onClose, 1400)
      return () => clearTimeout(t)
    }
  }, [step, onClose])

  const handleWallet = async (name: string) => {
    setChosen(name)

    // Already connected — skip to signing directly
    if (connected) {
      doAuth()
      return
    }

    const adapter = wallets.find(w => w.adapter.name === name)
    if (adapter) {
      select(adapter.adapter.name as any)
    }
    setStep('connecting')
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-[400px] animate-slide-up">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center">
                <span className="text-lg">🥃</span>
              </div>
              <div>
                <p className="text-tx-primary font-bold text-sm">Connect to Liqour</p>
                <p className="text-tx-muted text-xs">Solana Wallet Required</p>
              </div>
            </div>
            <button onClick={onClose} className="text-tx-muted hover:text-tx-primary transition-colors p-1 hover:bg-hover rounded">
              <X size={18} />
            </button>
          </div>

          {/* Choose wallet */}
          {step === 'choose' && (
            <div className="p-4 space-y-2">
              {WALLETS.map(w => (
                <button key={w.name} onClick={() => handleWallet(w.name)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-secondary border border-border hover:border-ocean/50 hover:bg-hover transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: w.color + '18' }}>{w.emoji}</div>
                  <div className="text-left flex-1">
                    <p className="text-tx-primary font-semibold text-sm">{w.name}</p>
                    <p className="text-tx-muted text-xs">{w.desc}</p>
                  </div>
                  <span className="text-tx-muted group-hover:text-ocean text-lg transition-colors">›</span>
                </button>
              ))}
              <p className="text-center text-xs text-tx-muted pt-2">
                Don't have a wallet?{' '}
                <a href="https://phantom.app" target="_blank" rel="noopener" className="text-ocean hover:underline">
                  Get Phantom →
                </a>
              </p>
            </div>
          )}

          {/* Connecting / Signing */}
          {(step === 'connecting' || step === 'signing') && (
            <div className="p-8 flex flex-col items-center gap-5">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-ocean/20 animate-spin-slow" />
                <div className="absolute inset-1 rounded-full border-2 border-orange/30 animate-spin-slow"
                  style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                  <span className="text-2xl">{WALLETS.find(w => w.name === chosen)?.emoji || '👻'}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-tx-primary font-semibold mb-1">
                  {step === 'connecting' ? `Opening ${chosen}...` : 'Sign the message'}
                </p>
                <p className="text-tx-muted text-xs max-w-[240px]">
                  {step === 'signing'
                    ? 'Check your wallet and approve the sign request. This does not cost any gas.'
                    : 'Please unlock your wallet if prompted.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-tx-muted">
                <Loader size={12} className="animate-spin text-orange" />
                <span>{step === 'connecting' ? 'Connecting...' : 'Waiting for signature...'}</span>
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="p-8 flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-long/10 flex items-center justify-center">
                <CheckCircle size={36} className="text-long" />
              </div>
              <div className="text-center">
                <p className="text-tx-primary font-bold text-lg">Connected! 🎉</p>
                <p className="text-tx-muted text-sm mt-1">1000 USDC paper money credited</p>
              </div>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-short/10 flex items-center justify-center">
                <AlertCircle size={28} className="text-short" />
              </div>
              <div className="text-center">
                <p className="text-tx-primary font-semibold">Connection failed</p>
                <p className="text-tx-muted text-xs mt-1">{error || 'Please try again'}</p>
              </div>
              <button onClick={() => setStep('choose')}
                className="px-5 py-2 rounded-lg bg-orange text-white text-sm font-semibold hover:bg-orange/90 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div className="px-5 pb-4">
            <div className="h-0.5 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${
                step === 'choose'      ? 'w-0' :
                step === 'connecting'  ? 'w-1/3 bg-orange' :
                step === 'signing'     ? 'w-2/3 bg-ocean' :
                step === 'done'        ? 'w-full bg-long' :
                                         'w-full bg-short'
              }`}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}