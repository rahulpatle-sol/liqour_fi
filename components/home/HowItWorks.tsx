'use client'

export default function HowItWorks() {
  const steps = [
    { step: '01', title: 'Leader Orders Execution', text: 'Pro trader places a long or short leveraged order on the orderbook engine.' },
    { step: '02', title: 'Atomic Cycle Evaluation', text: 'Our specialized single-consumer Rust engine immediately maps active follower configurations.' },
    { step: '03', title: 'Instantaneous Mirroring', text: 'Follower order values scale instantly during the identical lock cycle to nullify entry spreads.' }
  ]

  return (
    <section className="py-24 max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-white mb-2">The Atomic Sync System</h2>
        <p className="text-neutral-400 text-sm">How Liqour keeps your trades perfectly aligned with top traders without delays.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {steps.map((s, idx) => (
          <div key={idx} className="relative bg-neutral-900/20 border border-neutral-900 p-8 rounded-2xl">
            <span className="absolute top-4 right-6 text-5xl font-black text-neutral-800/50 font-mono select-none">{s.step}</span>
            <h3 className="text-lg font-bold text-white mb-3 mt-4 tracking-wide">{s.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}