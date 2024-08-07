import z from "zod"

const Prompt = z
  .object({
    promptType: z.union([z.literal("single_shot"), z.literal("chat")]).default("single_shot"),
    content: z
      .union([
        z.string(),
        z.record(
          z.union([z.literal("system"), z.literal("user"), z.literal("assistant")]),
          z.string()
        ),
      ])
      .default(""),
  })
  .refine(
    (data) => {
      if (data.promptType === "single_shot") {
        return typeof data.content === "string"
      }
      if (data.promptType === "chat") {
        return typeof data.content === "object" && !Array.isArray(data.content)
      }
      return false
    },
    {
      message: "Content type does not match the promptType",
      path: ["content"],
    }
  )

export default Prompt
