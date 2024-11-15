"use client"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@mui/material"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import lightTheme from "@/theme"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = useMemo(() => (prefersDarkMode ? lightTheme : lightTheme), [prefersDarkMode])

  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
