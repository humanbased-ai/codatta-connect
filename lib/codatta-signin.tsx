import { useEffect, useState } from 'react'
import SigninIndex from './components/signin-index'
import EmailLoginWidget from './components/email-login'
import EvmWalletLoginWidget from './components/evm-wallet-login-widget'
import TonWalletLoginWidget from './components/ton-wallet-login-widget'
import AnimateContainer from './components/animate-container'
import { WalletItem } from './types/wallet-item.class'
import EvmWalletSelect from './components/evm-wallet-select'
import { ILoginResponse } from './api/account.api'
import { CodattaSigninConfig, CodattaSinginContextProvider } from './providers/codatta-signin-context-provider'

type TStep = 'index' | 'email' | 'evm-wallet' | 'all-wallet' | 'ton-wallet' | ''

export function CodattaSignin(props: {
  onLogin: (res: ILoginResponse) => Promise<void>
  header?: React.ReactNode,
  showEmailSignIn?: boolean
  showTonConnect?: boolean
  showMoreWallets?: boolean,
  showFeaturedWallets?: boolean,
  config: CodattaSigninConfig
}) {
  const { onLogin, header, showEmailSignIn = true, showMoreWallets = true, showTonConnect = true, showFeaturedWallets = true } = props
  const [step, setStep] = useState<TStep>('')
  const [wallet, setWallet] = useState<WalletItem | null>(null)
  const [email, setEmail] = useState<string>('')

  function handleSelectWallet(wallet: WalletItem) {
    setWallet(wallet)
    setStep('evm-wallet')
  }

  function handleSelectEmail(email: string) {
    setStep('email')
    setEmail(email)
  }

  async function hanleLoginSuccess(res: ILoginResponse) {
    await onLogin(res)
  }

  function onSelectTonConnect() {
    setStep('ton-wallet')
  }

  useEffect(() => {
    setStep('index')
  }, [])

  return (
    <CodattaSinginContextProvider config={props.config}>
      <AnimateContainer className="xc-rounded-2xl xc-transition-height xc-box-content xc-w-full xc-min-w-[277px] xc-max-w-[420px] xc-p-6 xc-bg-[rgb(28,28,38)] xc-text-white">
        {step === 'evm-wallet' && (
          <EvmWalletLoginWidget
            onBack={() => setStep('index')}
            onLogin={hanleLoginSuccess}
            wallet={wallet!}
          ></EvmWalletLoginWidget>
        )}
        {step === 'ton-wallet' && (
          <TonWalletLoginWidget
            onBack={() => setStep('index')}
            onLogin={hanleLoginSuccess}
          ></TonWalletLoginWidget>
        )}
        {step === 'email' && (
          <EmailLoginWidget email={email} onBack={() => setStep('index')} onLogin={hanleLoginSuccess} />
        )}
        {step === 'index' && (
          <SigninIndex
            header={header}
            onEmailConfirm={handleSelectEmail}
            onSelectWallet={handleSelectWallet}
            onSelectMoreWallets={() => { setStep('all-wallet') }}
            onSelectTonConnect={onSelectTonConnect}
            config={{
              showEmailSignIn: showEmailSignIn,
              showFeaturedWallets: showFeaturedWallets,
              showMoreWallets: showMoreWallets,
              showTonConnect: showTonConnect,
            }}
          ></SigninIndex>
        )}
        {step === 'all-wallet' && (
          <EvmWalletSelect onBack={() => setStep('index')}
            onSelectWallet={handleSelectWallet}
          ></EvmWalletSelect>
        )}
      </AnimateContainer>
    </CodattaSinginContextProvider>
  )
}
