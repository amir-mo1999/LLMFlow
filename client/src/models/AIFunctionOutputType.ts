import { z } from "zod"

const AIFunctionOutputType = z.enum(["numeric", "string", "audio_file", "image_file"])

export { AIFunctionOutputType }
