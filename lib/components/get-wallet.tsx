import { ArrowRight } from 'lucide-react'
import { WalletItem } from '../types/wallet-item.class'
import { WalletConfig } from '../constant/wallet-book'

const walletIconsImage = 'https://static.codatta.io/codatta-connect/wallet-icons.svg'

const AppStoreLinkBase = 'https://itunes.apple.com/app/'
const PlayStoreLinkBase = 'https://play.google.com/store/apps/details?id='
const ChromeStoreLinkBase = 'https://chromewebstore.google.com/detail/'
const BraveStoreLinkBase = 'https://chromewebstore.google.com/detail/'
const FirefoxStoreLinkBase = 'https://addons.mozilla.org/en-US/firefox/addon/'
const EdgeStoreLinkBase = 'https://microsoftedge.microsoft.com/addons/detail/'

function InstallOption(props: { icon: string; title: string; link: string }) {
  const { icon, title, link } = props
  return (
    <a
      href={link}
      target="_blank"
      className="xc-flex xc-w-full xc-cursor-pointer xc-items-center xc-gap-2 xc-rounded-full xc-border xc-border-white xc-border-opacity-15 xc-px-6 xc-py-3 xc-transition-all xc-hover:bg-white xc-hover:bg-opacity-5"
    >
      <img className="xc-rounded-1 xc-h-6 xc-w-6" src={icon} alt="" />
      {title}
      <ArrowRight className="xc-ml-auto xc-text-gray-400"></ArrowRight>
    </a>
  )
}

function getStoreLinks(wallet: WalletConfig['getWallet']) {
  const links = {
    appStoreLink: '',
    playStoreLink: '',
    chromeStoreLink: '',
    braveStoreLink: '',
    firefoxStoreLink: '',
    edgeStoreLink: '',
  }

  if (wallet?.app_store_id) {
    links.appStoreLink = `${AppStoreLinkBase}${wallet.app_store_id}`
  }

  if (wallet?.play_store_id) {
    links.playStoreLink = `${PlayStoreLinkBase}${wallet.play_store_id}`
  }

  if (wallet?.chrome_store_id) {
    links.chromeStoreLink = `${ChromeStoreLinkBase}${wallet.chrome_store_id}`
  }

  if (wallet?.brave_store_id) {
    links.braveStoreLink = `${BraveStoreLinkBase}${wallet.brave_store_id}`
  }

  if (wallet?.firefox_addon_id) {
    links.firefoxStoreLink = `${FirefoxStoreLinkBase}${wallet.firefox_addon_id}`
  }

  if (wallet?.edge_addon_id) {
    links.edgeStoreLink = `${EdgeStoreLinkBase}${wallet.edge_addon_id}`
  }
  return links
}

export default function GetWallet(props: { wallet: WalletItem }) {
  const { wallet } = props

  const config = wallet.config?.getWallet
  const links = getStoreLinks(config!)

  return (
    <div className="xc-flex xc-flex-col xc-items-center">
      <img className="xc-rounded-md xc-mb-2 xc-h-12 xc-w-12" src={wallet.config?.image} alt="" />
      <p className="xc-text-lg xc-font-bold">Install {wallet.config?.name} to connect</p>
      <p className="xc-mb-6 xc-text-sm xc-text-gray-500">Select from your preferred options below:</p>
      <div className="xc-grid xc-w-full xc-grid-cols-1 xc-gap-3">
        {config?.chrome_store_id && (
          <InstallOption
            link={links.chromeStoreLink}
            icon={`${walletIconsImage}#chrome`}
            title="Chrome Web Store"
          ></InstallOption>
        )}
        {config?.app_store_id && (
          <InstallOption
            link={links.appStoreLink}
            icon={`${walletIconsImage}#apple-dark`}
            title="Apple App Store"
          ></InstallOption>
        )}
        {config?.play_store_id && (
          <InstallOption
            link={links.playStoreLink}
            icon={`${walletIconsImage}#android`}
            title="Google Play Store"
          ></InstallOption>
        )}
        {config?.edge_addon_id && (
          <InstallOption
            link={links.edgeStoreLink}
            icon={`${walletIconsImage}#edge`}
            title="Microsoft Edge"
          ></InstallOption>
        )}
        {config?.brave_store_id && (
          <InstallOption
            link={links.braveStoreLink}
            icon={`${walletIconsImage}#brave`}
            title="Brave extension"
          ></InstallOption>
        )}
        {config?.firefox_addon_id && (
          <InstallOption
            link={links.firefoxStoreLink}
            icon={`${walletIconsImage}#firefox`}
            title="Mozilla Firefox"
          ></InstallOption>
        )}
      </div>
    </div>
  )
}
