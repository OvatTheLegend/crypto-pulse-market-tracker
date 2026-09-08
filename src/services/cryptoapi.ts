import { Coin, Currency } from "@/types/crypto";

export async function fetchCoins(currency : Currency = "usd") : Promise<Coin[]> {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false`)
    if (!response.ok) {
        throw new Error(`Failed to fetch crypto data: ${response.statusText}`);
    }
    console.log(response);
    const data: Coin[] = await response.json();
    return data;
}
