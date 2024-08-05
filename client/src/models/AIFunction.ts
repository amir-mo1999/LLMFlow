import { z } from "zod"
import InputVariable from "./InputVariable"
import OutputAssertion from "./OutputAssertion"

const AIFunctionRouteInput = z.object({
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
  output_assertions: z.array(OutputAssertion),
  dataset: z.array(z.record(z.string())),
})

const AIFunction = z.object({
  _id: z.string(),
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
  output_assertions: z.array(OutputAssertion),
  dataset: z.array(z.record(z.string())),
})

export { AIFunctionRouteInput, AIFunction }
