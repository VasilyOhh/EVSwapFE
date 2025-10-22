import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "EVSwap",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleOAuthProvider clientId="691424301921-q6uuf035t3ta88cs6cg0es194eulno1u.apps.googleusercontent.com">
          {children}
          <Analytics />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
