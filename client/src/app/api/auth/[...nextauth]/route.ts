import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"
import { api } from "@/network"
import { DecodedTokenT } from "@/types"

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
        // send credentials to login route and get result
        const res = await api.login({
          username: credentials.username,
          password: credentials.password,
        })

        // check if response was successful
        if (res.status !== 200) {
          return null
        }

        // get user data
        const user = await res.json()

        // If no error and we have and token data return them both
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
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
      //TODO: add logic to refresh jwt
      // decode the token coming from the backend
      const decodedToken: DecodedTokenT = jwt.verify(
        token.access_token as string,
        process.env.NEXTAUTH_SECRET as string
      ) as DecodedTokenT

      // create session object and return it
      session = { ...session, user: token.user, decodedToken: decodedToken }
      return session
    },
    // redirect user to base route after login
    async redirect(params: { url: string; baseUrl: string }) {
      return process.env.NEXTAUTH_URL as string
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
})

export { handler as GET, handler as POST }
