import { useState } from 'react'
import ControlHead from './control-head'
import TransitionEffect from './transition-effect'
import WalletQr from './wallet-qr'
import WalletConnect from './wallet-connect'
import GetWallet from './get-wallet'
import { WalletItem } from '../types/wallet-item.class'
import accountApi, { ILoginResponse } from '../api/account.api'
import { useCodattaSigninContext } from '@/providers/codatta-signin-context-provider'

export default function EvmWalletLoginWidget(props: {
  wallet: WalletItem
  onLogin: (res: ILoginResponse) => void
  onBack: () => void
}) {
  const { wallet } = props
  const [step, setStep] = useState(wallet.installed ? 'connect' : 'qr')
  const config = useCodattaSigninContext()


  async function handleSignFinish(wallet: WalletItem, params: {
    message: string
    nonce: string
    signature: string
    wallet_name: string
  }) {
    const res = await accountApi.walletLogin({
      account_type: 'block_chain',
      account_enum: config.role,
      connector: 'codatta_wallet',
      inviter_code: config.inviterCode,
      wallet_name: wallet.config?.name || wallet.key,
      address: await wallet.getAddress(),
      chain: (await wallet.getChain()).toString(),
      nonce: params.nonce,
      signature: params.signature,
      message: params.message,
      source: {
        device: config.device,
        channel: config.channel,
        app: config.app
      }
    })
    await props.onLogin(res.data)
  }

  return (
    <TransitionEffect>
      <div className="xc-mb-6">
        <ControlHead title={'Connect wallet'} onBack={props.onBack} />
      </div>
      {step === 'qr' && (
        <WalletQr
          wallet={wallet}
          onGetExtension={() => setStep('get-extension')}
          onSignFinish={handleSignFinish}
        ></WalletQr>
      )}
      {step === 'connect' && (
        <WalletConnect
          onShowQrCode={() => setStep('qr')}
          wallet={wallet}
          onSignFinish={handleSignFinish}
        ></WalletConnect>
      )}
      {step === 'get-extension' && <GetWallet wallet={wallet}></GetWallet>}
    </TransitionEffect>
  )
}
