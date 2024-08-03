import * as z from "zod"

const UserCredentials = z.object({
  username: z.string() || z.undefined,
  password: z.string() || z.undefined,
})

export { UserCredentials }
