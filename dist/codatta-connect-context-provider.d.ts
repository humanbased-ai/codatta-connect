import { WalletItem } from './types/wallet-item.class';
import { Chain } from 'viem';
export declare const coinbaseWallet: {
    getProvider: () => import('@coinbase/wallet-sdk').ProviderInterface;
};
interface CodattaConnectContext {
    initialized: boolean;
    wallets: WalletItem[];
    featuredWallets: WalletItem[];
    lastUsedWallet: WalletItem | null;
    saveLastUsedWallet: (wallet: WalletItem) => void;
    chains: Chain[];
}
export declare function useCodattaConnectContext(): CodattaConnectContext;
interface CodattaConnectContextProviderProps {
    children: React.ReactNode;
    apiBaseUrl?: string;
    singleWalletName?: string;
    chains?: Chain[];
}
export declare function CodattaConnectContextProvider(props: CodattaConnectContextProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
