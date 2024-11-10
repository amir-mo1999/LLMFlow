import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"
import { JWT } from "next-auth/jwt"
import axios, { AxiosHeaders } from "axios"

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

async function refreshAccessToken(token: JWT) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      })
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
        token.user = user
        token.accessToken = jwt.sign({ user }, process.env.NEXTAUTH_SECRET as string, {
          algorithm: "HS256",
          expiresIn: "30d",
        })
        try {
          const headers = new AxiosHeaders()
          headers.append("authorization", `Bearer ${token.accessToken}`)
          // TODO: handle errors for post user request
          await axios.post(
            `${process.env.BACKEND_URL}/user`,
            {
              name: user.name,
              email: user.email,
            },
            { headers: headers }
          )
        } catch {}
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      // Do not expose the access token to the client
      session.user = token.user
      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
})

export { handler as GET, handler as POST }
