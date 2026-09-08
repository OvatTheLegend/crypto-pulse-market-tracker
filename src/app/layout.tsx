import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CurrencyProvider from "@/context/CurrencyContext";
import WatchlistProvider from "@/context/WatchlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoPulse | Live Market Tracker",
  description: "Real-time cryptocurrency market tracker and analytics dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100"
      >
        <CurrencyProvider>
          <WatchlistProvider>
            {children}
          </WatchlistProvider>
        </CurrencyProvider>
        
      </body>
    </html>
  );
}
