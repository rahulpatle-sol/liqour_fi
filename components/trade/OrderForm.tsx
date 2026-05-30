'use client'
import { useState } from 'react'
import { placeOrder } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { TrendingUp, TrendingDown, Loader, Info } from 'lucide-react'
import clsx from 'clsx'

const LEVERAGES = [1,2,3,5,10,20,50]

export default function OrderForm({ market, price }: { market:string; price:number }) {
  const { isAuthenticated } = useAuth()
  const [side, setSide] = useState<'long'|'short'>('long')
  const [otype, setOtype] = useState<'market'|'limit'>('market')
  const [qty, setQty] = useState('')
  const [lp, setLp] = useState('')
  const [lev, setLev] = useState(10)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{text:string;ok:boolean}|null>(null)

  const effPrice = otype==='market' ? price : parseFloat(lp)||0
  const margin = effPrice>0&&qty ? (effPrice*parseFloat(qty))/lev : 0
  const liqPrice = effPrice>0 ? (side==='long' ? effPrice*(1-1/lev+0.005) : effPrice*(1+1/lev-0.005)) : 0

  const submit = async () => {
    if (!isAuthenticated) { setMsg({text:'Connect wallet first',ok:false}); return }
    if (!qty||parseFloat(qty)<=0) { setMsg({text:'Enter quantity',ok:false}); return }
    if (otype==='limit'&&parseFloat(lp)<=0) { setMsg({text:'Enter limit price',ok:false}); return }
    setLoading(true); setMsg(null)
    try {
      await placeOrder({ market, side, type:otype, qty:parseFloat(qty), ...(otype==='limit'?{price:parseFloat(lp)}:{}), leverage:lev })
      setMsg({text:`${side==='long'?'↑ Long':'↓ Short'} order placed!`,ok:true}); setQty(''); setLp('')
    } catch(e:any) { setMsg({text:e.message,ok:false}) }
    finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-secondary border-l border-border h-full overflow-y-auto">
      {/* Long / Short */}
      <div className="grid grid-cols-2 bg-card rounded-lg p-0.5">
        <button onClick={()=>setSide('long')} className={clsx('py-2 rounded-md text-sm font-bold transition-all',side==='long'?'bg-long text-white':'text-tx-muted hover:text-tx-secondary')}>
          ↑ Long
        </button>
        <button onClick={()=>setSide('short')} className={clsx('py-2 rounded-md text-sm font-bold transition-all',side==='short'?'bg-short text-white':'text-tx-muted hover:text-tx-secondary')}>
          ↓ Short
        </button>
      </div>

      {/* Order type */}
      <div className="flex border border-border rounded-lg overflow-hidden">
        {(['market','limit'] as const).map(t=>(
          <button key={t} onClick={()=>setOtype(t)} className={clsx('flex-1 py-1.5 text-xs font-semibold transition-colors capitalize',otype===t?'bg-hover text-tx-primary':'text-tx-muted hover:text-tx-secondary')}>
            {t}
          </button>
        ))}
      </div>

      {/* Limit price */}
      {otype==='limit'&&(
        <div>
          <label className="text-xs text-tx-muted mb-1 block">Price (USDC)</label>
          <input type="number" value={lp} onChange={e=>setLp(e.target.value)} placeholder={price.toFixed(2)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-tx-primary text-sm font-mono focus:border-ocean focus:outline-none placeholder:text-tx-muted"/>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-xs text-tx-muted mb-1 block">Amount ({market})</label>
        <input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="0.00"
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-tx-primary text-sm font-mono focus:border-ocean focus:outline-none placeholder:text-tx-muted"/>
        <div className="grid grid-cols-4 gap-1 mt-1.5">
          {[25,50,75,100].map(p=>(
            <button key={p} onClick={()=>setQty(String(p/100))} className="py-1 text-xs text-tx-muted hover:text-tx-secondary bg-card rounded transition-colors border border-border hover:border-border-l">
              {p}%
            </button>
          ))}
        </div>
      </div>

      {/* Leverage */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-tx-muted">Leverage</label>
          <span className="text-xs font-bold text-orange">{lev}×</span>
        </div>
        <div className="flex gap-1 mb-2">
          {LEVERAGES.map(l=>(
            <button key={l} onClick={()=>setLev(l)} className={clsx('flex-1 py-1 text-xs rounded transition-colors font-medium',lev===l?'bg-orange/15 text-orange border border-orange/40':'bg-card text-tx-muted border border-border hover:border-border-l')}>
              {l}×
            </button>
          ))}
        </div>
        <input type="range" min="1" max="50" value={lev} onChange={e=>setLev(Number(e.target.value))} />
      </div>

      {/* Summary */}
      {effPrice>0&&qty&&parseFloat(qty)>0&&(
        <div className="bg-card border border-border rounded-xl p-3 space-y-2 text-xs">
          <div className="flex justify-between text-tx-muted">
            <span>Margin Required</span>
            <span className="text-tx-primary font-mono">${margin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-tx-muted">
            <span>Entry Price</span>
            <span className="text-tx-primary font-mono">~${effPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-tx-muted">
            <span>Notional</span>
            <span className="text-tx-primary font-mono">${(effPrice*parseFloat(qty)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-tx-muted">
            <span>Liq. Price</span>
            <span className="text-short font-mono">${liqPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button onClick={submit} disabled={loading||!isAuthenticated}
        className={clsx('w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-auto',
          side==='long'?'bg-long hover:bg-long/90 text-white shadow-lg shadow-long/20':'bg-short hover:bg-short/90 text-white shadow-lg shadow-short/20',
          (!isAuthenticated||loading)&&'opacity-50 cursor-not-allowed')}>
        {loading&&<Loader size={14} className="animate-spin"/>}
        {!isAuthenticated ? 'Connect Wallet' : `${side==='long'?'↑ Buy / Long':'↓ Sell / Short'} ${market}`}
      </button>

      {msg&&<p className={clsx('text-xs text-center',msg.ok?'text-long':'text-short')}>{msg.text}</p>}
    </div>
  )
}
