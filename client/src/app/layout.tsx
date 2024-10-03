"use client"
import { Inter } from "next/font/google"
import "./globals.css"
import Box from "@mui/material/Box"
import { MyAppBar } from "@/components"
import { ThemeProvider } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { useState } from "react"
import theme from "@/theme"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
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
                {children}
              </Box>
            </QueryClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
