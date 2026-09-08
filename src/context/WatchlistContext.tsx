"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createContext, ReactNode, useContext } from "react";

interface WatchlistContextType {
    watchlist: string[];
    toggleWatchlist: (coinId: string) => void;
    isFavorite: (coinId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export default function WatchlistProvider( {children}: { children: ReactNode} ){
    const [watchlist,setWatchlist] = useLocalStorage<string[]>("cryptopulse_watchlist", []);
    const isFavorite = (coinId : string) => {
        return watchlist.includes(coinId);
    }
    const toggleWatchlist = (coinId: string) => {
        setWatchlist((prev) => prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    )
    }
    return(
        <WatchlistContext.Provider
            value={{watchlist, toggleWatchlist, isFavorite}}
        >
            {children}
        </WatchlistContext.Provider>

    )
}

export function useWatchlist() {
    const watchlist = useContext(WatchlistContext);

    if (!watchlist){
        throw new Error("useWatchlist must be used withing a WatchlistProvider");
    }

    return watchlist;
}