'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Book, Code, Terminal, Cpu, MessageSquare, ArrowRight, Copy, Check,
  Globe, Zap, Shield, BarChart3, Users, ExternalLink
} from 'lucide-react'
import Footer from '@/components/layout/Footer'

const SECTIONS = [
  {
    id: 'overview',
    icon: Book,
    title: 'Overview',
    content: 'Liqour is a non-custodial social perpetuals exchange on Solana. Users can trade SOL, BTC, ETH with up to 50x leverage and automatically copy top traders.',
  },
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start',
    content: 'Connect a Phantom or Backpack wallet (devnet). Fund with devnet SOL/USDC. Navigate to /trade/{market} to begin trading.',
    code: 'npm install @solana/web3.js\nimport { Connection } from "@solana/web3.js"\n\nconst connection = new Connection("https://api.devnet.solana.com")',
  },
  {
    id: 'api',
    icon: Terminal,
    title: 'REST API',
    content: 'All market data is available via REST endpoints. Authenticate with JWT for order placement.',
    code: 'GET  /markets                    # List all markets\nGET  /markets/{m}               # Market detail + orderbook\nGET  /markets/{m}/candles?tf=1m # OHLCV data\nPOST /orders                    # Place order\nGET  /positions                 # Open positions',
  },
  {
    id: 'websocket',
    icon: Cpu,
    title: 'WebSocket',
    content: 'Real-time data streams for prices, orderbook, fills, and positions.',
    code: 'ws://localhost:3000/ws\n\nSubscribe: { "type": "SUBSCRIBE", "channel": "price:SOL" }\nEvents: PRICE_UPDATE, ORDERBOOK_UPDATE, FILL, POSITION_UPDATE',
  },
  {
    id: 'copy',
    icon: Users,
    title: 'Copy Trading',
    content: 'Follow traders via the leaderboard. Copy amounts are proportionally mirrored. Set max-loss limits and alerts per trader.',
    code: 'POST /follow\nBody: { leader_id, copy_amount }\n\nDELETE /follow/{id}  # Unfollow',
  },
]

function DocSection({ section, index }: { section: typeof SECTIONS[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [copied, setCopied] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 last:mb-0"
    >
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 hover:shadow-sm transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <section.icon size={16} className="text-[#0052FF]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{section.content}</p>
        {(section as any).code && (
          <div className="relative bg-gray-950 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-[10px] font-mono">terminal</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    navigator.clipboard.writeText((section as any).code)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </motion.button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-[11px] font-mono text-gray-300 leading-relaxed whitespace-pre">
                {(section as any).code}
              </code>
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-4"
          >
            <Book size={12} /> Documentation
          </motion.span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Developer Docs</h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">Integrate with Liqour&apos;s REST API and WebSocket streams.</p>
        </motion.div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 text-gray-500 text-xs font-semibold hover:border-[#0052FF] hover:text-[#0052FF] transition-colors"
            >
              <s.icon size={12} />
              {s.title}
            </a>
          ))}
        </motion.div>

        {SECTIONS.map((s, i) => (
          <div key={s.id} id={s.id}>
            <DocSection section={s} index={i} />
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-xs mb-4">Questions? Reach out to the team</p>
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: MessageSquare, label: 'Discord', href: '#' },
              { icon: Book, label: 'GitBook', href: '#' },
              { icon: Globe, label: 'Solana Docs', href: 'https://docs.solana.com' },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-gray-500 text-xs font-semibold hover:border-gray-200 transition-colors"
              >
                <l.icon size={12} /> {l.label} <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
