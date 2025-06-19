import React from 'react'
import { CodattaConnectContextProvider } from '../../lib/main'
import { bsc, mainnet } from 'viem/chains'
import { defineChain } from 'viem'

const BSC_CHAIN = defineChain({
  id: 56,
  name: 'BNB Smart Chain Mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed1.bnbchain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BSCScan',
      url: 'https://bscscan.com/',
    },
  },
})

export default function AppLayout(props: { children: React.ReactNode }) {
  return <CodattaConnectContextProvider  chains={[BSC_CHAIN]}>
    <div className='xc-h-screen xc-flex xc-items-center xc-justify-center xc-bg-black'>
      {props.children}
    </div>
  </CodattaConnectContextProvider>
}