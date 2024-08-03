import * as z from "zod"
import { DecodedToken } from "@/models"

type DecodedTokenT = z.infer<typeof DecodedToken>

export type { DecodedTokenT }
