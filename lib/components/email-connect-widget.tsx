
import TransitionEffect from './transition-effect'
import ControlHead from './control-head'
import EmailConnect from './email-connect'

export default function EmailConnectWidget(props: {
  email: string
  onInputCode: (email: string, code: string) => Promise<void>
  onBack: () => void
}) {
  const { email } = props

  return (
    <TransitionEffect>
      <div className="xc-mb-12">
        <ControlHead title="Sign in with email" onBack={props.onBack}></ControlHead>
      </div>
      <EmailConnect email={email} onInputCode={props.onInputCode}></EmailConnect>
    </TransitionEffect>
  )
}
