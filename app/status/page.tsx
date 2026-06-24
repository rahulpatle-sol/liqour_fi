'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, BarChart3, Activity, Server, Wifi, Zap, ExternalLink } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const SERVICES = [
  { name: 'REST API', status: 'operational', uptime: '99.9%', latency: '45ms', icon: Server },
  { name: 'WebSocket', status: 'operational', uptime: '99.8%', latency: '12ms', icon: Wifi },
  { name: 'Matching Engine', status: 'operational', uptime: '100%', latency: '<1ms', icon: Zap },
  { name: 'Pyth Oracles', status: 'operational', uptime: '99.9%', latency: '200ms', icon: Activity },
  { name: 'Solana RPC', status: 'degraded', uptime: '98.2%', latency: '350ms', icon: BarChart3 },
]

const INCIDENTS = [
  { date: '2024-06-20', title: 'RPC Latency Spike', status: 'resolved', desc: 'Increased Solana RPC latency due to validator churn. Resolved after 12 minutes.' },
  { date: '2024-06-15', title: 'WebSocket Reconnect Loop', status: 'resolved', desc: 'Connection instability during network upgrade. Fixed with reconnection backoff.' },
]

export default function StatusPage() {
  const operational = SERVICES.filter(s => s.status === 'operational').length

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e08_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4"
          >
            <Activity size={24} className="text-emerald-400" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">System Status</h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />
            <span className="text-emerald-400 text-sm font-semibold">
              {operational} of {SERVICES.length} services operational
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Service cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-12"
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                s.status === 'operational' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'
              }`}>
                <s.icon size={18} className={s.status === 'operational' ? 'text-emerald-600' : 'text-amber-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-bold text-sm">{s.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    s.status === 'operational'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {s.status === 'operational' ? 'Operational' : 'Degraded'}
                  </span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-gray-400 text-xs">Uptime: <span className="text-gray-600 font-semibold">{s.uptime}</span></span>
                  <span className="text-gray-400 text-xs">Latency: <span className="text-gray-600 font-semibold">{s.latency}</span></span>
                </div>
              </div>
              <motion.div
                animate={s.status === 'operational' ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {s.status === 'operational'
                  ? <CheckCircle2 size={18} className="text-emerald-500" />
                  : <AlertCircle size={18} className="text-amber-500 animate-pulse" />
                }
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Uptime overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 mb-12"
        >
          <h2 className="text-gray-900 font-bold text-sm mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-gray-400" /> 30-Day Uptime
          </h2>
          <div className="flex gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const pct = 0.95 + Math.random() * 0.05
              const color = pct > 0.99 ? 'bg-emerald-400' : pct > 0.97 ? 'bg-emerald-300' : 'bg-amber-300'
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: 16 + Math.random() * 24 }}
                  transition={{ delay: 0.4 + i * 0.01 }}
                  className={`flex-1 rounded-sm ${color}`}
                  style={{ opacity: 0.7 + Math.random() * 0.3 }}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>May 25</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-gray-900 font-bold text-sm mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" /> Recent Incidents
          </h2>
          <div className="space-y-3">
            {INCIDENTS.map((inc, i) => (
              <motion.div
                key={inc.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-900 font-bold text-sm">{inc.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {inc.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">{inc.desc}</p>
                <p className="text-gray-300 text-[10px] mt-1">{inc.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
