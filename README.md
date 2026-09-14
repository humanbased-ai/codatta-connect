![brand-image](https://raw.githubusercontent.com/codatta/assets/refs/heads/main/brand-v3.png)

# Humanbased Connect

Humanbased Connect provides React and Tailwind components for login and wallet linking.

# Quickstart

## Installation

> Note: the npm package is still published as `codatta-connect`; the package/API rename is planned as a separate breaking release.

Humanbased Connect is available as an npm package.

```bash
npm i codatta-connect
```

## Basic Usage

Import and Initialize

```tsx
import { CodattaConnectContextProvider } from "codatta-connect";

export default function App(props: { children: React.ReactNode }) {
  return (
    <CodattaConnectContextProvider>
      {children}
    </CodattaConnectContextProvider>
  );
}
```

Use sign up UI

```tsx
import { ILoginResponse, CodattaSignin } from 'codatta-connect'

export default function Signup()  {

  function handleLogin(res: ILoginResponse) {
    // handle your login logic here
  }

  const config = {
    channel: 'your register channel'
    device: 'Devise type , available value: "WEB", "TD", "PLUG"'
    app: 'your app name',
    inviterCode: 'referral code'
  }

 return <CodattaSignin
   onLogin={handleLogin}
   config={config}
   header={<div>Log in or sign up</div>}
 />
}

```

# Local development

### Install dependencies
```bash
npm install
```

### Start to dev
Now you can start developing. Run the following command to start the development server:
```shell
npm run dev
```

### If you are using VSCode
For you development experience, we include some vscode settings in the `.vscode` directory.
We highly recommend you install the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  
  highlight syntax errors and warnings

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

  IntelliSense for Tailwind CSS

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

  format code



