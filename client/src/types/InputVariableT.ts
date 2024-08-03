import { z } from "zod"
import { InputVariable } from "@/models"

type InputVariableT = z.infer<typeof InputVariable>

export type { InputVariableT }
