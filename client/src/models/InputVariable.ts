import { z } from "zod"

const InputVariable = z.object({
  name: z.string(),
})

export { InputVariable }
