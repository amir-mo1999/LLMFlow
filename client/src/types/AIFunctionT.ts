import { z } from "zod"
import { AIFunctionRouteInput, AIFunction } from "@/models"

type AIFunctionRouteInputT = z.infer<typeof AIFunctionRouteInput>
type AIFunctionT = z.infer<typeof AIFunction>
export type { AIFunctionRouteInputT, AIFunctionT }
