import { default as TonConnect, WalletInfoInjectable, WalletInfoRemote } from '@tonconnect/sdk';
export default function TonWalletSelect(props: {
    connector: TonConnect;
    onSelect: (wallet: WalletInfoRemote | WalletInfoInjectable) => void;
    onBack: () => void;
}): import("react/jsx-runtime").JSX.Element;
