import { Prompt, PromptRouteInput } from "@/models"
import z from "zod"

type PromptT = z.infer<typeof Prompt>
type PromptRouteInputT = z.infer<typeof PromptRouteInput>

export type { PromptT, PromptRouteInputT }
