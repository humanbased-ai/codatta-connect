import { TDeviceType } from '@/api/account.api'
import { createContext, useContext, useEffect, useState } from 'react'
import 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'

export interface CodattaSigninConfig {
  channel: string,
  device: TDeviceType
  app: string,
  inviterCode: string,
  role?: "B" | "C"
}

const CodattaSigninContext = createContext<CodattaSigninConfig & {role: "B" | "C"}>({
  channel: '',
  device: 'WEB',
  app: '',
  inviterCode: '',
  role: 'C'
})

export function useCodattaSigninContext() {
  return useContext(CodattaSigninContext)
}

interface CodattaConnectContextProviderProps {
  children: React.ReactNode
  config: CodattaSigninConfig
}

export function CodattaSinginContextProvider(props: CodattaConnectContextProviderProps) {
  const { config } = props
  const [channel, setChannel] = useState(config.channel)
  const [device, setDevice] = useState<TDeviceType>(config.device)
  const [app, setApp] = useState(config.app)
  const [role, setRole] = useState<("B" | "C")>(config.role || 'C')
  const [inviterCode, setInviderCode] = useState(config.inviterCode)

  useEffect(() => {
    setChannel(config.channel)
    setDevice(config.device)
    setApp(config.app)
    setInviderCode(config.inviterCode)
    setRole(config.role || 'C')
  }, [config])

  return (
    <CodattaSigninContext.Provider
      value={{
        channel,
        device,
        app,
        inviterCode,
        role
      }}
    >
      {props.children}
    </CodattaSigninContext.Provider>
  )
}
