'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const SECTIONS = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: 'We collect minimal on-chain data: your wallet address, transaction signatures, and trading activity publicly available on Solana. We do not collect personal identifying information unless voluntarily provided (e.g., username).',
  },
  {
    icon: Database,
    title: 'How We Use Data',
    content: 'Data is used solely to operate the Protocol: execute trades, maintain leaderboards, and provide portfolio tracking. We never sell or rent your data to third parties.',
  },
  {
    icon: Lock,
    title: 'Data Storage & Security',
    content: 'Session tokens are stored locally in your browser. Trading data is stored on-chain (public) and cached off-chain for performance. We use industry-standard encryption for API communications.',
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: 'We use essential cookies for authentication and session management. No third-party tracking cookies are used. Analytics are anonymized and aggregated.',
  },
  {
    icon: Shield,
    title: 'Third-Party Services',
    content: 'We integrate with Solana RPC providers, Pyth oracles, and wallet adapters (Phantom, Backpack). Each service has its own privacy policy governing data handling.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'For privacy inquiries, contact privacy@liqour.io. We respond within 30 days.',
  },
]

function Card({ icon: Icon, title, content, index }: { icon: any; title: string; content: string; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: 5 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all"
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
        >
          <Icon size={18} className="text-[#0052FF]" />
        </motion.div>
        <div>
          <h3 className="text-gray-900 font-bold text-sm mb-2">{title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed">{content}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-4"
          >
            <Shield size={12} /> Privacy
          </motion.span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-blue-200 text-sm">Your data. Your control. Our commitment to transparency.</p>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-xs mb-10 text-center"
        >
          Last updated: June 2024 · This policy explains how Liqour Protocol Inc. handles your information.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((s, i) => (
            <Card key={s.title} {...s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center"
        >
          <Lock size={24} className="text-[#0052FF] mx-auto mb-3" />
          <h3 className="text-gray-900 font-bold text-sm mb-2">You Are in Control</h3>
          <p className="text-gray-500 text-xs max-w-md mx-auto">
            As a non-custodial protocol, we never hold your funds or private keys. Your on-chain data is public by design;
            we simply make it accessible through an intuitive interface.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
