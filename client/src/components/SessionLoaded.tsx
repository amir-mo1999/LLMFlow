"use client"
import React from "react"
import { useSession } from "next-auth/react"
interface SessionLoadedProps {
  children: React.ReactNode
}
// TODO: fix this so it actually reloads when the session is loaded
// component that allows us to access the session provider
const SessionLoaded: React.FC<SessionLoadedProps> = ({ children }) => {
  const { data: session } = useSession()

  // return Loading screen if session did not load in yet
  if (session?.user.role === undefined) {
    return <>Loading...</>
  }

  return <>{children}</>
}

export default SessionLoaded
