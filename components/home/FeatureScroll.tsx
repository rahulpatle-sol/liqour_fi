'use client'
import { Shield, Zap, Users } from 'lucide-react'

export default function FeatureScroll() {
  const items = [
    { icon: <Users size={24} className="text-orange" />, title: 'Atomic Copy Trading', desc: 'Auto-mirror high-win-rate traders proportionally. Zero lag execution handling built inside our core matching loops.' },
    { icon: <Zap size={24} className="text-sky-400" />, title: 'Sub-Millisecond Engine', desc: 'Engineered entirely in Async Rust via Tokio runtimes. Uses pure BTreeMap memory matching blocks for 100x performance.' },
    { icon: <Shield size={24} className="text-emerald-400" />, title: 'Non-Custodial Sovereignty', desc: 'Your security matters. Connect your hardware or Phantom wallet securely—all authorization signatures use ed25519 cryptos.' },
  ]

  return (
    <section className="py-24 bg-neutral-950/40 border-y border-neutral-900 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white mb-3">Engineered For Ultra Performance</h2>
          <p className="text-neutral-400 text-sm">Combining the high throughput speed of traditional centralized infrastructure with absolute decentralized security protocols.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((f, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-800 mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}