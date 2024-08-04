import { z } from "zod"
import { InputVariable } from "."

const AIFunctionRouteInput = z.object({
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
})

const AIFunction = z.object({
  _id: z.string(),
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
})

export { AIFunctionRouteInput, AIFunction }
