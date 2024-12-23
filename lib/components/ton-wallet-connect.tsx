import { useEffect, useMemo, useRef, useState } from 'react'
import accountApi from '../api/account.api'
import TonConnect, { isWalletInfoCurrentlyInjected, WalletInfoInjectable, WalletInfoRemote } from '@tonconnect/sdk'
import QRCodeStyling from 'qr-code-styling'
import TransitionEffect from './transition-effect'
import ControlHead from './control-head'
import { Globe, Laptop, Loader2 } from 'lucide-react'

function AppButton(props: { children: React.ReactNode, onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) {
  const { children, onClick } = props
  return <button onClick={onClick} className='xc-border xc-px-4 xc-py-2 xc-rounded-full xc-text-sm xc-flex xc-gap-2 xc-items-center'>{children}</button>
}

export default function TonWalletConnect(props: {
  connector: TonConnect
  wallet: WalletInfoRemote | WalletInfoInjectable
  onBack: () => void
  loading?: boolean
}) {
  const { wallet, connector, loading } = props
  const qrCodeContainer = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling>()
  const [_error, setError] = useState<string>()
  const [nonce, setNonce] = useState<string>()
  const [_guideType, _setGuideType] = useState<'connect' | 'sign' | 'waiting'>('connect')
  const [qrLoading, setQrLoading] = useState<boolean>(false)
  const [link, setLink] = useState<string>()


  function updateQrCode(content: string) {
    qrCode.current?.update({
      data: content,
    })
  }

  async function initWalletConnect() {
    setQrLoading(true)
    try {
      setError('')
      const nonce = await accountApi.getNonce({ account_type: 'block_chain' })
      if ('universalLink' in wallet && wallet.universalLink) {
        const link = connector.connect({
          universalLink: wallet.universalLink,
          bridgeUrl: wallet.bridgeUrl
        }, {
          request: { tonProof: nonce }
        })
        if (!link) return
        setLink(link)
        updateQrCode(link)
        setNonce(nonce)
      }
    } catch (err: any) {
      setError(err.message)
    }
    setQrLoading(false)
  }

  function initQrCode() {
    qrCode.current = new QRCodeStyling({
      width: 264,
      height: 264,
      margin: 0,
      type: 'svg',
      qrOptions: {
        errorCorrectionLevel: 'M',
      },
      dotsOptions: {
        color: 'black',
        type: 'rounded',
      },
      backgroundOptions: {
        color: 'transparent',
      },
    })

    qrCode.current.append(qrCodeContainer.current!)
  }

  function handleExtensionConnect() {
    connector.connect(wallet, {
      request: { tonProof: nonce }
    })
  }

  function handleDesktopConnect() {
    if ('deepLink' in wallet) {
      if (!wallet.deepLink) return
      if (!link) return
      const url = new URL(link)
      const desktopLink = `${wallet.deepLink}${url.search}`
      window.open(desktopLink)
    }
  }

  function handleTMAConnect() {
    if ('universalLink' in wallet && wallet.universalLink && /t.me/.test(wallet.universalLink)) {
      window.open(link)
    }
  }

  const hashDeepLink = useMemo(() => {
    if ('deepLink' in wallet && wallet.deepLink) {
      return true
    }
    return false
  }, [wallet])

  const hashTgMiniApp = useMemo(() => {
    if ('universalLink' in wallet && wallet.universalLink && /t.me/.test(wallet.universalLink)) {
      return true
    }
    return false
  }, [wallet])

  useEffect(() => {
    initQrCode()
    initWalletConnect()
  }, [])

  return (

    <TransitionEffect>
      <div className="xc-mb-6">
        <ControlHead title={'Connect wallet'} onBack={props.onBack} />
      </div>
      <div className='xc-text-center xc-mb-6'>
        <div className="xc-relative xc-mx-auto xc-mb-6 xc-block xc-max-h-[272px] xc-max-w-[272px] xc-rounded-xl xc-bg-white xc-p-1">
          <div className="xc-aspect-[1/1] xc-flex xc-h-full xc-w-full xc-justify-center" ref={qrCodeContainer}></div>
          <div className="xc-absolute xc-left-0 xc-top-0 xc-flex xc-h-full xc-w-full xc-items-center xc-justify-center">
            {qrLoading ? (
              <Loader2 className="xc-h-6 xc-w-6 xc-animate-spin xc-text-black" size={20}></Loader2>
            ) : (
              <img className="xc-h-10 xc-w-10 xc-rounded-md" src={wallet.imageUrl}></img>
            )}
          </div>
        </div>
        <p className='xc-text-center'>Scan the QR code below with your phone's camera. </p>
      </div>
      <div className='xc-flex xc-justify-center xc-gap-2'>
        {loading && <Loader2 className="xc-animate-spin"></Loader2>}
        {(!qrLoading && !loading) && <>
          {isWalletInfoCurrentlyInjected(wallet) && <AppButton onClick={handleExtensionConnect}><Globe className="xc-opacity-80"></Globe>Extension</AppButton>}
          {hashDeepLink && <AppButton onClick={handleDesktopConnect}><Laptop className="xc-opacity-80"></Laptop>Desktop</AppButton>}
          {hashTgMiniApp && <AppButton onClick={handleTMAConnect}>Telegram Mini App</AppButton>}
        </>}
      </div>
    </TransitionEffect>
  )
}
