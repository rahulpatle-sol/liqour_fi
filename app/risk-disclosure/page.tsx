'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, TrendingDown, Skull, Shield, Info, ArrowRight, Bomb, Flame } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

const RISKS = [
  {
    icon: TrendingDown,
    title: 'Liquidation Risk',
    desc: 'Leveraged positions can be fully liquidated if the market moves against you. At 50x leverage, a 2% adverse move results in total loss.',
    severity: 'critical',
  },
  {
    icon: Bomb,
    title: 'Smart Contract Risk',
    desc: 'The Protocol is unaudited software deployed on Solana devnet. Bugs, exploits, or vulnerabilities could result in total loss of funds.',
    severity: 'critical',
  },
  {
    icon: Flame,
    title: 'Market Risk',
    desc: 'Cryptocurrency markets are volatile. Prices can gap, liquidity can dry up, and slippage can exceed expectations during high-volatility events.',
    severity: 'high',
  },
  {
    icon: Skull,
    title: 'Copy Trading Risk',
    desc: 'Following traders does not guarantee profits. The trader you copy may incur significant losses which are mirrored proportionally to your portfolio.',
    severity: 'high',
  },
  {
    icon: Shield,
    title: 'Regulatory Risk',
    desc: 'The regulatory status of perpetual DEXs remains uncertain. Future regulations may affect access, operation, or legality of the Protocol.',
    severity: 'medium',
  },
  {
    icon: AlertTriangle,
    title: 'Technology Risk',
    desc: 'Solana network congestion, validator issues, or RPC failures could delay or prevent trade execution. Oracle price feed disruptions may cause incorrect liquidations.',
    severity: 'medium',
  },
]

function RiskCard({ risk, index }: { risk: typeof RISKS[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const severityColor = risk.severity === 'critical' ? 'text-rose-600 bg-rose-50 border-rose-200' :
    risk.severity === 'high' ? 'text-orange-600 bg-orange-50 border-orange-200' :
    'text-yellow-600 bg-yellow-50 border-yellow-200'
  const badgeColor = risk.severity === 'critical' ? 'bg-rose-500' :
    risk.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ x: 4 }}
      className={`border rounded-xl p-5 transition-all ${severityColor}`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/80"
        >
          <risk.icon size={20} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{risk.title}</h3>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor} text-white`}>
              {risk.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs leading-relaxed opacity-80">{risk.desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-950 via-gray-900 to-orange-950"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ff444408_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto px-6"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-4"
          >
            <AlertTriangle size={12} /> Risk Disclosure
          </motion.span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Understand the Risks</h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Perpetual futures trading carries substantial risk. Please read this entire document before using the Protocol.
            <span className="block text-rose-300 font-semibold mt-2">You could lose all of your capital.</span>
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ArrowRight size={16} className="text-white/30 rotate-90" />
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-rose-50 via-orange-50 to-yellow-50 border border-rose-100 rounded-2xl p-6 mb-10 flex items-start gap-4"
        >
          <AlertTriangle size={24} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-rose-800 font-bold text-sm mb-1">Important Notice</h2>
            <p className="text-rose-700 text-xs leading-relaxed">
              This risk disclosure does not cover all possible risks. You should carefully consider your financial
              situation, risk tolerance, and experience before trading perpetuals. Consult a financial advisor if needed.
              The Protocol is provided for demonstration and paper-trading purposes on Solana devnet.
            </p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {RISKS.map((risk, i) => (
            <RiskCard key={risk.title} risk={risk} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white border border-gray-100 rounded-2xl p-6 text-center"
        >
          <h3 className="text-gray-900 font-bold text-sm mb-2">Trade Responsibly</h3>
          <p className="text-gray-400 text-xs max-w-md mx-auto mb-4">
            Only trade what you can afford to lose. Set stop-losses, manage your leverage, and never risk
            more than you&apos;re willing to lose entirely.
          </p>
          <Link
            href="/trade/SOL"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            I Understand — Start Trading <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
