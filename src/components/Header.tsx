"use client"

import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";

export default function Header() {
    const {currency, symbol, toggleCurrency} = useCurrency();
    const { watchlist } = useWatchlist();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Live Status */}
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        ⚡ CryptoPulse
                    </h1>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live
                    </div>
                </div>

                {/* Controls (Currency + Watchlist Badge) */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleCurrency}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/60 hover:border-zinc-500 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-800 active:scale-95 cursor-pointer shadow-sm"
                    >
                        <span className="text-zinc-400">Currency:</span>
                        <span className="text-white">{currency.toUpperCase()}</span>
                        <span className="text-emerald-400 font-mono">({symbol})</span>
                    </button>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm font-semibold text-amber-300">
                        <span>⭐</span>
                        <span>Watchlist</span>
                        <span className="ml-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded-full text-xs font-mono">
                            {watchlist.length}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}