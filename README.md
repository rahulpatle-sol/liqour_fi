# Liqour — Social Perpetuals on Solana

The first social copy-trading perpetuals DEX built on Solana. Follow top traders and automatically mirror their positions — all non-custodial.

## 🏗 Architecture

```
liqour-frontend/
├── app/                    # Next.js 14 App Router pages
│   ├── layout.tsx          # Root layout — wallet provider, navbar, fonts
│   ├── page.tsx            # Landing page — market cards, hero, features
│   ├── globals.css         # Tailwind + custom CSS (scrollbar, animations)
│   ├── leaderboard/        # Top traders leaderboard
│   ├── portfolio/          # User positions, history, copy list
│   └── trade/[market]/     # Trading page — chart, orderbook, form, positions
├── components/
│   ├── layout/             # Navbar, ConnectWallet modal
│   ├── leaderboard/        # TraderCard + CopyModal
│   ├── providers/          # Solana WalletProvider (Phantom)
│   └── trade/              # TradingChart, OrderBook, OrderForm, PositionsTable, RecentTrades
├── hooks/
│   ├── useAuth.ts          # Wallet auth — nonce/sign/login flow
│   └── useWebSocket.ts     # WebSocket connection with auto-reconnect + pub/sub
├── lib/
│   └── api.ts              # REST client + all API types
├── types/
│   └── bs58.d.ts           # Type declarations for bs58
└── public/
    ├── favicon.svg         # SVG favicon
    └── icon.svg            # Apple touch icon
```

## ⚡ Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Charts | lightweight-charts v4 |
| State | Zustand + SWR |
| Wallet | @solana/wallet-adapter (Phantom, Backpack) |
| WebSocket | Custom hook with auto-reconnect |

## 🎨 Design System

Binance-inspired dark theme:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0B0E11` | Page background |
| `--bg-secondary` | `#161A1E` | Cards, panels |
| `--bg-card` | `#1E2329` | Elevated surfaces |
| `--bg-hover` | `#252A2F` | Hover states |
| `--border` | `#2B3139` | Borders |
| `--text-primary` | `#EAECEF` | Primary text |
| `--text-secondary` | `#848E9C` | Secondary text |
| `--text-muted` | `#5E6673` | Muted text |
| `--long` | `#0ECB81` | Buy / long |
| `--short` | `#F6465D` | Sell / short |
| `--orange` | `#FF8A57` | Accent / CTAs |
| `--yellow` | `#F0B90B` | Binance-style highlight |

## 🔌 API Endpoints

All REST endpoints are consumed via `lib/api.ts` with auto-injected JWT:

- `GET /auth/nonce?wallet=...` — Get sign-in nonce
- `POST /auth/login` — Verify signature, get JWT
- `GET /markets` — List all markets
- `GET /markets/:m` — Market detail + orderbook snapshot
- `GET /markets/:m/candles?limit=&tf=` — OHLCV candles
- `GET /markets/:m/trades` — Recent trades
- `POST /orders` — Place market/limit order
- `DELETE /orders/:id` — Cancel order
- `GET /orders` — List user orders
- `GET /positions` — Open positions + balance
- `GET /positions/history` — Trade history
- `GET /leaderboard?sort=&limit=` — Top traders
- `POST /follow` — Start copy-trading
- `DELETE /follow/:id` — Stop copy-trading

WebSocket events: `PRICE_UPDATE`, `ORDERBOOK_UPDATE`, `POSITION_UPDATE`, `FILL`

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env.local

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔑 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | REST API base URL |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:3000/ws` | WebSocket URL |

## 📦 Key Features

- **Copy Trading** — Automatically mirror top traders proportionally
- **Live Charts** — Real-time candlesticks via lightweight-charts with Pyth oracle price streaming
- **Order Book** — Real-time orderbook depth visualization
- **Multi-Timeframe** — 1m, 5m, 15m, 1h, 4h, 1d chart resolutions
- **Leverage Trading** — Up to 50× leverage with liquidation price calculator
- **Non-Custodial** — Connect Phantom/Backpack, sign messages, no funds at risk
- **Leaderboard** — Top traders ranked by PnL, win rate, volume, followers

## 🐛 Known Issues

- TypeScript `strict: true` may require additional type narrowing in some components
- WebSocket reconnection resets subscription state on the backend side
