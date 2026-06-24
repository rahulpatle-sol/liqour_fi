'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, AlertTriangle, Scale, FileText, ArrowRight } from 'lucide-react'
import Footer from '@/components/layout/Footer'

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="mb-10 last:mb-0"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">{title}</h2>
      <div className="text-gray-500 text-sm leading-relaxed space-y-3">{children}</div>
    </motion.div>
  )
}

export default function TermsPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-4"
          >
            <Scale size={12} /> Legal
          </motion.span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Terms of Use</h1>
          <p className="text-gray-400 text-sm">Last updated: June 2024</p>
        </motion.div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-sm"
        >
          <Section title="1. Acceptance of Terms" delay={0.1}>
            <p>By accessing or using Liqour (&ldquo;the Protocol&rdquo;), you agree to be bound by these Terms of Use. If you do not agree, do not use the Protocol.</p>
            <p>These terms constitute a binding agreement between you (&ldquo;User&rdquo;) and Liqour Protocol Inc. (&ldquo;Company&rdquo;).</p>
          </Section>

          <Section title="2. Eligibility" delay={0.15}>
            <p>You must be at least 18 years old and legally capable of entering into contracts. Use of the Protocol is void where prohibited by applicable law.</p>
            <p>Users from sanctioned jurisdictions or OFAC-listed entities are strictly prohibited from accessing the Protocol.</p>
          </Section>

          <Section title="3. Risks" delay={0.2}>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-800 font-semibold text-sm mb-1">High-Risk Warning</p>
                <p className="text-rose-600 text-xs">Perpetual futures trading carries substantial risk including total loss of capital. Leverage amplifies both gains and losses. Past performance does not guarantee future results.</p>
              </div>
            </div>
            <p className="mt-3">You acknowledge that cryptocurrency markets are volatile and that trading perpetuals involves risk of liquidation.</p>
          </Section>

          <Section title="4. Non-Custodial" delay={0.25}>
            <p>Liqour is a non-custodial protocol. You retain full control of your wallet and assets at all times. Smart contract interactions are executed directly from your wallet.</p>
            <p>The Company never holds, stores, or has access to your private keys or funds.</p>
          </Section>

          <Section title="5. Copy Trading" delay={0.3}>
            <p>Copy trading mirrors positions of followed traders. The Company does not guarantee the performance of any trader. Past returns are not indicative of future results.</p>
            <p>You acknowledge that copy trading may result in losses proportional to the followed trader&apos;s positions.</p>
          </Section>

          <Section title="6. Limitation of Liability" delay={0.35}>
            <p>The Protocol is provided &ldquo;as is&rdquo; without warranties of any kind. The Company shall not be liable for any losses, damages, or claims arising from use of the Protocol.</p>
            <p>Total liability is limited to the amount of fees paid by you in the preceding 12 months.</p>
          </Section>

          <Section title="7. Changes" delay={0.4}>
            <p>We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance. Material changes will be notified via the Protocol interface.</p>
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-xs">For questions, contact legal@liqour.io</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
