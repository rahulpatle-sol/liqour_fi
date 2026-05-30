'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader, CheckCircle, AlertCircle, Zap } from 'lucide-react'

type Step = 'choose' | 'connecting' | 'signing' | 'done' | 'error'

const WALLETS = [
  { name: 'Phantom',  emoji: '👻', desc: 'Most popular Solana wallet',  color: '#AB9FF2' },
  { name: 'Backpack', emoji: '🎒', desc: 'xNFT wallet by Coral',        color: '#E33E3F' },
  { name: 'Solflare', emoji: '🔆', desc: 'Non-custodial Solana wallet',  color: '#FC9018' },
]

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modal = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.15 } },
}

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

  useEffect(() => {
    if (connected && step === 'connecting') doAuth()
  }, [connected, step, doAuth])

  useEffect(() => {
    if (step === 'done') {
      const t = setTimeout(onClose, 1400)
      return () => clearTimeout(t)
    }
  }, [step, onClose])

  const handleWallet = async (name: string) => {
    setChosen(name)
    if (connected) { doAuth(); return }
    const adapter = wallets.find(w => w.adapter.name === name)
    if (adapter) select(adapter.adapter.name as any)
    setStep('connecting')
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        variants={backdrop}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div
        variants={modal}
        className="relative w-full max-w-[400px]"
      >
        <div className="bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-[#0052FF]/5">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center">
                <Zap size={18} className="text-[#0052FF]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Connect to Liqour</p>
                <p className="text-white/30 text-xs">Solana Wallet Required</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/30 hover:text-white p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {/* Choose wallet */}
            {step === 'choose' && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 space-y-2"
              >
                {WALLETS.map((w, i) => (
                  <motion.button
                    key={w.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(0,82,255,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWallet(w.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                      style={{ background: w.color + '15' }}>
                      {w.emoji}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-semibold text-sm">{w.name}</p>
                      <p className="text-white/30 text-xs">{w.desc}</p>
                    </div>
                    <span className="text-white/20 group-hover:text-[#0052FF] text-lg transition-colors">›</span>
                  </motion.button>
                ))}
                <p className="text-center text-xs text-white/20 pt-3">
                  Don&apos;t have a wallet?{' '}
                  <a href="https://phantom.app" target="_blank" rel="noopener" className="text-[#0052FF] hover:underline">
                    Get Phantom →
                  </a>
                </p>
              </motion.div>
            )}

            {/* Connecting / Signing */}
            {(step === 'connecting' || step === 'signing') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 flex flex-col items-center gap-6"
              >
                <div className="relative w-20 h-20">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#0052FF]/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-[#0052FF]/30"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-3 rounded-full bg-black flex items-center justify-center border border-white/10">
                    <span className="text-2xl">{WALLETS.find(w => w.name === chosen)?.emoji || '👻'}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold mb-1">
                    {step === 'connecting' ? `Opening ${chosen}...` : 'Sign the message'}
                  </p>
                  <p className="text-white/30 text-xs max-w-[240px]">
                    {step === 'signing'
                      ? 'Check your wallet and approve the sign request. This does not cost any gas.'
                      : 'Please unlock your wallet if prompted.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Loader size={12} className="animate-spin text-[#0052FF]" />
                  <span>{step === 'connecting' ? 'Connecting...' : 'Waiting for signature...'}</span>
                </div>
              </motion.div>
            )}

            {/* Done */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 flex flex-col items-center gap-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-[#0ECB81]/10 flex items-center justify-center"
                >
                  <CheckCircle size={36} className="text-[#0ECB81]" />
                </motion.div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Connected! 🎉</p>
                  <p className="text-white/40 text-sm mt-1">1000 USDC paper money credited</p>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full bg-[#F6465D]/10 flex items-center justify-center">
                  <AlertCircle size={28} className="text-[#F6465D]" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">Connection failed</p>
                  <p className="text-white/30 text-xs mt-1">{error || 'Please try again'}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('choose')}
                  className="px-6 py-2.5 rounded-xl bg-[#0052FF] text-white text-sm font-semibold hover:bg-[#0045E0] transition-colors shadow-[0_0_20px_rgba(0,82,255,0.25)]"
                >
                  Try Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="px-6 pb-5">
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{
                  width: step === 'choose' ? '0%' : step === 'connecting' ? '33%' : step === 'signing' ? '66%' : step === 'done' ? '100%' : '100%',
                  backgroundColor: step === 'error' ? '#F6465D' : '#0052FF',
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
