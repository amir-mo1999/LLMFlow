import { z } from "zod"
import { AIFunctionRouteInput, AIFunction } from "@/models"

type AIFunctionRouteInputT = z.infer<typeof AIFunctionRouteInput>
type AIFunctionT = z.infer<typeof AIFunctionRouteInput>
export type { AIFunctionRouteInputT, AIFunctionT }
