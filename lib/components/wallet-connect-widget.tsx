import { useState } from 'react'
import ControlHead from './control-head'
import TransitionEffect from './transition-effect'
import WalletQr from './wallet-qr'
import WalletConnect, { WalletSignInfo } from './wallet-connect'
import GetWallet from './get-wallet'
import { WalletItem } from '../types/wallet-item.class'

export default function WalletConnectWidget(props: {
  wallet: WalletItem
  onConnect: (wallet: WalletItem, signInfo:WalletSignInfo) => void
  onBack: () => void
}) {
  const { wallet, onConnect } = props
  const [step, setStep] = useState(wallet.installed ? 'connect' : 'qr')

  async function handleSignFinish(wallet: WalletItem, signInfo: WalletSignInfo) {
    await onConnect(wallet, signInfo)
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
