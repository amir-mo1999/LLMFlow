import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import DecodedToken from "./DecodedTokenT"

declare module "next-auth" {
  interface User {
    access_token: string
    email: string
    first_name: string
    last_name: string
    role: string
    _id: string
  }

  interface Session {
    user: User
    decodedToken: DecodedToken
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {
    user: User
    exp: number
    iat: number
    jti: number
    sub: string
  }
}
