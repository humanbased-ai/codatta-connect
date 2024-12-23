import { ILoginResponse } from '../api/account.api';
export default function EmailLoginWidget(props: {
    email: string;
    onLogin: (res: ILoginResponse) => Promise<void>;
    onBack: () => void;
}): import("react/jsx-runtime").JSX.Element;
