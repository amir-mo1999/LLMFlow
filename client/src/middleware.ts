// middleware.js

import { withAuth } from "next-auth/middleware"

// Export the middleware function
export default withAuth(
  // Optional: Add any custom middleware logic here
  function middleware() {
    // You can add custom logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if token exists
    },
    pages: {
      signIn: "/auth/signin", // Redirect to sign-in page if not authorized
    },
  }
)

// Configure the matcher to exclude /auth and /api/auth routes
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /auth*
     * - /api/auth*
     */
    "/((?!auth|api/auth).*)",
  ],
}
