
import TransitionEffect from './transition-effect'
import ControlHead from './control-head'
import EmailConnect from './email-connect'
import { useState } from 'react'
import EmailCaptcha from './email-captcha'

export default function EmailConnectWidget(props: {
  email: string
  onInputCode: (email: string, code: string) => Promise<void>
  onBack: () => void
}) {
  const { email } = props
  const [step, setStep] = useState<'captcha' | 'verify-email'>('captcha')


  return (
    <TransitionEffect>
      <div className="xc-mb-12">
        <ControlHead title="Sign in with email" onBack={props.onBack}></ControlHead>
      </div>
      {step === 'captcha' && <EmailCaptcha email={email} onCodeSend={() => setStep('verify-email')} />}
      {step === 'verify-email' && <EmailConnect email={email} onInputCode={props.onInputCode} onResendCode={() => setStep('captcha')}></EmailConnect>}
    </TransitionEffect>
  )
}
