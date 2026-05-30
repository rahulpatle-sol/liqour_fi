'use client'
import { useState } from 'react'
import type { Trader } from '@/lib/api'
import { followTrader } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { X, Loader } from 'lucide-react'
import clsx from 'clsx'

export function TraderCard({ trader, rank }: { trader: Trader; rank: number }) {
  const [showCopy, setShowCopy] = useState(false)
  const up = trader.total_pnl >= 0
  const addr = trader.wallet_address
  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 hover:border-border-l transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0',
            rank===1?'bg-yellow/20 text-yellow':rank===2?'bg-tx-secondary/20 text-tx-secondary':rank===3?'bg-orange/20 text-orange':'bg-secondary text-tx-muted')}>
            {rank<=3?['🥇','🥈','🥉'][rank-1]:rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-tx-primary font-bold text-sm truncate">{trader.username||addr.slice(0,6)+'...'+addr.slice(-4)}</p>
            <p className="text-tx-muted text-xs font-mono">{addr.slice(0,8)}...</p>
          </div>
          <div className="text-right shrink-0">
            <p className={clsx('font-black text-sm font-mono',up?'text-long':'text-short')}>{up?'+':''}{trader.total_pnl>=0?'$':'- $'}{Math.abs(trader.total_pnl).toFixed(2)}</p>
            <p className="text-tx-muted text-xs">Total PnL</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{label:'Win Rate',value:`${trader.win_rate}%`},{label:'Trades',value:String(trader.total_trades)},{label:'Followers',value:String(trader.follower_count)}].map(s=>(
            <div key={s.label} className="bg-secondary rounded-lg p-2 text-center">
              <p className="text-tx-muted text-xs mb-0.5">{s.label}</p>
              <p className="text-tx-primary font-bold text-sm">{s.value}</p>
            </div>
          ))}
        </div>
        {trader.open_positions.length>0&&(
          <div className="mb-3 space-y-1">
            {trader.open_positions.slice(0,2).map(pos=>(
              <div key={pos.position_id} className="flex items-center justify-between text-xs bg-secondary rounded px-3 py-1.5">
                <span className="text-tx-secondary">{pos.market} {pos.leverage}×</span>
                <span className={pos.side==='long'?'text-long':'text-short'}>{pos.side.toUpperCase()}</span>
                <span className={+pos.unrealized_pnl>=0?'text-long':'text-short'}>{+pos.unrealized_pnl>=0?'+':''}${Math.abs(+pos.unrealized_pnl).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>setShowCopy(true)}
          className="w-full py-2 rounded-lg border border-orange/30 bg-orange/5 text-orange text-sm font-semibold hover:bg-orange hover:text-white transition-all">
          📋 Copy Trade
        </button>
      </div>
      {showCopy&&<CopyModal trader={trader} onClose={()=>setShowCopy(false)}/>}
    </>
  )
}

function CopyModal({ trader, onClose }: { trader: Trader; onClose: () => void }) {
  const { isAuthenticated }=useAuth()
  const [amount,setAmount]=useState('100')
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)
  const [error,setError]=useState('')
  const handle=async()=>{
    if(!isAuthenticated){setError('Connect wallet first');return}
    const n=parseFloat(amount)
    if(!n||n<=0){setError('Enter valid amount');return}
    setLoading(true)
    try{await followTrader(trader.user_id,n);setDone(true);setTimeout(onClose,1500)}
    catch(e:any){setError(e.message)}finally{setLoading(false)}
  }
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}/>
      <div className="relative w-full max-w-sm animate-slide-up bg-card border border-border rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-tx-primary font-bold">Copy Trade</h3>
          <button onClick={onClose} className="text-tx-muted hover:text-tx-primary p-1 rounded hover:bg-hover"><X size={16}/></button>
        </div>
        <div className="flex items-center gap-3 mb-5 p-3 bg-secondary rounded-xl border border-border">
          <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center text-lg">👤</div>
          <div>
            <p className="text-tx-primary font-semibold text-sm">{trader.username||trader.wallet_address.slice(0,8)+'...'}</p>
            <p className="text-long text-xs">Win Rate: {trader.win_rate}% · {trader.total_trades} trades</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs text-tx-muted mb-1.5 block">Copy Amount (USDC)</label>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-tx-primary font-mono focus:border-ocean focus:outline-none"/>
          <p className="text-xs text-tx-muted mt-1.5">Proportionally mirrors {trader.username||'this trader'}'s positions.</p>
        </div>
        {error&&<p className="text-short text-xs mb-3">{error}</p>}
        {done?<div className="text-center py-2 text-long font-semibold">✅ Now copying!</div>:
          <button onClick={handle} disabled={loading}
            className="w-full py-3 rounded-xl bg-orange text-white font-bold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading&&<Loader size={14} className="animate-spin"/>}Start Copying
          </button>}
      </div>
    </div>
  )
}
