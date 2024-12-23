export default function EmailConnectWidget(props: {
    email: string;
    onInputCode: (email: string, code: string) => Promise<void>;
    onBack: () => void;
}): import("react/jsx-runtime").JSX.Element;
