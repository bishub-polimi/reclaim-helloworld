import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

export const custom = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME!,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_CHAIN_URL!] },
  },
})

export const config = getDefaultConfig({
    appName: 'Demo Web3Hub',
    projectId: 'ec26217c82991ae090f1eae51624159f',
    chains: [custom],
  });