'use client'

import { WagmiProvider } from 'wagmi'
import { config } from '../config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '@/components/Header';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import ReclaimSection from '@/components/ReclaimSection';

const queryClient = new QueryClient();


export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <Header />
            <ReclaimSection />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
