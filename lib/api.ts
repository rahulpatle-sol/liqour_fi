// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('liqour_token')
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const getNonce = (wallet: string) =>
  req<{ nonce: string; message: string }>(`/auth/nonce?wallet=${wallet}`)

export const login = (body: { wallet_address: string; signature: string; nonce: string }) =>
  req<{ token: string; user_id: string; wallet_address: string; username: string | null; is_new_user: boolean }>(
    '/auth/login', { method: 'POST', body: JSON.stringify(body) }
  )

export const setUsername = (username: string) =>
  req('/auth/username', { method: 'PUT', body: JSON.stringify({ username }) })

// ── Markets ──────────────────────────────────────────────────────────────────
export const getMarkets = () => req<{ markets: Market[] }>('/markets')
export const getMarket  = (m: string) => req<Market & { orderbook: OrderbookSnap }>(`/markets/${m}`)
export const getCandles = (m: string, limit = 200, tf = '1m') => req<{ candles: Candle[] }>(`/markets/${m}/candles?limit=${limit}&tf=${tf}`)
export const getTrades  = (m: string) => req<{ trades: Trade[] }>(`/markets/${m}/trades`)

// ── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder = (body: PlaceOrderBody) =>
  req<{ order: Order }>('/orders', { method: 'POST', body: JSON.stringify(body) })

export const cancelOrder = (id: string) =>
  req('/orders/' + id, { method: 'DELETE' })

export const getOrders = (status?: string) =>
  req<{ orders: Order[] }>('/orders' + (status ? `?status=${status}` : ''))

// ── Positions ─────────────────────────────────────────────────────────────────
export const getPositions = () =>
  req<{ positions: PositionWithPnl[]; balance: Balance }>('/positions')

export const getHistory = () =>
  req<{ history: Fill[] }>('/positions/history')

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const getLeaderboard = (sort = 'pnl', limit = 20) =>
  req<{ traders: Trader[] }>(`/leaderboard?sort=${sort}&limit=${limit}`)

export const getTrader = (id: string) =>
  req<{ trader: Trader; recent_fills: Fill[] }>(`/leaderboard/${id}`)

// ── Follow ────────────────────────────────────────────────────────────────────
export const followTrader = (leader_id: string, copy_amount: number) =>
  req('/follow', { method: 'POST', body: JSON.stringify({ leader_id, copy_amount }) })

export const unfollowTrader = (id: string) =>
  req('/follow/' + id, { method: 'DELETE' })

export const getFollowing = () =>
  req<{ following: FollowRow[] }>('/follow/following')
//  close the trade also 
export const closePosition = (market: string) =>
  req('/positions/close', { method: 'POST', body: JSON.stringify({ market }) })



// ── Types ─────────────────────────────────────────────────────────────────────
export type Market = {
  market: string
  price: number
  h24_high: number
  h24_low: number
  h24_change: number
  h24_volume: number
  last_traded_price: number
  funding_rate: number
  best_bid: number
  best_ask: number
}

export type Candle = {
  open: number; high: number; low: number; close: number
  volume: number; timestamp: number
}

export type Trade = { fill_id: string; market: string; price: number; qty: number; created_at: string }

export type OrderbookSnap = {
  bids: [number, number][]
  asks: [number, number][]
  last_traded_price: number
  index_price: number
}

export type Order = {
  order_id: string; user_id: string; market: string
  side: 'long' | 'short'; type: 'limit' | 'market'
  price: number; qty: number; filled_qty: number
  margin: number; leverage: number; status: string
  is_copy_order: boolean; created_at: string
}

export type PlaceOrderBody = {
  market: string; side: 'long' | 'short'; type: 'limit' | 'market'
  price?: number; qty: number; leverage?: number
}

export type Position = {
  position_id: string; user_id: string; market: string
  side: 'long' | 'short'; qty: number; entry_price: number
  margin: number; leverage: number; liquidation_price: number; opened_at: string
}

export type PositionWithPnl = Position & { unrealized_pnl: number; current_price: number }

export type Balance = { user_id: string; available: number; locked: number }

export type Fill = {
  fill_id: string; market: string; price: number; qty: number
  pnl: number; created_at: string
}

export type Trader = {
  user_id: string; wallet_address: string; username: string | null
  total_pnl: number; win_count: number; total_trades: number
  total_volume: number; follower_count: number; win_rate: number
  open_positions: PositionWithPnl[]
}

export type FollowRow = {
  follow_id: string; leader_id: string; copy_amount: number
  username: string | null; wallet_address: string; total_pnl: number
}
