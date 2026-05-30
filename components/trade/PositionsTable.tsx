'use client'
import { useEffect, useState } from 'react'
import { getPositions, getOrders, cancelOrder } from '@/lib/api'
import type { PositionWithPnl, Order } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuth } from '@/hooks/useAuth'
import clsx from 'clsx'

type Tab = 'positions'|'orders'|'history'

export default function PositionsTable() {
  const { isAuthenticated, auth } = useAuth()
  const [tab, setTab] = useState<Tab>('positions')
  const [positions, setPositions] = useState<PositionWithPnl[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [balance, setBalance] = useState<{available:number;locked:number}|null>(null)
  const { subscribe, on } = useWebSocket(auth?.userId)

  const load = async () => {
    if (!isAuthenticated) return
    const [p, o] = await Promise.all([getPositions(), getOrders('open')])
    setPositions(p.positions); setOrders(o.orders); setBalance(p.balance)
  }

  useEffect(() => { load() }, [isAuthenticated])

  useEffect(() => {
    subscribe('positions')
    const u = on('POSITION_UPDATE', () => load())
    return u
  }, [isAuthenticated, subscribe, on])

  const fmtP = (n: number) => n > 999 ? '$' + n.toLocaleString('en-US',{maximumFractionDigits:2}) : '$' + n.toFixed(4)

  return (
    <div className="flex flex-col h-full bg-secondary border-t border-border overflow-hidden">
      {/* Tabs + balance */}
      <div className="flex items-center border-b border-border shrink-0 px-2">
        {(['positions','orders'] as Tab[]).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={clsx('px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors',
              tab===t?'border-orange text-tx-primary':'border-transparent text-tx-muted hover:text-tx-secondary')}>
            {t} ({t==='positions'?positions.length:orders.length})
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
          : <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-secondary border-b border-border">
                  <tr>{['Market','Side','Size','Entry Price','Mark Price','Liq. Price','PnL','Margin'].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-tx-muted font-medium whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {positions.map(pos=>(
                    <tr key={pos.position_id} className="border-b border-border/50 hover:bg-hover">
                      <td className="px-4 py-2.5 font-bold text-tx-primary">{pos.market}</td>
                      <td className={clsx('px-4 py-2.5 font-semibold uppercase',pos.side==='long'?'text-long':'text-short')}>
                        {pos.side} {pos.leverage}×
                      </td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{(+pos.qty).toFixed(4)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-secondary">{fmtP(pos.entry_price)}</td>
                      <td className="px-4 py-2.5 font-mono text-tx-primary">{fmtP(pos.current_price)}</td>
                      <td className="px-4 py-2.5 font-mono text-short">{fmtP(pos.liquidation_price)}</td>
                      <td className={clsx('px-4 py-2.5 font-bold font-mono',pos.unrealized_pnl>=0?'text-long':'text-short')}>
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
          : <div className="overflow-x-auto flex-1">
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
                        <button onClick={()=>cancelOrder(o.order_id).then(load)}
                          className="text-tx-muted hover:text-short text-xs transition-colors">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      )}
    </div>
  )
}
