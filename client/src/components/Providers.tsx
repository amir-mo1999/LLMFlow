"use client"
import React, { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
interface ProvidersProps {
  children: ReactNode
}

// component that allows us to access the session provider
const Providers = ({ children }: ProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Providers
