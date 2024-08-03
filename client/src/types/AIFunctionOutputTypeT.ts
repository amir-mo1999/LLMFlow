import { AIFunctionOutputType } from "@/models"
import { z } from "zod"

type AIFunctionOutputTypeT = z.infer<typeof AIFunctionOutputType>

export type { AIFunctionOutputTypeT }
