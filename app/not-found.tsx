'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Compass, BarChart3 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#0052FF06_1px,transparent_1px)] [background-size:24px_24px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full border border-blue-100/30"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -left-32 w-48 h-48 rounded-full border border-indigo-100/30"
      />

      <div className="relative z-10 text-center max-w-md">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 120 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-2 text-7xl font-black">
            <motion.span
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[#0052FF]"
            >
              4
            </motion.span>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center"
            >
              <Compass size={28} className="text-[#0052FF]" />
            </motion.div>
            <motion.span
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="text-[#0052FF]"
            >
              4
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            This page doesn&apos;t exist or has been moved.
            The markets are still running though.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052FF] text-white text-sm font-bold hover:bg-[#0045E0] transition-colors shadow-lg shadow-blue-500/20"
          >
            <Home size={14} /> Go Home
          </Link>
          <Link
            href="/trade/SOL"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:border-gray-300 transition-colors"
          >
            <BarChart3 size={14} /> Start Trading
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-300 text-xs mt-8 font-mono"
        >
          ERROR_404: ROUTE_NOT_FOUND
        </motion.p>
      </div>
    </div>
  )
}


