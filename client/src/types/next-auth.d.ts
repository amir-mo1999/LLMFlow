import NextAuth, { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import DecodedToken from "./DecodedTokenT"
import { UserWithAccessToken } from "@/api/apiSchemas"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends JWT {
    accessToken: string | undefined
    refreshToken: string | undefined
    accessTokenExpires: number | undefined
    user: User | undefined
  }
}
