import { z } from "zod"
import { InputVariable } from "./InputVariable"
import { OutputConstraints } from "./InputOutputConstraints"
import { AIFunctionOutputType } from "./AIFunctionOutputType"

const AIFunctionRouteInput = z.object({
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
  output_type: AIFunctionOutputType,
  output_constraints: OutputConstraints,
  example_dataset: z.array(z.record(z.union([z.number(), z.string()]))),
})

const AIFunction = z.object({
  _id: z.string(),
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(1000),
  input_variables: z.array(InputVariable),
  output_type: AIFunctionOutputType,
  output_constraints: OutputConstraints,
  example_dataset: z.array(z.record(z.union([z.number(), z.string()]))),
})

export { AIFunctionRouteInput, AIFunction }
