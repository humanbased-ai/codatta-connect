import { WalletItem } from '../types/wallet-item.class';
export interface WalletSignInfo {
    message: string;
    nonce: string;
    signature: string;
    address: string;
    wallet_name: string;
}
export default function WalletConnect(props: {
    wallet: WalletItem;
    onSignFinish: (wallet: WalletItem, params: WalletSignInfo) => Promise<void>;
    onShowQrCode: () => void;
}): import("react/jsx-runtime").JSX.Element;
