import { WalletItem } from "../types/wallet-item.class"

export default function SingleWalletOption(props: { wallet: WalletItem; onClick: (wallet: WalletItem) => void }) {

  const { wallet, onClick } = props

  return <div className="xc-flex xc-flex-col xc-items-center xc-justify-center xc-gap-4">
    <img className="xc-rounded-md xc-h-16 xc-w-16" src={wallet.config?.image} alt="" />

    <div className="xc-flex xc-flex-col xc-items-center">
      <p className="xc-text-danger xc-mb-2 xc-text-center">Connect to {wallet.config?.name}</p>
      <div className='xc-flex xc-gap-2'>
        <button className="xc-rounded-full xc-bg-white xc-bg-opacity-10 xc-px-6 xc-py-1" onClick={()=>onClick(wallet)}>
          Connect
        </button>
      </div>
    </div>
  </div>
}