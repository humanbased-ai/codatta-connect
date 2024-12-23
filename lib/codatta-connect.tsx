import { useEffect, useRef, useState } from 'react'
import SigninIndex from './components/signin-index'
import AnimateContainer from './components/animate-container'
import { WalletItem } from './types/wallet-item.class'
import WalletConnectWidget from './components/wallet-connect-widget'
import TonWalletSelect from './components/ton-wallet-select'
import TonConnect, { Wallet, WalletInfoInjectable, WalletInfoRemote } from '@tonconnect/sdk'
import EvmWalletSelect from './components/evm-wallet-select'
import TonWalletConnect from './components/ton-wallet-connect'
import EmailConnectWidget from './components/email-connect-widget'
import { WalletSignInfo } from './components/wallet-connect'
import { WalletClient } from 'viem'

export interface EmvWalletConnectInfo {
  chain_type: 'eip155'
  client: WalletClient,
  connect_info: WalletSignInfo
}

export interface TonWalletConnectInfo {
  chain_type: 'ton'
  client: TonConnect,
  connect_info: Wallet
}

export function CodattaConnect(props: {
  onEvmWalletConnect: (connectInfo:EmvWalletConnectInfo) => Promise<void>
  onTonWalletConnect: (connectInfo:TonWalletConnectInfo) => Promise<void>
  onEmailConnect: (email:string, code:string) => Promise<void>
  config?: {
    showEmailSignIn?: boolean
    showFeaturedWallets?: boolean
    showMoreWallets?: boolean
    showTonConnect?: boolean
  }
}) {
  const { onEvmWalletConnect, onTonWalletConnect, onEmailConnect, config = {
    showEmailSignIn: false,
    showFeaturedWallets: true,
    showMoreWallets: true,
    showTonConnect: true
  } } = props
  const [step, setStep] = useState('')
  const [evmWallet, setEvmWallet] = useState<WalletItem>()
  const [tonWallet, setTonWallet] = useState<WalletInfoRemote | WalletInfoInjectable>()
  const connector = useRef<TonConnect>()
  const [email, setEmail] = useState('')

  function handleSelectWallet(wallet: WalletItem) {
    setEvmWallet(wallet)
    setStep('evm-wallet-connect')
  }

  function handleSelectEmail(email: string) {
    setEmail(email)
    setStep('email-connect')
  }

  async function handleConnect(wallet: WalletItem, signInfo: WalletSignInfo) {
    await onEvmWalletConnect({
      chain_type: 'eip155',
      client: wallet.client!,
      connect_info: signInfo,
    })
    setStep('index')
  }

  function handleSelectTonWallet(wallet: WalletInfoRemote | WalletInfoInjectable) {
    setTonWallet(wallet)
    setStep('ton-wallet-connect')
  }

  async function handleStatusChange(wallet: Wallet | null) {
    if (!wallet) return
    await onTonWalletConnect({
      chain_type: 'ton',
      client: connector.current!,
      connect_info: wallet
    })
  }

  useEffect(() => {
    connector.current = new TonConnect({
      manifestUrl: 'https://static.codatta.io/static/tonconnect-manifest.json?v=2'
    })

    const unsubscribe = connector.current.onStatusChange(handleStatusChange)
    setStep('index')
    return unsubscribe
  }, [])

  return (
    <AnimateContainer className="xc-rounded-2xl xc-transition-height xc-box-content xc-w-full xc-min-w-[277px] xc-max-w-[420px] xc-p-6 xc-bg-[rgb(28,28,38)] xc-text-white">

      {step === 'evm-wallet-select' && (
        <EvmWalletSelect
          onBack={() => setStep('index')}
          onSelectWallet={handleSelectWallet}
        ></EvmWalletSelect>
      )}
      {step === 'evm-wallet-connect' && (
        <WalletConnectWidget
          onBack={() => setStep('index')}
          onConnect={handleConnect}
          wallet={evmWallet!}
        ></WalletConnectWidget>
      )}
      {step === 'ton-wallet-select' && (
        <TonWalletSelect
          connector={connector.current!}
          onSelect={handleSelectTonWallet}
          onBack={() => setStep('index')}
        ></TonWalletSelect>
      )}
      {step === 'ton-wallet-connect' && (
        <TonWalletConnect
          connector={connector.current!}
          wallet={tonWallet!}
          onBack={() => setStep('index')}
        ></TonWalletConnect>
      )}
      {step === 'email-connect' && (
        <EmailConnectWidget email={email} onBack={() => setStep('index')} onInputCode={onEmailConnect} />
      )}
      {step === 'index' && (
        <SigninIndex
          onEmailConfirm={handleSelectEmail}
          onSelectWallet={handleSelectWallet}
          onSelectMoreWallets={() => setStep('evm-wallet-select')}
          onSelectTonConnect={() => setStep('ton-wallet-select')}
          config={config}
        ></SigninIndex>
      )}
    </AnimateContainer>
  )
}
