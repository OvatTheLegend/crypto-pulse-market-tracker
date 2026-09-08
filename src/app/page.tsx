"use client";
import { fetchCoins } from "@/services/cryptoapi";
import { Coin } from "@/types/crypto";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { useDebounce } from "@/hooks/useDebounce";

// Helper to format large numbers compactly (e.g. $1.25T, $28.4B)
function formatCompactNumber(num: number, symbol: string) {
  if (!num) return `${symbol}0`;
  if (num >= 1e12) return `${symbol}${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${symbol}${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${symbol}${(num / 1e6).toFixed(2)}M`;
  return `${symbol}${num.toLocaleString()}`;
}

export default function CryptoPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {currency, symbol } = useCurrency();
  const {isFavorite, toggleWatchlist, watchlist } = useWatchlist();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTab, setFilterTab] = useState<"all" | "favorites">("all");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // 1. In-memory Filtered Coins
  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesTab = filterTab === "all" ? true : isFavorite(coin.id);

      return matchesSearch && matchesTab;
    });
  }, [coins, debouncedSearch, filterTab, isFavorite]);

  // 2. Summary Stats Calculations
  const topGainer = useMemo(() => {
    if (coins.length === 0) return null;
    return [...coins].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )[0];
  }, [coins]);

  const totalVolume = useMemo(() => {
    return coins.reduce((acc, c) => acc + (c.total_volume || 0), 0);
  }, [coins]);

  // 3. API Load Function
  async function loadCoins() {
    setError(null);
    try {
      const data = await fetchCoins(currency);
      setCoins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  // 4. Polling Lifecycle with 30s background interval & cleanup
  useEffect(() => {
    setIsLoading(true);
    loadCoins();

    const intervalId = setInterval(() => {
      loadCoins();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currency]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              🌐 Tracked Assets
            </p>
            <p className="text-2xl font-bold text-white">
              {coins.length > 0 ? `${coins.length} Coins` : "Loading..."}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Top by Market Cap</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              🚀 Top 24h Gainer
            </p>
            {topGainer ? (
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-white truncate max-w-[140px]">
                  {topGainer.name}
                </p>
                <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +{topGainer.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-zinc-600">---</p>
            )}
            <p className="text-xs text-zinc-500 mt-1">Best performing coin today</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              📊 24h Total Volume
            </p>
            <p className="text-2xl font-bold text-white font-mono">
              {coins.length > 0 ? formatCompactNumber(totalVolume, symbol) : "---"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Total traded across market</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              ⭐ Your Watchlist
            </p>
            <p className="text-2xl font-bold text-amber-300 font-mono">
              {watchlist.length} {watchlist.length === 1 ? "Coin" : "Coins"}
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search by name or symbol (e.g. BTC, Solana)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs font-bold p-1.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setFilterTab("all")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All Coins ({coins.length})
            </button>

            <button
              onClick={() => setFilterTab("favorites")}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                filterTab === "favorites"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>⭐</span> Watchlist ({watchlist.length})
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Fetching live market data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md mx-auto my-12 shadow-2xl">
            <p className="text-rose-400 font-medium mb-4">{error}</p>
            <button
              onClick={loadCoins}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-all cursor-pointer shadow-lg shadow-rose-950 active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {/* Market Table */}
        {!isLoading && !error && (
          <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/90 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                  <tr>
                    <th className="py-4 px-4 w-12 text-center">#</th>
                    <th className="py-4 px-4">Asset</th>
                    <th className="py-4 px-4 text-right">Price</th>
                    <th className="py-4 px-4 text-right">24h Change</th>
                    <th className="py-4 px-4 text-right hidden md:table-cell">24h Volume</th>
                    <th className="py-4 px-4 text-right hidden lg:table-cell">Market Cap</th>
                    <th className="py-4 px-4 text-center w-16">Star</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredCoins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-zinc-500">
                        {filterTab === "favorites"
                          ? "No favorited coins yet. Click the ⭐ icon on any coin to add it to your watchlist!"
                          : `No cryptocurrencies found matching "${searchTerm}"`}
                      </td>
                    </tr>
                  ) : (
                    filteredCoins.map((coin) => {
                      const isPositive = coin.price_change_percentage_24h >= 0;

                      return (
                        <tr
                          key={coin.id}
                          className="hover:bg-zinc-800/40 transition-colors group"
                        >
                          {/* Rank */}
                          <td className="py-4 px-4 text-center font-mono text-zinc-500 text-xs">
                            {coin.market_cap_rank || "•"}
                          </td>

                          {/* Asset Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-8 h-8 rounded-full flex-shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors block">
                                  {coin.name}
                                </span>
                                <span className="text-xs uppercase font-bold text-zinc-400">
                                  {coin.symbol}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 text-right font-mono font-bold text-zinc-100">
                            {symbol}
                            {coin.current_price > 1
                              ? coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : coin.current_price.toLocaleString(undefined, {
                                  minimumFractionDigits: 4,
                                  maximumFractionDigits: 6,
                                })}
                          </td>

                          {/* 24h Change */}
                          <td className="py-4 px-4 text-right">
                            <span
                              className={`inline-flex items-center gap-0.5 font-mono text-xs px-2.5 py-1 rounded-full font-bold ${
                                isPositive
                                  ? "text-emerald-400 bg-emerald-500/10"
                                  : "text-rose-400 bg-rose-500/10"
                              }`}
                            >
                              {isPositive ? "▲ +" : "▼ "}
                              {coin.price_change_percentage_24h?.toFixed(2)}%
                            </span>
                          </td>

                          {/* 24h Volume */}
                          <td className="py-4 px-4 text-right font-mono text-zinc-300 hidden md:table-cell">
                            {formatCompactNumber(coin.total_volume, symbol)}
                          </td>

                          {/* Market Cap */}
                          <td className="py-4 px-4 text-right font-mono text-zinc-300 hidden lg:table-cell">
                            {formatCompactNumber(coin.market_cap, symbol)}
                          </td>

                          {/* Watchlist Star */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleWatchlist(coin.id)}
                              className="text-lg hover:scale-125 transition-transform cursor-pointer p-1"
                              title={
                                isFavorite(coin.id)
                                  ? "Remove from watchlist"
                                  : "Add to watchlist"
                              }
                            >
                              {isFavorite(coin.id) ? "⭐" : "☆"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}