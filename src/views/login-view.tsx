import accountApi, { ILoginResponse } from '../../lib/api/account.api'
import { EmvWalletConnectInfo, TonWalletConnectInfo } from '../../lib/codatta-connect'
import { CodattaSignin, CodattaConnect } from '../../lib/main'
import React from 'react'

export default function LoginView() {

  async function handleLogin(res: ILoginResponse) {
    localStorage.setItem('auth', res.token)
  }

  async function handleEmailConnect(email: string, code: string) {
    const data = await accountApi.bindEmail({
      account_type: 'email',
      connector: 'codatta_email',
      account_enum: 'C',
      email_code: code,
      email: email,
    })
  }

  async function handleTonWalletConnect(info: TonWalletConnectInfo) {

    const account = info.connect_info.account
    const connectItems = info.connect_info.connectItems

    if (!connectItems?.tonProof) return

    const data = await accountApi.bindTonWallet({
      account_type: 'block_chain',
      connector: 'codatta_ton',
      account_enum: 'C',
      chain: info.connect_info.account.chain,
      wallet_name: info.connect_info.device.appName,
      address: info.connect_info.account.address,
      connect_info: [
        { name: 'ton_addr', network: account.chain, ...account },
        connectItems.tonProof
      ],
    })
  }

  async function handleEvmWalletConnect(info: EmvWalletConnectInfo) {
    const data = await accountApi.bindEvmWallet({
      account_type: 'block_chain',
      connector: 'codatta_wallet',
      account_enum: 'C',
      chain: (await info.client.getChainId()).toString(),
      address: (await info.client.getAddresses())[0],
      signature: info.connect_info.signature,
      nonce: info.connect_info.nonce,
      wallet_name: info.connect_info.wallet_name,
      message: info.connect_info.message,
    })
    console.log(data)
  }


  return (<>
  
    {/* <CodattaConnect
      onEmailConnect={handleEmailConnect}
      onEvmWalletConnect={handleEvmWalletConnect}
      onTonWalletConnect={handleTonWalletConnect}
      config={{
        showEmailSignIn: true,
        showFeaturedWallets: true,
        showTonConnect: true,
        showMoreWallets: true
      }}
    ></CodattaConnect> */}
    <CodattaSignin onLogin={handleLogin} config={{
      channel:'test',
      device:'WEB',
      app:'test',
      inviterCode:'',
      role: 'B'
    }}></CodattaSignin>
    </>
  )
}