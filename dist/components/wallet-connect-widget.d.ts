import { WalletSignInfo } from './wallet-connect';
import { WalletItem } from '../types/wallet-item.class';
export default function WalletConnectWidget(props: {
    wallet: WalletItem;
    onConnect: (wallet: WalletItem, signInfo: WalletSignInfo) => void;
    onBack: () => void;
}): import("react/jsx-runtime").JSX.Element;
