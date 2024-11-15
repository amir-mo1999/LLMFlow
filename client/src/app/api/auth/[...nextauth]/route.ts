import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"
import DecodedToken from "next-auth"
import { UserWithAccessToken } from "@/api/apiSchemas"

const apiUrl = process.env.BACKEND_URL || ""

async function refreshAccessToken(access_token: string) {
  try {
    const response = await fetch(apiUrl + "/auth/refresh-token", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
      method: "GET",
    })

    const userWithToken: UserWithAccessToken = await response.json()

    if (!response.ok) {
      throw userWithToken
    }

    return userWithToken.access_token
  } catch (error) {
    return {
      error: "RefreshAccessTokenError",
    }
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "E-Mail",
          type: "text",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        if (credentials === undefined) {
          return null
        }
        if (credentials.username === undefined || credentials.password === undefined) {
          return null
        }

        // create formdata with username and password
        const formData = new FormData()
        formData.append("username", credentials.username)
        formData.append("password", credentials.password)
        // send login request
        try {
          const response = await fetch(apiUrl + "/auth/login", {
            method: "POST",
            body: formData,
          })

          console.log(response)

          if (response.ok) {
            const result = await response.json()
            return result
          } else {
            return null
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // after login add user data to token
      if (user) {
        token.user = user
      }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // create session object and return it
      session = { ...session, user: token.user }
      return session
    },
    // redirect user to base route after login
    async redirect(params: { url: string; baseUrl: string }) {
      return (process.env.NEXTAUTH_URL as string) + "/ai-functions"
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
})

export { handler as GET, handler as POST }
