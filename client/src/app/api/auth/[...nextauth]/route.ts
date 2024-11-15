import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const apiUrl = process.env.BACKEND_URL || ""

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
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

          if (response.ok) {
            const result = await response.json()
            return result
          } else {
            return null
          }
        } catch {
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
        //@ts-expect-error: the server returns the user with an access token but we did not specify the return type
        token.accessToken = user.access_token
      }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // create session object and return it
      session = { ...session, user: token.user }
      return session
    },
    // redirect user to base route after login
    async redirect() {
      return (process.env.NEXTAUTH_URL as string) + "/ai-functions"
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/auth/sign-in",
  },
})

export { handler as GET, handler as POST }
