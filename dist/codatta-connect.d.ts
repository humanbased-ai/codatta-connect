import { WalletItem } from './types/wallet-item.class';
import { default as TonConnect, Wallet } from '@tonconnect/sdk';
import { WalletSignInfo } from './components/wallet-connect';
import { WalletClient } from 'viem';
export interface EmvWalletConnectInfo {
    chain_type: 'eip155';
    client: WalletClient;
    connect_info: WalletSignInfo;
    wallet: WalletItem;
}
export interface TonWalletConnectInfo {
    chain_type: 'ton';
    client: TonConnect;
    connect_info: Wallet;
    wallet: Wallet;
}
export declare function CodattaConnect(props: {
    onEvmWalletConnect?: (connectInfo: EmvWalletConnectInfo) => Promise<void>;
    onTonWalletConnect?: (connectInfo: TonWalletConnectInfo) => Promise<void>;
    onEmailConnect?: (email: string, code: string) => Promise<void>;
    config?: {
        showEmailSignIn?: boolean;
        showFeaturedWallets?: boolean;
        showMoreWallets?: boolean;
        showTonConnect?: boolean;
    };
}): import("react/jsx-runtime").JSX.Element;
