import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useCodattaConnectContext } from '../codatta-connect-context-provider'
import { WalletItem } from '../types/wallet-item.class'
import TransitionEffect from './transition-effect'
import { SignInOptionItem, WalletOption } from './wallet-option'
import Spliter from './ui/spliter'

const ImageTonIcon = 'https://static.codatta.io/codatta-connect/wallet-icons.svg?v=2#ton'

function MoreWallets(props: { onClick?: () => void }) {
  const { onClick } = props

  function handleClickMore() {
    onClick && onClick()
  }

  return (
    <Spliter className="xc-opacity-20">
      <div className="xc-flex xc-items-center xc-gap-2 xc-cursor-pointer" onClick={handleClickMore}>
        <span className="xc-text-sm">View more wallets</span>
        <ArrowRight size={16}></ArrowRight>
      </div>
    </Spliter>
  )
}

export default function SingInIndex(props: {
  header?: React.ReactNode
  onEmailConfirm: (email: string) => void
  onSelectWallet: (walletOption: WalletItem) => void
  onSelectMoreWallets: () => void
  onSelectTonConnect: () => void
  config: {
    showEmailSignIn?: boolean
    showTonConnect?: boolean
    showFeaturedWallets?: boolean
    showMoreWallets?: boolean
  }
}) {
  const [email, setEmail] = useState('')
  const { featuredWallets, initialized } = useCodattaConnectContext()
  const { onEmailConfirm, onSelectWallet, onSelectMoreWallets, onSelectTonConnect, config } = props

  const isEmail = useMemo(() => {
    const hasChinese =
      /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]/gu
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !hasChinese.test(email) && isEmail.test(email)
  }, [email])

  function handleWalletClick(wallet: WalletItem) {
    onSelectWallet(wallet)
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  async function handleEmailLogin() {
    onEmailConfirm(email)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && isEmail) {
      handleEmailLogin()
    }
  }

  return (
    <TransitionEffect>
      {initialized && <>
      
        {props.header || <div className='xc-mb-6 xc-text-xl xc-font-bold'>Log in or sign up</div>}

        {config.showEmailSignIn && (
          <div className="xc-mb-4">
            <input className='xc-w-full xc-bg-transparent xc-border-white xc-border xc-border-opacity-15 xc-h-10 xc-rounded-lg xc-px-3 xc-mb-3' placeholder='Enter your email' type="email" onChange={handleEmailChange} onKeyDown={handleInputKeyDown} />
            <button disabled={!isEmail} className='xc-bg-[rgb(135,93,255)] xc-text-white xc-w-full xc-rounded-lg xc-py-2 disabled:xc-bg-opacity-10 disabled:xc-text-opacity-50 disabled:xc-bg-white xc-transition-all' onClick={handleEmailLogin}>Continue</button>
          </div>
        )}

        {config.showEmailSignIn && (config.showFeaturedWallets || config.showTonConnect) && <div className='xc-mb-4'>
          <Spliter className='xc-opacity-20'> <span className='xc-text-sm xc-opacity-20'>OR</span></Spliter>
        </div>
        }

        <div>
          <div className="xc-mb-4 xc-flex xc-max-h-[309px] xc-flex-col xc-gap-4 xc-overflow-scroll no-scrollbar">
            {config.showFeaturedWallets && featuredWallets &&
              featuredWallets.map((wallet) => (
                <WalletOption
                  wallet={wallet}
                  key={`feature-${wallet.key}`}
                  onClick={handleWalletClick}
                ></WalletOption>
              ))}
            {config.showTonConnect && (
              <SignInOptionItem
                icon={<img className="xc-h-5 xc-w-5" src={ImageTonIcon}></img>}
                title="TON Connect"
                onClick={onSelectTonConnect}
              ></SignInOptionItem>
            )}
          </div>
          {config.showMoreWallets && <MoreWallets onClick={onSelectMoreWallets} />}
        </div>
      </>}
    </TransitionEffect>
  )
}
