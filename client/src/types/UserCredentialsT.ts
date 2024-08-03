import * as z from "zod"
import { UserCredentials } from "@/models"

type UserCredentialsT = z.infer<typeof UserCredentials>

export type { UserCredentialsT }
