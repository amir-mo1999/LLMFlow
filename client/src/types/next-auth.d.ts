import { User } from "next-auth"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends JWT {
    accessToken: string | undefined
    refreshToken: string | undefined
    accessTokenExpires: number | undefined
    user: User | undefined
  }
}
