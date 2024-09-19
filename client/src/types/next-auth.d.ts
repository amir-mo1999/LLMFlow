import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import DecodedToken from "./DecodedTokenT"
import { UserWithAccessToken } from "@/api/apiSchemas"

declare module "next-auth" {
  interface User extends UserWithAccessToken {}

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
