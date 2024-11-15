"use client"
import { Inter } from "next/font/google"
import Box from "@mui/material/Box"
import { MyAppBar } from "@/components"
import { SessionProvider } from "next-auth/react"
import { AppContextProvider } from "@/contexts"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F3F2F7",
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <MyAppBar />
            <AppContextProvider>{children}</AppContextProvider>
          </Box>
        </SessionProvider>
      </body>
    </html>
  )
}
