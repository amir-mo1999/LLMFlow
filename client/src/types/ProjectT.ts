import { z } from "zod"
import { Project } from "@/models"

type ProjectT = z.infer<typeof Project>

export type { ProjectT }
