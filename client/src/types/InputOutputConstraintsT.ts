import {
  StringInputConstraints,
  NumericInputConstraints,
  ImageFileInputConstraints,
  AudioFileInputConstraints,
  StringOutputConstraints,
  NumericOutputConstraints,
  ImageFileOutputConstraints,
  AudioFileOutputConstraints,
  InputConstraints,
  OutputConstraints,
} from "@/models"
import { z } from "zod"

// Export input constraints types
export type StringInputConstraintsT = z.infer<typeof StringInputConstraints>
export type NumericInputConstraintsT = z.infer<typeof NumericInputConstraints>
export type AudioFileInputConstraintsT = z.infer<typeof AudioFileInputConstraints>
export type ImageFileInputConstraintsT = z.infer<typeof ImageFileInputConstraints>

export type InputConstraintsT = z.infer<typeof InputConstraints>

// export output constraints types
export type StringOutputConstraintsT = z.infer<typeof StringOutputConstraints>
export type NumericOutputConstraintsT = z.infer<typeof NumericOutputConstraints>
export type ImageFileOutputConstraintsT = z.infer<typeof ImageFileOutputConstraints>
export type AudioFileOutputConstraintsT = z.infer<typeof AudioFileOutputConstraints>

export type OutputConstraintsT = z.infer<typeof OutputConstraints>
