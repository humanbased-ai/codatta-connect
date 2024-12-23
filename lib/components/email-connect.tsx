
import TransitionEffect from './transition-effect'
import { useEffect, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import accountApi from '@/api/account.api'
import { Loader2, Mail } from 'lucide-react'
import Spin from './ui/spin'
import { cn } from '@udecode/cn'

export default function EmailConnect(props: {
  email: string
  onInputCode: (email:string, code:string) => Promise<void>
}) {
  const { email } = props
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [getCodeError, setGetCodeError] = useState<string>('')
  const [connectError, setConnectError] = useState('')

  async function startCountDown() {
    setCount(60)
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function sendEmailCode(email: string) {
    setSendingCode(true)
    try {
      setGetCodeError('')
      await accountApi.getEmailCode({ account_type: 'email', email })
      startCountDown()
    } catch (err: any) {
      setGetCodeError(err.message)
    }
    setSendingCode(false)
  }

  useEffect(() => {
    if (!email) return
    sendEmailCode(email)
  }, [email])

  async function handleOTPChange(value: string) {
    setConnectError('')
    if (value.length < 6) return
    setLoading(true)
    try {
      await props.onInputCode(email, value)
    } catch (err: any) {
      setConnectError(err.message)
    }
    setLoading(false)
  }

  return (
    <TransitionEffect>
      <div className='xc-flex xc-flex-col xc-items-center xc-justify-center xc-mb-12'>
        <Mail className='xc-mb-4' size={60}></Mail>
        <div className='xc-flex xc-flex-col xc-items-center xc-justify-center xc-mb-8 xc-h-16'>
          {getCodeError ? <div className='xc-text-[#ff0000] xc-text-center'><p className='xc-px-8'>{getCodeError}</p></div> :
            sendingCode ? <Loader2 className="xc-animate-spin"></Loader2> : <>
              <p className='xc-text-lg xc-mb-1'>We’ve sent a verification code to</p>
              <p className='xc-font-bold xc-text-center'>{email}</p>
            </>
          }
        </div>

        <div className='xc-mb-2 xc-h-12'>
          <Spin spinning={loading} className='xc-rounded-xl'>
            <InputOTP maxLength={6} onChange={handleOTPChange} disabled={loading} className='disabled:xc-opacity-20'>
              <InputOTPGroup>
                <div className={cn('xc-flex xc-gap-2', loading ? 'xc-opacity-20' : '')}>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </div>
              </InputOTPGroup>
            </InputOTP>
          </Spin>
        </div>
        {connectError && <div className='xc-text-[#ff0000] xc-text-center'><p>{connectError}</p></div>}
      </div>

      <div className='xc-text-center xc-text-sm xc-text-gray-400'>
        Not get it? {count ? `Recend in ${count}s` : <button onClick={() => sendEmailCode(email)}>Send again</button>}
      </div>

    </TransitionEffect>
  )
}
