// middleware.js

import { withAuth } from "next-auth/middleware"

// Export the middleware function
export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      return req.url.includes("user") || !!token
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
})

export const config = {
  matcher: ["/((?!auth|api/auth).*)"],
}
