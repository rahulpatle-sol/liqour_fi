'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Cpu, Flame, Twitter, Github, MessageSquare, ExternalLink } from 'lucide-react'

type FooterLink = { label: string; href: string; external?: boolean }

const FOOTER_LINKS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Protocol',
    links: [
      { label: 'Markets',      href: '/trade/SOL' },
      { label: 'Leaderboard',  href: '/leaderboard' },
      { label: 'Portfolio',    href: '/portfolio' },
      { label: 'About',        href: '/about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation',   href: '/docs' },
      { label: 'Solana Explorer', href: 'https://explorer.solana.com', external: true },
      { label: 'System Status',   href: '/status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use',    href: '/terms' },
      { label: 'Privacy Policy',  href: '/privacy' },
      { label: 'Risk Disclosure', href: '/risk-disclosure' },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t border-gray-200/60 mt-auto selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 md:py-14">
        
        {/* Top Grid Layer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 pb-10 border-b border-gray-100">
          
          {/* Brand Presentation Block */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <span className="text-base select-none">🥃</span>
              <span className="font-bold text-[15px] tracking-tight text-gray-900">
                LIQ<span className="text-[#0052FF]">OUR</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-600 text-[9px] font-bold tracking-wider">
                V1.0
              </span>
            </Link>
            <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs">
              Next-generation high-performance non-custodial synthetic perps engine built on Solana. Execute trades with zero friction.
            </p>
            
            {/* Social Channels Row */}
            <div className="flex items-center gap-2 mt-1">
              <a href="#" className="p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all" aria-label="Twitter">
                <Twitter size={14} />
              </a>
              <a href="#" className="p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all" aria-label="Discord">
                <MessageSquare size={14} />
              </a>
              <a href="#" className="p-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all" aria-label="GitHub">
                <Github size={14} />
              </a>
            </div>
          </div>

          {/* Links Directories Column Mapping */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 md:justify-items-end">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="flex flex-col gap-3 min-w-[110px] md:w-full md:max-w-[140px]">
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors group"
                        >
                          {link.label}
                          <ExternalLink size={10} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Compliance & Network Metadata Layer */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Trademark and Compliance Info */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-gray-400 font-medium">
              &copy; {currentYear} Liqour Protocol Inc. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-400/80 max-w-xl leading-relaxed">
              Cryptocurrency trading involves significant risk and is not suitable for every investor. Simulated paper-trading liquidity configuration carries zero real capital weight.
            </p>
          </div>

          {/* Real-time Infrastructure Node Pill */}
          <div className="flex items-center gap-4 shrink-0 sm:self-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/60 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-gray-600 font-mono font-bold tracking-tight">
                SOLANA_DEVNET
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}