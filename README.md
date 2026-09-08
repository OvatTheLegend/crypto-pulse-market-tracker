# CryptoPulse // Live Market Tracker & Analytics Dashboard

A sleek, real-time cryptocurrency market tracker and analytics dashboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

##  Features

- ** Live REST API Market Integration (`services/cryptoapi.ts`)**:
  - Live data ingestion from CoinGecko's public market endpoints with clean HTTP error handling (`response.ok`).
  - Fetches top 50 cryptocurrencies ranked by Market Cap, complete with spot prices, 24h trading volumes, circulating market caps, and 24h percentage deltas.

- **⏱ The 3 Essential Async UI States**:
  - **Loading State**: Shimmering pulsing spinner during network requests.
  - **Error State**: Graceful error alert card with an interactive **"Retry"** button on API rate limits or failures.
  - **Data State**: Clean, responsive financial table with positive (`▲ +`) emerald and negative (`▼ -`) rose delta badges.

- ** Global React Contexts (`useContext`)**:
  - **`CurrencyContext`**: Real-time currency switcher (`USD $` vs `EUR €`) broadcasting active currency and symbols across the entire component tree without prop drilling.
  - **`WatchlistContext`**: Global starred/favorite coin registry with instant state updates.

- ** Custom Utility Hooks (`hooks/`)**:
  - **`useDebounce<T>`**: 300ms input query debouncing to guarantee 60fps search performance and eliminate UI lag.
  - *`useLocalStorage<T>`**: SSR-safe browser storage synchronization that preserves user favorites across page reloads without hydration mismatch errors.

- ** In-Memory Analytics & Optimization (`useMemo`)**:
  - **Top 4 Summary Cards**: Live calculated 24h Top Gainer, 24h Total Market Volume, Active Assets count, and Watchlist tally.
  - **Multi-Condition In-Memory Filtering**: Instant search across asset names and ticker symbols with one-click **"All Coins"** vs **"⭐ Watchlist"** tab switching.
  - **Compact Financial Formatter**: Formats massive market numbers into human-readable notation (`$1.54T`, `$28.4B`, `$950M`).

- ** Background Real-Time Polling (`useEffect`)**:
  - Continuous 30-second background price ticker with automated `clearInterval` cleanup to prevent memory leaks and API spam.

---

##  Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Source:** [CoinGecko API](https://www.coingecko.com/en/api)

---

##  Project Architecture

```text
src/
├── app/
│   ├── globals.css               # Global Tailwind CSS styles & dark theme defaults
│   ├── layout.tsx                # Root layout with Currency & Watchlist Context Providers
│   └── page.tsx                  # Main market dashboard, summary cards & data table
├── components/
│   └── Header.tsx                # Sticky top navigation, live status pulse & global controls
├── context/
│   ├── CurrencyContext.tsx       # Global USD / EUR currency switcher & symbol provider
│   └── WatchlistContext.tsx      # Global starred coin registry
├── hooks/
│   ├── useDebounce.ts            # Custom generic debounce hook for input filtering
│   └── useLocalStorage.ts        # SSR-safe custom hook for localStorage synchronization
├── services/
│   └── cryptoapi.ts              # Pure async fetch utility for CoinGecko API
└── types/
    └── crypto.ts                 # TypeScript interfaces for Coin data & Currency types
```

---

##  Getting Started

### Prerequisites
Make sure you have **Node.js 18+** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/crypto-pulse.git
   cd crypto-pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

