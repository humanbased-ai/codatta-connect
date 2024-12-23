import React from 'react'
import { CodattaConnectContextProvider } from '../../lib/main'

export default function AppLayout(props: { children: React.ReactNode }) {
  return <CodattaConnectContextProvider>
    <div className='xc-h-screen xc-flex xc-items-center xc-justify-center xc-bg-black'>
      {props.children}
    </div>
  </CodattaConnectContextProvider>
}