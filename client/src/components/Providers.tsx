"use client"
import React, { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
interface Props {
  children: ReactNode
}

// component that allows us to access the session provider
const Providers = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Providers
