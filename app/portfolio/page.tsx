'use client'
import { useEffect, useState, useCallback } from 'react'
import { getPositions, getHistory, getFollowing } from '@/lib/api'
import type { PositionWithPnl, Fill, FollowRow } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useWallet } from '@solana/wallet-adapter-react'
import WalletActions from '@/components/portfolio/WalletActions'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, TrendingUp, History, Users, AlertTriangle, Shield, Bell } from 'lucide-react'
type Tab='positions'|'history'|'copying'

const STORAGE_KEY = 'liqour_copy_settings'
type CopySettings = { leader_id: string; amount: number; maxLoss: number; alertThreshold: number; autoUnfollow: boolean }
function getSettings(): Record<string, CopySettings> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export default function PortfolioPage() {
  const { isAuthenticated,auth }=useAuth()
  const { publicKey } = useWallet()
  const { subscribe, on } = useWebSocket(auth?.userId)
  const [tab,setTab]=useState<Tab>('positions')
  const [positions,setPositions]=useState<PositionWithPnl[]>([])
  const [balance,setBalance]=useState<{available:number;locked:number}|null>(null)
  const [history,setHistory]=useState<Fill[]>([])
  const [copying,setCopying]=useState<FollowRow[]>([])
  const [totalPnl,setTotalPnl]=useState(0)
  const [copyAlerts, setCopyAlerts] = useState<Record<string, string>>({})
  const fetchAll = useCallback(() => {
    if(!isAuthenticated)return
    getPositions().then(d=>{setPositions(d.positions);setBalance(d.balance)}).catch(()=>{})
    getHistory().then(d=>{setHistory(d.history);setTotalPnl(d.history.reduce((s,f)=>s+(+f.pnl),0))}).catch(()=>{})
    getFollowing().then(d=>setCopying(d.following)).catch(()=>{})
  }, [isAuthenticated, auth?.token])
  useEffect(() => { fetchAll() }, [fetchAll, publicKey, auth?.token])
  useEffect(() => {
    if (!isAuthenticated) return
    subscribe('positions')
    const u = on('POSITION_UPDATE', () => fetchAll())
    return () => { u() }
  }, [isAuthenticated, publicKey, auth?.token, subscribe, on, fetchAll])

  useEffect(() => {
    const settings = getSettings()
    const alerts: Record<string, string> = {}
    copying.forEach(f => {
      const s = settings[f.leader_id]
      if (!s) return
      const pnl = +f.total_pnl
      if (s.maxLoss > 0 && pnl <= -s.maxLoss) {
        alerts[f.leader_id] = `Max loss hit! PnL: ${fmtShort(pnl)}`
      } else if (s.alertThreshold > 0 && pnl <= -s.alertThreshold) {
        alerts[f.leader_id] = `Alert: PnL dropped to ${fmtShort(pnl)}`
      }
    })
    setCopyAlerts(alerts)
  }, [copying])

  const fmt=(n:number)=>'$'+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})
  const fmtShort=(n:number)=>(n>=0?'+':'')+fmt(n)
  const totalUnrealized=positions.reduce((s,p)=>s+(+p.unrealized_pnl),0)
  if(!isAuthenticated) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Briefcase size={48} className="text-tx-muted opacity-20"/><p className="text-tx-secondary">Connect wallet to view portfolio</p></div>
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mt-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3"><Briefcase size={22} className="text-orange"/><h1 className="text-2xl font-black text-tx-primary">Portfolio</h1><span className="text-tx-muted text-sm font-mono">{auth.username||auth.walletAddress?.slice(0,8)+'...'}</span></div>
        <WalletActions onUpdate={fetchAll} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[{label:'Available',value:fmt(balance?.available||0),color:'text-tx-primary'},{label:'Margin Used',value:fmt(balance?.locked||0),color:'text-orange'},{label:'Unrealized PnL',value:(totalUnrealized>=0?'+':'')+fmt(totalUnrealized),color:totalUnrealized>=0?'text-long':'text-short'},{label:'Realized PnL',value:(totalPnl>=0?'+':'')+fmt(totalPnl),color:totalPnl>=0?'text-long':'text-short'}].map(s=>(
          <div key={s.label} className="bg-card border border-border rounded-xl p-4"><p className="text-tx-muted text-xs mb-1">{s.label}</p><p className={`text-lg font-black font-mono ${s.color}`}>{s.value}</p></div>
        ))}
      </div>
      <div className="flex border-b border-border mb-6">
        {[{key:'positions' as Tab,label:'Positions',icon:TrendingUp,count:positions.length},{key:'history' as Tab,label:'History',icon:History,count:history.length},{key:'copying' as Tab,label:'Copying',icon:Users,count:copying.length}].map(({key,label,icon:Icon,count})=>(
          <button key={key} onClick={()=>setTab(key)} className={clsx('flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors',tab===key?'border-orange text-tx-primary':'border-transparent text-tx-muted hover:text-tx-secondary')}><Icon size={14}/>{label} <span className="text-tx-muted">({count})</span></button>
        ))}
      </div>
      {tab==='positions'&&(positions.length===0?<div className="text-center py-16 text-tx-muted"><p className="mb-3 text-2xl">📊</p><p>No open positions.</p><Link href="/trade/SOL" className="mt-3 inline-block px-4 py-2 bg-orange text-white rounded-lg text-sm font-semibold">Trade Now</Link></div>:
        <div className="space-y-2">{positions.map(pos=>{
          const posUp = +pos.unrealized_pnl >= 0
          return <motion.div key={pos.position_id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-border-l transition-colors"><div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center font-black text-base',pos.side==='long'?'bg-long/10 text-long':'bg-short/10 text-short')}>{pos.side==='long'?'↑':'↓'}</div><div className="flex-1"><div className="flex items-center gap-2"><span className="text-tx-primary font-bold">{pos.market}/USDC</span><span className={clsx('text-xs px-1.5 py-0.5 rounded font-semibold',pos.side==='long'?'bg-long/10 text-long':'bg-short/10 text-short')}>{pos.side.toUpperCase()} {pos.leverage}×</span></div><div className="flex gap-4 mt-1 text-xs text-tx-muted"><span>Entry: <span className="text-tx-secondary font-mono">${(+pos.entry_price).toFixed(2)}</span></span><span>Mark: <span className="text-tx-secondary font-mono">${(+pos.current_price).toFixed(2)}</span></span><span>Liq: <span className="text-short font-mono">${(+pos.liquidation_price).toFixed(2)}</span></span></div></div><div className="text-right"><motion.p key={pos.unrealized_pnl} animate={{scale:[1,1.05,1]}} className={clsx('font-black font-mono text-lg',posUp?'text-long':'text-short')}>{posUp?'+':''}{fmt(pos.unrealized_pnl)}</motion.p><p className="text-tx-muted text-xs">Margin: {fmt(pos.margin)}</p></div></motion.div>
        })}</div>)}
      {tab==='history'&&(history.length===0?<div className="text-center py-16 text-tx-muted"><p className="text-2xl mb-3">📜</p><p>No trade history yet.</p></div>:
        <div className="bg-card border border-border rounded-xl overflow-hidden"><table className="w-full text-xs"><thead><tr className="border-b border-border">{['Market','Price','Size','PnL','Time'].map(h=><th key={h} className="px-4 py-3 text-left text-tx-muted font-medium">{h}</th>)}</tr></thead><tbody>{history.map(f=><tr key={f.fill_id} className="border-b border-border/50 hover:bg-hover"><td className="px-4 py-2.5 font-bold text-tx-primary">{f.market}</td><td className="px-4 py-2.5 font-mono text-tx-secondary">${(+f.price).toFixed(2)}</td><td className="px-4 py-2.5 font-mono text-tx-secondary">{(+f.qty).toFixed(4)}</td><td className={clsx('px-4 py-2.5 font-bold font-mono',+f.pnl>=0?'text-long':'text-short')}>{+f.pnl>=0?'+':''}{fmt(f.pnl)}</td><td className="px-4 py-2.5 text-tx-muted">{new Date(f.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>)}
      {tab==='copying'&&(copying.length===0?<div className="text-center py-16 text-tx-muted"><p className="text-2xl mb-3">👥</p><p>Not copying anyone yet.</p><Link href="/leaderboard" className="mt-3 inline-block px-4 py-2 bg-orange text-white rounded-lg text-sm font-semibold">Find Traders</Link></div>:
        <div className="space-y-2">{copying.map(f=>{
          const pnl = +f.total_pnl
          const pnlUp = pnl >= 0
          const settings = getSettings()[f.leader_id]
          const alert = copyAlerts[f.leader_id]
          const isMaxLoss = alert?.startsWith('Max loss')
          return <motion.div key={f.follow_id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={clsx('bg-card border rounded-xl p-4 flex items-center gap-4 transition-colors',alert ? 'border-short/30 bg-short/5' : 'border-border hover:border-border-l')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative">
              {alert ? <AlertTriangle size={20} className="text-short animate-pulse" /> : <span className="text-lg">👤</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-tx-primary font-bold truncate">{f.username||f.wallet_address.slice(0,8)+'...'}</p>
                {alert && <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded', isMaxLoss ? 'bg-short/10 text-short' : 'bg-yellow/10 text-yellow')}>{isMaxLoss ? 'MAX LOSS' : 'ALERT'}</span>}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-tx-muted text-xs font-mono">{f.wallet_address.slice(0,16)}...</span>
                {settings && <span className="text-[10px] text-tx-muted flex items-center gap-1"><Shield size={10} />Max loss: ${settings.maxLoss}</span>}
              </div>
              {alert && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-short text-[10px] font-medium mt-1 flex items-center gap-1"><Bell size={10} />{alert}</motion.p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-orange font-bold text-sm">${(+f.copy_amount).toFixed(2)}</p>
              <p className="text-tx-muted text-[10px]">Allocation</p>
            </div>
            <div className="text-right shrink-0">
              <motion.p key={pnl} animate={{scale:[1,1.05,1]}} className={clsx('font-bold font-mono text-sm', pnlUp ? 'text-long' : 'text-short')}>{pnlUp?'+':''}{fmt(pnl)}</motion.p>
              <p className="text-tx-muted text-[10px]">Trader PnL</p>
            </div>
          </motion.div>
        })}</div>)}
    </div>
  )
}
