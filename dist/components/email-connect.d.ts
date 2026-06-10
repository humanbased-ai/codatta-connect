export default function EmailConnect(props: {
    email: string;
    onInputCode: (email: string, code: string) => Promise<void>;
    onResendCode: () => void;
}): import("react/jsx-runtime").JSX.Element;
