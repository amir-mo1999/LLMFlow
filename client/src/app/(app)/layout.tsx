"use client"
import { AppContextProvider } from "@/contexts"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppContextProvider>{children}</AppContextProvider>
}
