import { createContext, useContext, useEffect, useState } from 'react'
import { WalletBook } from './constant/wallet-book'
import { WalletItem } from './types/wallet-item.class'
import UniversalProvider, { UniversalProviderOpts } from '@walletconnect/universal-provider'
import { EIP6963Detect } from './utils/eip6963-detect'
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import accountApi from './api/account.api'

const walletConnectConfig: UniversalProviderOpts = {
  projectId: '7a4434fefbcc9af474fb5c995e47d286',
  metadata: {
    name: 'codatta',
    description: 'codatta',
    url: 'https://codatta.io/',
    icons: ['https://avatars.githubusercontent.com/u/171659315'],
  },
}

export const coinbaseWallet = createCoinbaseWalletSDK({
  appName: 'codatta',
  appLogoUrl: 'https://avatars.githubusercontent.com/u/171659315'
})

// interface CodattaConnectConfig {
//   apiBaseUrl?: string,
//   channel: string,
//   device: TDeviceType
//   app: string,
//   inviderCode: string,
//   relateInfo?: Object
// }

interface CodattaConnectContext {
  initialized: boolean
  wallets: WalletItem[]
  featuredWallets: WalletItem[]
  lastUsedWallet: WalletItem | null
  saveLastUsedWallet: (wallet: WalletItem) => void
}

const CodattaSigninContext = createContext<CodattaConnectContext>({
  saveLastUsedWallet: () => { },
  lastUsedWallet: null,
  wallets: [],
  initialized: false,
  featuredWallets: []
})

export function useCodattaConnectContext() {
  return useContext(CodattaSigninContext)
}

interface CodattaConnectContextProviderProps {
  children: React.ReactNode
  apiBaseUrl?: string
}


interface LastUsedWalletInfo {
  provider: 'UniversalProvider' | 'EIP1193Provider',
  key: string,
  timestamp: number
}

export function CodattaConnectContextProvider(props: CodattaConnectContextProviderProps) {
  const { apiBaseUrl } = props
  const [wallets, setWallets] = useState<WalletItem[]>([])
  const [featuredWallets, setFeaturedWallets] = useState<WalletItem[]>([])
  const [lastUsedWallet, setLastUsedWallet] = useState<WalletItem | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  const saveLastUsedWallet = (wallet: WalletItem) => {
    setLastUsedWallet(wallet)

    const providerType = wallet.provider instanceof UniversalProvider ? 'UniversalProvider' : 'EIP1193Provider'
    const lastUsedInfo: LastUsedWalletInfo = {
      provider: providerType,
      key: wallet.key,
      timestamp: Date.now()
    }
    localStorage.setItem('xn-last-used-info', JSON.stringify(lastUsedInfo))
  }

  function sortWallet(wallets: WalletItem[]) {
    const featuredWallets = wallets.filter((item) => item.featured || item.installed)
    const restWallets = wallets.filter((item) => !item.featured && !item.installed)
    const sortedWallets = [...featuredWallets, ...restWallets]
    setWallets(sortedWallets)
    setFeaturedWallets(featuredWallets)
  }

  async function init() {
    const wallets: WalletItem[] = []
    const walletMap = new Map<string, WalletItem>()

    WalletBook.forEach((item) => {
      const walletItem = new WalletItem(item)
      if (item.name === 'Coinbase Wallet') {
        walletItem.EIP6963Detected({
          info: { name: 'Coinbase Wallet', uuid: 'coinbase', icon: item.image, rdns: 'coinbase' },
          provider: coinbaseWallet.getProvider() as any
        })
      }
      walletMap.set(walletItem.key, walletItem)
      wallets.push(walletItem)
    })

    // detect EIP6963 providers, and update WalletItem list
    const eip6963Providers = await EIP6963Detect()
    eip6963Providers.forEach((detail) => {
      const walletItem = walletMap.get(detail.info.name)
      if (walletItem) {
        walletItem.EIP6963Detected(detail)
      } else {
        const walletItem = new WalletItem(detail)
        walletMap.set(walletItem.key, walletItem)
        wallets.push(walletItem)
      }
      console.log(detail)
    })

    // handle last used wallet info and restore walletconnect UniveralProvider
    try {
      const lastUsedInfo = JSON.parse(localStorage.getItem('xn-last-used-info') || '{}') as LastUsedWalletInfo
      const lastUsedWallet = walletMap.get(lastUsedInfo.key)
      if (lastUsedWallet) {
        lastUsedWallet.lastUsed = true
        
        // Restore provider based on the saved provider type
        if (lastUsedInfo.provider === 'UniversalProvider') {
          const provider = await UniversalProvider.init(walletConnectConfig)
          if (provider.session) {
            lastUsedWallet.setUniversalProvider(provider)
            console.log('Restored UniversalProvider for wallet:', lastUsedWallet.key)
          }
        } else if (lastUsedInfo.provider === 'EIP1193Provider' && lastUsedWallet.installed) {
          // For EIP1193 providers, if the wallet is installed, it should already have the provider
          // from the EIP6963 detection process above
          console.log('Using detected EIP1193Provider for wallet:', lastUsedWallet.key)
        }
        
        setLastUsedWallet(lastUsedWallet)
      }
    } catch (err) {
      console.log(err)
    }

    // sort wallets by featured, installed, and rest
    sortWallet(wallets)

    // set initialized to true
    setInitialized(true)
  }

  useEffect(() => {
    init()
    accountApi.setApiBase(apiBaseUrl)
  }, [])

  return (
    <CodattaSigninContext.Provider
      value={{
        saveLastUsedWallet,
        wallets,
        initialized,
        lastUsedWallet,
        featuredWallets
      }}
    >
      {props.children}
    </CodattaSigninContext.Provider>
  )
}
