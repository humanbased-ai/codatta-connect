import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { UniversalProvider, UniversalProviderOpts } from '@walletconnect/universal-provider'
import { Link2, Download, Loader2, CheckCircle, Laptop } from 'lucide-react'
import { createSiweMessage } from 'viem/siwe'
import { WalletItem } from '../types/wallet-item.class'
import { useCodattaConnectContext } from '../codatta-connect-context-provider'
import accountApi from '../api/account.api'

const WALLETCONNECT_PROJECT_ID = '7a4434fefbcc9af474fb5c995e47d286'

const walletConnectConfig:UniversalProviderOpts = {
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: {
    name: 'codatta',
    description: 'codatta',
    url: 'https://codatta.io/',
    icons: ['https://avatars.githubusercontent.com/u/171659315'],
  },
}

const walletProviderConnectConfig = {
  namespaces: {
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged', 'disconnect'],
      rpcMap: {
        1: `https://rpc.walletconnect.com?chainId=eip155:1&projectId=${WALLETCONNECT_PROJECT_ID}`,
      },
    },
  },
  skipPairing: false,
}

function getSiweMessage(address: `0x${string}`, nonce: string) {
  const domain = window.location.host
  const uri = window.location.href
  const message = createSiweMessage({
    address: address,
    chainId: 1,
    domain,
    nonce,
    uri,
    version: '1',
  })
  return message
}
export default function WalletQr(props: {
  wallet: WalletItem
  onGetExtension: () => void
  onSignFinish: (wallet: WalletItem, signInfo: {
    message: string
    nonce: string
    signature: string
    address: string
    wallet_name: string
  }) => Promise<void>
}) {
  const qrCodeContainer = useRef<HTMLDivElement>(null)
  const { wallet, onGetExtension, onSignFinish } = props
  const [wcUri, setWcUri] = useState('')
  const [uriLoading, setUriLoading] = useState(false)
  const [error, setError] = useState('')
  const [guideType, setGuideType] = useState<'scan' | 'connect' | 'sign' | 'waiting'>('scan')
  const qrCode = useRef<QRCodeStyling>()
  const [image, setImage] = useState(wallet.config?.image)
  const [copied, setCopied] = useState(false)

  const { saveLastUsedWallet } = useCodattaConnectContext()

  async function getWcUri(wallet: WalletItem) {
    setUriLoading(true)
    const provider = await UniversalProvider.init(walletConnectConfig)
    if (provider.session)  await provider.disconnect()
    try {
      setGuideType('scan')
      provider.on('display_uri', (uri:string) => {
        setWcUri(uri)
        setUriLoading(false)
        setGuideType('scan')
      })
      provider.on('error', (err:any) => {
        console.log(err)
      })
      provider.on('session_update', (session:any) => {
        console.log('session_update', session)
      })
      
      const session = await provider.connect(walletProviderConnectConfig)
      if (!session) throw new Error('Walletconnect init failed')
      const newWallet = new WalletItem(provider)
      setImage(newWallet.config?.image || wallet.config?.image)
      const address = await newWallet.getAddress()
      const nonce = await accountApi.getNonce({account_type: 'block_chain'})
      console.log('get nonce', nonce)
      const message = getSiweMessage(address, nonce)
      setGuideType('sign')
      const signature = await newWallet.signMessage(message, address) as string
      setGuideType('waiting')
      await onSignFinish(newWallet, {
        message,
        nonce,
        signature,
        address,
        wallet_name: newWallet.config?.name || wallet.config?.name || ''
      })
      console.log('save wallet connect wallet!')
      saveLastUsedWallet(newWallet)
    } catch (err: any) {
      console.log('err', err)
      setError(err.details || err.message)
    }
  }

  function initQrCode() {
    qrCode.current = new QRCodeStyling({
      width: 264,
      height: 264,
      margin: 0,
      type: 'svg',
      // image: wallet.config?.image,
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

  function updateQrCode(content: string) {
    console.log(qrCode.current)
    qrCode.current?.update({
      data: content,
    })
  }

  useEffect(() => {
    if (wcUri) updateQrCode(wcUri)
  }, [wcUri])

  useEffect(() => {
    getWcUri(wallet)
  }, [wallet])

  useEffect(() => {
    initQrCode()
  }, [])

  function handleRetry() {
    setError('')
    updateQrCode('')
    getWcUri(wallet)
  }

  function handleCopyQrUri() {
    setCopied(true)
    navigator.clipboard.writeText(wcUri)
    setTimeout(() => {
      setCopied(false)
    }, 2500)
  }

  function handleDesktopLink() {
    const link  = wallet.config?.desktop_link
    if (!link) return
    const url = `${link}?uri=${encodeURIComponent(wcUri)}`
    window.open(url, '_blank')
  }

  // function handleWebappLink() {
  //   const link  = wallet.config?.webapp_link
  //   if (!link) return
  //   const url = `${link}?uri=${encodeURIComponent(wcUri)}`
  //   window.open(url, '_blank')
  // }

  return (
    <div>
      <div className="xc-text-center">
        <div className="xc-relative xc-mx-auto xc-mb-6 xc-block xc-max-h-[272px] xc-max-w-[272px] xc-rounded-xl xc-bg-white xc-p-1">
          <div className="xc-aspect-[1/1] xc-flex xc-h-full xc-w-full xc-justify-center" ref={qrCodeContainer}></div>
          <div className="xc-absolute xc-left-0 xc-top-0 xc-flex xc-h-full xc-w-full xc-items-center xc-justify-center">
            {uriLoading ? (
              <Loader2 className="xc-h-6 xc-w-6 xc-animate-spin xc-text-black" size={20}></Loader2>
            ) : (
              <img className="xc-h-10 xc-w-10" src={image}></img>
            )}
          </div>
        </div>
      </div>
      <div className="xc-m-auto xc-mb-6 xc-flex xc-max-w-[400px] xc-flex-wrap xc-items-center xc-justify-between xc-gap-3">
        <button
          disabled={!wcUri}
          onClick={handleCopyQrUri}
          className="xc-disabled:hover-text-white xc-flex xc-min-w-[160px] xc-flex-1 xc-shrink-0 xc-items-center xc-justify-center xc-gap-2 xc-rounded-full xc-border xc-py-2 xc-text-sm xc-transition-all xc-hover:bg-white xc-hover:text-black xc-disabled:cursor-not-allowed xc-disabled:opacity-40 xc-disabled:hover:bg-transparent"
        >
          {copied ? (
            <>
              {' '}
              <CheckCircle /> Copied!
            </>
          ) : (
            <>
              <Link2></Link2>Copy QR URL
            </>
          )}
        </button>
        {wallet.config?.getWallet &&  <button
          className="xc-rounded-2 xc-flex xc-min-w-[160px] xc-flex-1 xc-shrink-0 xc-items-center xc-justify-center xc-gap-2 xc-rounded-full xc-border xc-py-2 xc-text-sm xc-transition-all xc-hover:bg-white xc-hover:text-black"
          onClick={onGetExtension}
        >
          <Download></Download>Get Extension
        </button>}

        {wallet.config?.desktop_link &&  <button
          disabled={!wcUri}
          className="xc-rounded-2 xc-flex xc-min-w-[160px] xc-flex-1 xc-shrink-0 xc-items-center xc-justify-center xc-gap-2 xc-rounded-full xc-border xc-py-2 xc-text-sm xc-transition-all xc-hover:bg-white xc-hover:text-black"
          onClick={handleDesktopLink}
        >
          <Laptop></Laptop>Desktop
        </button>}
      </div>
      <div className="xc-text-center">
        {error ? (
          <div className="xc-flex xc-flex-col xc-items-center">
            <p className="xc-text-danger xc-mb-2 xc-text-center">{error}</p>
            <button className="xc-rounded-full xc-bg-white xc-bg-opacity-10 xc-px-6 xc-py-1" onClick={handleRetry}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {guideType === 'scan' && <p>Scan this QR code from your mobile wallet or phone's camera to connect.</p>}
            {guideType === 'connect' && <p>Click connect in your wallet app</p>}
            {guideType === 'sign' && <p>Click sign-in in your wallet to confirm you own this wallet.</p>}
            {guideType === 'waiting' && (
              <div className="xc-text-center">
                <Loader2 className="xc-inline-block xc-animate-spin"></Loader2>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
