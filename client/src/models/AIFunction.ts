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
const AIFunction = AIFunctionRouteInput.extend({
  number_of_prompts: z.number().nonnegative(),
  username: z.string().email(),
  creation_time: z.string().refine(
    (val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    },
    {
      message: "Invalid datetime format",
    }
  ),
})

export { AIFunctionRouteInput, AIFunction }
