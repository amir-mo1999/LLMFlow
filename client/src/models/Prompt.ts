import { TwentyZeroMp } from "@mui/icons-material"
import z from "zod"

// Define the role enum
const RoleEnum = z.enum(["system", "user", "assistant"])

// Define the message schema
const Messages = z.object({
  role: RoleEnum,
  content: z.string(),
})

// Define the prompt schema
const PromptRouteInput = z
  .object({
    prompt_type: z.union([z.literal("single_shot"), z.literal("chat")]).default("single_shot"),
    messages: z.array(Messages).default([]),
    ai_function_id: z.string().default(""),
  })
  .refine(
    (data) => {
      if (data.prompt_type === "single_shot") {
        if (data.messages.length === 0) return true
        else if (data.messages.length === 1) return data.messages[0].role === "user"
        else return false
      } else return true
    },
    {
      message:
        "When prompt_type is 'single_shot', messages should contain exactly one message with the role 'user'.",
      path: ["messages"],
    }
  )

const Prompt = z
  .object({
    _id: z.string(),
    prompt_type: z.union([z.literal("single_shot"), z.literal("chat")]).default("single_shot"),
    messages: z.array(Messages).default([]),
    ai_function_id: z.string().default(""),
  })
  .refine(
    (data) => {
      if (data.prompt_type === "single_shot") {
        if (data.messages.length === 0) return true
        else if (data.messages.length === 1) return data.messages[0].role === "user"
        else return false
      } else return true
    },
    {
      message:
        "When prompt_type is 'single_shot', messages should contain exactly one message with the role 'user'.",
      path: ["messages"],
    }
  )

export { PromptRouteInput, Prompt }
