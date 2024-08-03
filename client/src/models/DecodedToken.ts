import * as z from "zod"

const DecodedToken = z.object({
  exp: z.number(),
  iat: z.number(),
  jti: z.string(),
  sub: z.string(),
})

export { DecodedToken }
