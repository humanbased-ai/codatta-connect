import ControlHead from './control-head'
import TransitionEffect from './transition-effect'
import accountApi, { ILoginResponse } from '@/api/account.api'
import { useCodattaSigninContext } from '@/providers/codatta-signin-context-provider'
import EmailConnect from './email-connect'

export default function EmailLoginWidget(props: {
  email: string
  onLogin: (res: ILoginResponse) => Promise<void>
  onBack: () => void
}) {
  const { email } = props
  const config = useCodattaSigninContext()

  async function handleOTPChange(email: string, value: string) {
    const res = await accountApi.emailLogin({
      account_type: 'email',
      connector: 'codatta_email',
      account_enum: 'C',
      email_code: value,
      email: email,
      inviter_code: config.inviterCode,
      source: {
        device: config.device,
        channel: config.channel,
        app: config.app
      }
    })
    props.onLogin(res.data)
  }

  return (
    <TransitionEffect>
      <div className="xc-mb-12">
        <ControlHead title="Sign in with email" onBack={props.onBack}></ControlHead>
      </div>
      <EmailConnect email={email} onInputCode={handleOTPChange}></EmailConnect>
    </TransitionEffect>
  )
}
