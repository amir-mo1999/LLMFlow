import { z } from "zod"

const OutputAssertion = z.object({
  type: z.union([z.literal("contains"), z.literal("contains-sql"), z.literal("")]),
  value: z.string(),
  weight: z.number(),
})

export default OutputAssertion
