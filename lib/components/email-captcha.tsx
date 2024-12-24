import { useEffect, useMemo, useRef, useState } from "react"
import TransitionEffect from "./transition-effect"
import accountApi from "@/api/account.api"
import { Loader2, UserCheck2Icon } from 'lucide-react'

export default function EmailCaptcha(props: { email: string, onCodeSend: () => void }) {
  const { email } = props
  const [sendingCode, setSendingCode] = useState(false)
  const [getCodeError, setGetCodeError] = useState<string>('')

  const buttonId = useMemo(() => {
    return `xn-btn-${new Date().getTime()}`
  }, [email])

  async function sendEmailCode(email: string, captcha: string) {
    setSendingCode(true)
    try {
      setGetCodeError('')
      await accountApi.getEmailCode({ account_type: 'email', email }, captcha)
    } catch (err: any) {
      setGetCodeError(err.message)
    }
    setSendingCode(false)
  }

  async function captchaVerifyCallback(captchaVerifyParam: object) {
    try {
      await sendEmailCode(email, JSON.stringify(captchaVerifyParam))
      return { captchaResult: true, bizResult: true }
    } catch (err: any) {
      setGetCodeError(err.message)
      return { captchaResult: false, bizResult: false }
    }
  }

  async function onBizResultCallback(result: boolean) {
    if (result) { props.onCodeSend() }
  }

  const captcha = useRef<unknown>()
  function getInstance(instance: unknown) {
    captcha.current = instance;
  }

  useEffect(() => {
    if (!email) return
    window.initAliyunCaptcha({
      SceneId: 'tqyu8129d',
      prefix: '1mfsn5f',
      mode: 'popup',
      element: '#captcha-element',
      button: `#${buttonId}`,
      captchaVerifyCallback: captchaVerifyCallback,
      onBizResultCallback: onBizResultCallback,
      getInstance: getInstance,
      slideStyle: {
        width: 360,
        height: 40,
      },
      language: 'en',
      region: 'cn'
    })

    return () => {
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    }
  }, [email])

  return <TransitionEffect>
    <div className='xc-flex xc-flex-col xc-items-center xc-justify-center xc-mb-12'>
      <UserCheck2Icon className='xc-mb-4' size={60}></UserCheck2Icon>
      <button className="xc-border xc-rounded-full xc-bg-white xc-text-black xc-px-8 xc-py-2" id={buttonId}>{sendingCode ? <Loader2 className="xc-animate-spin"></Loader2> : "I'm not a robot"}</button>
    </div>
    {getCodeError && <div className='xc-text-[#ff0000] xc-text-center'><p>{getCodeError}</p></div>}
  </TransitionEffect>

}