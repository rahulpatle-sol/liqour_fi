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
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 320 } },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.15 } },
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 selection:bg-blue-100"
    >
      {/* Premium light-SaaS blur backdrop */}
      <motion.div
        variants={backdrop}
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        variants={modal}
        className="relative w-full max-w-[380px] z-10"
      >
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center relative overflow-hidden shrink-0">
                <Zap size={15} className="text-[#0052FF]" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm tracking-tight">Connect to Liqour</p>
                <p className="text-gray-400 text-[11px] font-medium">Solana Wallet Required</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Choose Wallet */}
            {step === 'choose' && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-4 space-y-1.5"
              >
                {WALLETS.map((w, i) => (
                  <motion.button
                    key={w.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 120 }}
                    whileHover={{ scale: 1.005, borderColor: '#DEE2E6', backgroundColor: '#F8F9FA' }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => handleWallet(w.name)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-white border border-gray-100/80 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0"
                      style={{ background: w.color + '10', border: `1px solid ${w.color}20` }}>
                      {w.emoji}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-gray-900 font-bold text-xs tracking-tight group-hover:text-[#0052FF] transition-colors">{w.name}</p>
                      <p className="text-gray-400 text-[11px] font-medium mt-0.5">{w.desc}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-[#0052FF] group-hover:translate-x-0.5 text-base font-mono transition-all">›</span>
                  </motion.button>
                ))}
                <p className="text-center text-[11px] text-gray-400 pt-2 font-medium">
                  Don&apos;t have a wallet?{' '}
                  <a href="https://phantom.app" target="_blank" rel="noopener font-semibold" className="text-[#0052FF] hover:underline">
                    Get Phantom →
                  </a>
                </p>
              </motion.div>
            )}

            {/* Step 2 & 3: Connecting / Signing */}
            {(step === 'connecting' || step === 'signing') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-8 flex flex-col items-center gap-5"
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-[#0052FF]"
                    style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-3 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                    <motion.span 
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-2xl select-none"
                    >
                      {step === 'signing' ? <ShieldCheck size={24} className="text-[#0052FF]" /> : (WALLETS.find(w => w.name === chosen)?.emoji || '👻')}
                    </motion.span>
                  </div>
                </div>
                
                <div className="text-center space-y-1.5">
                  <h4 className="text-gray-900 font-bold text-sm tracking-tight">
                    {step === 'connecting' ? `Opening ${chosen}...` : 'Verify Ownership'}
                  </h4>
                  <p className="text-gray-500 text-[11px] font-medium max-w-[240px] leading-relaxed mx-auto">
                    {step === 'signing'
                      ? 'Please sign the secure cryptographic verification message inside your wallet extension.'
                      : 'Unlock your desktop extension popup and grant connection approval.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-mono font-semibold">
                  <Loader2 size={11} className="animate-spin text-[#0052FF]" />
                  <span>{step === 'connecting' ? 'CONNECTING_NODE' : 'AWAITING_SIG'}</span>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.05 }}
                  className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm"
                >
                  <CheckCircle size={24} className="text-emerald-600" />
                </motion.div>
                <div className="text-center space-y-1">
                  <p className="text-gray-900 font-bold text-sm tracking-tight">Authentication Valid! 🎉</p>
                  <p className="text-emerald-700 text-[11px] font-bold bg-emerald-50 border border-emerald-100/70 px-2.5 py-0.5 rounded-md inline-block">
                    +1000 USDC Mock Liquidity Active
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 5: Error Handlers */}
            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm">
                  <AlertCircle size={22} className="text-rose-600" />
                </div>
                <div className="text-center max-w-[240px]">
                  <p className="text-gray-900 font-bold text-sm tracking-tight">Action Rejected</p>
                  <p className="text-gray-400 text-[11px] font-medium mt-1 leading-relaxed break-words">{error || 'User cancelled authorization or wallet declined.'}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setStep('choose')}
                  className="w-full py-2 rounded-xl bg-[#0052FF] text-white text-xs font-bold hover:bg-[#0045E0] transition-colors shadow-sm shadow-blue-500/10 tracking-wide"
                >
                  Return to List
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Progress Tracker Block */}
          <div className="px-5 pb-4">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{
                  width: step === 'choose' ? '0%' : step === 'connecting' ? '35%' : step === 'signing' ? '70%' : '100%',
                  backgroundColor: step === 'error' ? '#DC2626' : step === 'done' ? '#059669' : '#0052FF',
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}