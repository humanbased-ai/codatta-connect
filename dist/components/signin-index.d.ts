import { WalletItem } from '../types/wallet-item.class';
export default function SingInIndex(props: {
    header?: React.ReactNode;
    onEmailConfirm: (email: string) => void;
    onSelectWallet: (walletOption: WalletItem) => void;
    onSelectMoreWallets: () => void;
    onSelectTonConnect: () => void;
    useSingleWallet: boolean;
    config: {
        showEmailSignIn?: boolean;
        showTonConnect?: boolean;
        showFeaturedWallets?: boolean;
        showMoreWallets?: boolean;
    };
}): import("react/jsx-runtime").JSX.Element;
