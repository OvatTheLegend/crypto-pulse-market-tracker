"use client";
import { Currency } from "@/types/crypto";
import { createContext, ReactNode, useContext, useState } from "react";

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    setCurrency: (curr: Currency) => void;
    toggleCurrency: () => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export default function CurrencyProvider( {children} : {children: ReactNode} ) {
    const [currency, setCurrency] = useState<Currency>("usd");
    const symbol = currency === "usd" ? "$" : "€";

    function toggleCurrency() {
        setCurrency((prev) => (prev === "usd" ? "eur" : "usd"));
    }

    return (
        <CurrencyContext.Provider
            value={{currency, symbol, setCurrency, toggleCurrency}}
        >
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (!context) {
        throw new Error("useCurrency must be used withing a CurrencyProvider");
    }

    return context;
}

