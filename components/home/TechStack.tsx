'use client'

export default function TechStack() {
  const techs = [
    { title: 'Rust Runtime', spec: 'Axum 0.7 + Tokio Engine' },
    { title: 'Price Feed Oracles', spec: 'Pyth Network 1s Feeds' },
    { title: 'State Storage', spec: 'PostgreSQL Serverless via Neon' },
    { title: 'Real-Time Engine', spec: 'Persistent Bidirectional WebSockets' }
  ]

  return (
    <section className="py-24 max-w-6xl mx-auto px-4 text-center">
      <div className="mb-14">
        <h2 className="text-2xl font-black text-white mb-2">Production Core Specs</h2>
        <p className="text-neutral-400 text-sm">High-grade core architecture running on real-time asynchronous cycles.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {techs.map((t, i) => (
          <div key={i} className="p-5 border border-neutral-900 bg-neutral-900/10 rounded-xl text-center">
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">{t.title}</p>
            <p className="text-sm font-bold text-neutral-300 font-mono">{t.spec}</p>
          </div>
        ))}
      </div>
    </section>
  )
}