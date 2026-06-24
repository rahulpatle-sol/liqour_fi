'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getPositions, getOrders, getHistory, cancelOrder, closePosition } from '@/lib/api'
import type { PositionWithPnl, Order, Fill } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuth } from '@/hooks/useAuth'
import { useWallet } from '@solana/wallet-adapter-react'
import { listen } from '@/lib/events'
import clsx from 'clsx'

type Tab = 'positions'|'orders'|'history'

export default function PositionsTable() {
  const { isAuthenticated, auth } = useAuth()
  const { publicKey } = useWallet()
  const [tab, setTab] = useState<Tab>('positions')
  const [positions, setPositions] = useState<PositionWithPnl[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [history, setHistory] = useState<Fill[]>([])
  const [balance, setBalance] = useState<{available:number;locked:number}|null>(null)
  const [flashPnl, setFlashPnl] = useState<string | null>(null)
  const flashTimer = useRef<NodeJS.Timeout>()
  const prevPositionsRef = useRef<PositionWithPnl[]>([])
  const { subscribe, on } = useWebSocket(auth?.userId)

  const load = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const [p, o, h] = await Promise.all([getPositions(), getOrders('open'), getHistory()])
      setPositions(prev => { prevPositionsRef.current = prev; return p.positions })
      setOrders(o.orders); setBalance(p.balance)
      setHistory(h.history)
    } catch {}
  }, [isAuthenticated])

  useEffect(() => { load() }, [isAuthenticated, publicKey, auth?.token])

  useEffect(() => {
    if (!isAuthenticated) return
    subscribe('positions')
    const u = on('POSITION_UPDATE', (d: any) => {
      load()
      if (d?.position_id) {
        setFlashPnl(d.position_id)
        clearTimeout(flashTimer.current)
        flashTimer.current = setTimeout(() => setFlashPnl(null), 1200)
      }
    })
    return () => { u() }
  }, [isAuthenticated, publicKey, auth?.token, subscribe, on, load])

  useEffect(() => {
    const unsub = listen('liqour:order-placed', () => {
      setTimeout(load, 500)
    })
    return unsub
  }, [load])

  const fmtP = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US',{maximumFractionDigits:2}) : '$' + n.toFixed(4)

  return (
    <div className="flex flex-col h-full bg-secondary border-t border-border overflow-hidden">
      {/* Tabs + balance */}
      <div className="flex items-center border-b border-border shrink-0 px-2">
        {(['positions','orders','history'] as Tab[]).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={clsx('px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors',
              tab===t?'border-orange text-tx-primary':'border-transparent text-tx-muted hover:text-tx-secondary')}>
            {t} ({t==='positions'?positions.length:t==='orders'?orders.length:history.length})
          </button>
        ))}
        {balance&&(
          <div className="ml-auto flex items-center gap-3 text-xs text-tx-muted px-3">
            <span>Available: <span className="text-tx-primary font-mono">{fmtP(balance.available)}</span></span>
            <span>Margin: <span className="text-orange font-mono">{fmtP(balance.locked)}</span></span>
          </div>
        )}
      </div>

      {tab==='positions'&&(
        positions.length===0
          ? <div className="flex items-center justify-center flex-1 text-tx-muted text-sm">No open positions</div>
          : <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary border-b border-border">
                  <tr>{['Market','Side','Size','Entry Price','Mark Price','Liq. Price','PnL','Margin',''].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-tx-muted font-medium whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {positions.map(pos => (
                    <tr key={pos.position_id} className={clsx(
                      'border-b border-border/50 hover:bg-hover transition-all duration-500',
                      flashPnl === pos.position_id && (pos.unrealized_pnl >= 0 ? 'animate-flash-green' : 'animate-flash-red')
                    )}>
                      <td className="px-4 py-2.5 font-bold text-tx-primary">{pos.market}</td>
                      <td className={clsx('px-4 py-2.5 font-semibold uppercase',pos.side==='long'?'text-long':'text-short')}>
                        {pos.side} {pos.leverage}×
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => closePosition(pos.market).then(load).catch(()=>{})}
                          className="px-2 py-1 rounded text-xs bg-short/10 text-short hover:bg-short/20 transition-colors"
                        >
                          Close
                        </button>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{(+pos.qty).toFixed(4)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{fmtP(pos.entry_price)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-primary">{fmtP(pos.current_price)}</td>
                      <td className="px-4 py-2.5 font-mono text-short">{fmtP(pos.liquidation_price)}</td>
                      <td className={clsx(
                        'px-4 py-2.5 font-bold font-mono transition-colors duration-300',
                        pos.unrealized_pnl>=0?'text-long':'text-short'
                      )}>
                        {pos.unrealized_pnl>=0?'+':''}{fmtP(pos.unrealized_pnl)}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-tx-muted">{fmtP(pos.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}

      {tab==='orders'&&(
        orders.length===0
          ? <div className="flex items-center justify-center flex-1 text-tx-muted text-sm">No open orders</div>
          : <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary border-b border-border">
                  <tr>{['Market','Type','Side','Price','Amount','Filled','Status',''].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-tx-muted font-medium">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.order_id} className="border-b border-border/50 hover:bg-hover">
                      <td className="px-4 py-2.5 font-bold text-tx-primary">{o.market}</td>
                      <td className="px-4 py-2.5 text-tx-muted capitalize">{o.type}</td>
                      <td className={clsx('px-4 py-2.5 font-semibold capitalize',o.side==='long'?'text-long':'text-short')}>{o.side}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{fmtP(o.price)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{(+o.qty).toFixed(4)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-muted">{(+o.filled_qty).toFixed(4)}</td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded text-xs bg-ocean/10 text-ocean capitalize">{o.status}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={()=>cancelOrder(o.order_id).then(load).catch(()=>{})}
                          className="text-tx-muted hover:text-short text-xs transition-colors">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}

      {tab==='history'&&(
        history.length===0
          ? <div className="flex items-center justify-center flex-1 text-tx-muted text-sm">No trade history</div>
          : <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary border-b border-border">
                  <tr>{['Market','Side','Price','Size','PnL','Time'].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-tx-muted font-medium whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {history.map(f=>(
                    <tr key={f.fill_id} className="border-b border-border/50 hover:bg-hover">
                      <td className="px-4 py-2.5 font-bold text-tx-primary">{f.market}</td>
                      <td className={clsx('px-4 py-2.5 font-semibold capitalize',+f.pnl>=0?'text-long':'text-short')}>
                        {+f.pnl>=0?'BUY':'SELL'}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">${(+f.price).toFixed(2)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{(+f.qty).toFixed(4)}</td>
                      <td className={clsx('px-4 py-2.5 font-bold font-mono',+f.pnl>=0?'text-long':'text-short')}>
                        {+f.pnl>=0?'+':''}{fmtP(f.pnl)}
                      </td>
                      <td className="px-4 py-2.5 text-tx-muted text-[11px]">{new Date(f.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}
    </div>
  )
}
