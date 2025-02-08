import { TDeviceType } from '../api/account.api';
export interface CodattaSigninConfig {
    channel: string;
    device: TDeviceType;
    app: string;
    inviterCode: string;
    role?: "B" | "C";
}
export declare function useCodattaSigninContext(): CodattaSigninConfig & {
    role: "B" | "C";
};
interface CodattaConnectContextProviderProps {
    children: React.ReactNode;
    config: CodattaSigninConfig;
}
export declare function CodattaSinginContextProvider(props: CodattaConnectContextProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
