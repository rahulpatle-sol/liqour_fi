'use client'

interface TickerProps {
  prices: Record<string, number>
}

export default function LiveTicker({ prices }: TickerProps) {
  const mockPairs = [
    { name: 'SOL/USDC', icon: '◎' },
    { name: 'BTC/USDC', icon: '₿' },
    { name: 'ETH/USDC', icon: 'Ξ' },
  ]

  return (
    <div className="w-full py-3 bg-neutral-950/60 border-y border-neutral-900 overflow-hidden backdrop-blur-sm">
      <div className="flex whitespace-nowrap animate-marquee gap-12 raw-marquee">
        {[...Array(4)].map((_, outerIdx) => (
          <div key={outerIdx} className="flex gap-12 items-center text-sm font-mono text-neutral-400">
            {mockPairs.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-neutral-500">{p.icon}</span>
                <span className="font-semibold text-neutral-300">{p.name}</span>
                <span className="text-emerald-400">
                  {prices[p.name.split('/')[0]] ? `$${prices[p.name.split('/')[0]].toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Loading...'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}