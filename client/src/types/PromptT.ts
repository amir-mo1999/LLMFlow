import { Prompt } from "@/models"
import z from "zod"

type PromptT = z.infer<typeof Prompt>

export type { PromptT }
