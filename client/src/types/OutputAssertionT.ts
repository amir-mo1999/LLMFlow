import { z } from "zod"
import { OutputAssertion } from "@/models"

type OutputAssertionT = z.infer<typeof OutputAssertion>

export type { OutputAssertionT }
