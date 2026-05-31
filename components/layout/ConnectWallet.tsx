'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, AlertCircle, Zap, ShieldCheck } from 'lucide-react'

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
      const t = setTimeout(onClose, 1600)
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
        <div className="bg-[#0B0E11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-[#0052FF]/5">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#0052FF]/20 animate-pulse" />
                <Zap size={18} className="text-[#0052FF] relative z-10 animate-pulse" />
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
            {/* Step 1: Choose Wallet */}
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
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 100 }}
                    whileHover={{ scale: 1.01, borderColor: 'rgba(0,82,255,0.4)', backgroundColor: 'rgba(255,255,255,0.04)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleWallet(w.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                      style={{ background: w.color + '15', border: `1px solid ${w.color}25` }}>
                      {w.emoji}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-semibold text-sm group-hover:text-[#4F8EFF] transition-colors">{w.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">{w.desc}</p>
                    </div>
                    <span className="text-white/20 group-hover:text-[#0052FF] group-hover:translate-x-0.5 text-lg font-mono transition-all">›</span>
                  </motion.button>
                ))}
                <p className="text-center text-xs text-white/20 pt-3">
                  Don&apos;t have a wallet?{' '}
                  <a href="https://phantom.app" target="_blank" rel="noopener" className="text-[#0052FF] hover:underline font-medium">
                    Get Phantom →
                  </a>
                </p>
              </motion.div>
            )}

            {/* Step 2 & 3: Connecting / Signing */}
            {(step === 'connecting' || step === 'signing') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-10 flex flex-col items-center gap-6"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  {/* Neon Glow Outer Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#0052FF]/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-[#0052FF]"
                    style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-4 rounded-full bg-[#0F1217] flex items-center justify-center border border-white/10 shadow-2xl">
                    <motion.span 
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-3xl select-none"
                    >
                      {step === 'signing' ? <ShieldCheck size={28} className="text-[#0052FF] animate-pulse" /> : (WALLETS.find(w => w.name === chosen)?.emoji || '👻')}
                    </motion.span>
                  </div>
                </div>
                
                <div className="text-center space-y-1.5">
                  <h4 className="text-white font-bold text-base tracking-tight">
                    {step === 'connecting' ? `Opening ${chosen}...` : 'Verify Ownership'}
                  </h4>
                  <p className="text-white/40 text-xs max-w-[260px] leading-relaxed">
                    {step === 'signing'
                      ? 'Please sign the message in your wallet extension to verify account ownership.'
                      : 'Unlock your extension pop-up and grant application permission.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs text-white/40 font-mono">
                  <Loader2 size={13} className="animate-spin text-[#0052FF]" />
                  <span>{step === 'connecting' ? 'CONNECTING_NODE' : 'AWAITING_SIG'}</span>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success (Done) */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 flex flex-col items-center gap-5"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-[#0ECB81]/15 flex items-center justify-center border border-[#0ECB81]/30 shadow-[0_0_30px_rgba(14,203,129,0.2)]"
                >
                  <CheckCircle size={32} className="text-[#0ECB81]" />
                </motion.div>
                <div className="text-center space-y-1">
                  <p className="text-white font-black text-lg tracking-tight">Authentication Valid! 🎉</p>
                  <p className="text-[#0ECB81] text-xs font-semibold bg-[#0ECB81]/10 px-2.5 py-0.5 rounded-full inline-block">
                    +1000 USDC Mock Liquidity Active
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Error handling */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center gap-5"
              >
                <div className="w-14 h-14 rounded-full bg-[#F6465D]/15 flex items-center justify-center border border-[#F6465D]/30 shadow-[0_0_20px_rgba(246,70,93,0.1)]">
                  <AlertCircle size={26} className="text-[#F6465D]" />
                </div>
                <div className="text-center max-w-[250px]">
                  <p className="text-white font-bold text-sm">Action Rejected</p>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed break-words">{error || 'User cancelled authorization or wallet declined.'}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('choose')}
                  className="w-full py-2.5 rounded-xl bg-[#0052FF] text-white text-xs font-bold hover:bg-[#0045E0] transition-colors shadow-[0_4px_20px_rgba(0,82,255,0.3)] uppercase tracking-wider"
                >
                  Return to List
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Core Progress bar */}
          <div className="px-6 pb-5">
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{
                  width: step === 'choose' ? '0%' : step === 'connecting' ? '35%' : step === 'signing' ? '70%' : '100%',
                  backgroundColor: step === 'error' ? '#F6465D' : step === 'done' ? '#0ECB81' : '#0052FF',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}