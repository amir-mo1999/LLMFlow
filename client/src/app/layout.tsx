"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Box from "@mui/material/Box"
import { Providers, SessionLoaded } from "@/components"
import { ThemeProvider } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
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
        <Providers>
          <SessionLoaded>
            <QueryClientProvider client={queryClient}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#F3F2F7",
                  paddingX: "4rem",
                  paddingY: "1rem",
                  height: "100%",
                  width: "100%",
                  overflowY: "auto",
                }}
              >
                {children}
              </Box>
            </QueryClientProvider>
          </SessionLoaded>
        </Providers>
      </body>
    </html>
  )
}
