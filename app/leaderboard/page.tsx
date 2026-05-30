'use client'
import { useEffect, useState } from 'react'
import { getLeaderboard, type Trader } from '@/lib/api'
import { TraderCard } from '@/components/leaderboard/TraderCard'
import { Trophy } from 'lucide-react'
import clsx from 'clsx'
const SORTS=[{key:'pnl',label:'Top PnL',icon:'💰'},{key:'winrate',label:'Win Rate',icon:'🎯'},{key:'volume',label:'Volume',icon:'📊'},{key:'followers',label:'Most Copied',icon:'👥'}]
export default function LeaderboardPage() {
  const [traders,setTraders]=useState<Trader[]>([])
  const [sort,setSort]=useState('pnl')
  const [loading,setLoading]=useState(true)
  useEffect(()=>{setLoading(true);getLeaderboard(sort,20).then(d=>{setTraders(d.traders);setLoading(false)})},[sort])
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8"><div className="flex items-center gap-3 mb-2"><Trophy size={24} className="text-yellow"/><h1 className="text-2xl font-black text-tx-primary">Leaderboard</h1></div><p className="text-tx-secondary">Top traders on Liqour. Copy their positions automatically.</p></div>
      <div className="flex gap-2 mb-6 flex-wrap">{SORTS.map(s=><button key={s.key} onClick={()=>setSort(s.key)} className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',sort===s.key?'bg-orange text-white shadow-lg shadow-orange/20':'bg-card border border-border text-tx-secondary hover:border-border-l')}><span>{s.icon}</span>{s.label}</button>)}</div>
      {loading?<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-52 rounded-xl skeleton"/>)}</div>
      :traders.length===0?<div className="text-center py-20 text-tx-muted"><Trophy size={40} className="mx-auto mb-3 opacity-20"/><p>No traders yet. Be the first to trade!</p></div>
      :<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{traders.map((t,i)=><TraderCard key={t.user_id} trader={t} rank={i+1}/>)}</div>}
    </div>
  )
}
