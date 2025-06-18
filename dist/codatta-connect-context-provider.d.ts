import { WalletItem } from './types/wallet-item.class';
export declare const coinbaseWallet: {
    getProvider: () => import('@coinbase/wallet-sdk').ProviderInterface;
};
interface CodattaConnectContext {
    initialized: boolean;
    wallets: WalletItem[];
    featuredWallets: WalletItem[];
    lastUsedWallet: WalletItem | null;
    saveLastUsedWallet: (wallet: WalletItem) => void;
}
export declare function useCodattaConnectContext(): CodattaConnectContext;
interface CodattaConnectContextProviderProps {
    children: React.ReactNode;
    apiBaseUrl?: string;
    singleWalletName?: string;
}
export declare function CodattaConnectContextProvider(props: CodattaConnectContextProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
