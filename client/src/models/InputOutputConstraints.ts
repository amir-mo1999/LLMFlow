// Importing Zod library
import { z } from "zod"

// constraints for string input
const StringInputConstraints = z.object({
  type: z.literal("string").default("string"),
  max_char_length: z.number().default(1000),
  min_char_length: z.number().default(0),
})

// constraints for numeric input
const NumericInputConstraints = z.object({
  type: z.literal("numeric").default("numeric"),
  accept_float: z.boolean().default(false),
  max_value: z.number().default(1000),
  min_value: z.number().default(0),
})

// constraints for image file input
const ImageFileInputConstraints = z.object({
  type: z.literal("image_file").default("image_file"),
  max_file_size: z.number().default(2),
  min_width: z.number().default(0),
  max_width: z.number().default(1920),
  min_height: z.number().default(0),
  max_height: z.number().default(1080),
})

// constraints for audio file input
const AudioFileInputConstraints = z.object({
  type: z.literal("audio_file").default("audio_file"),
  max_file_size: z.number().default(2),
  min_length: z.number().default(0),
  max_length: z.number().default(300),
})

const InputConstraints = z.union([
  StringInputConstraints,
  NumericInputConstraints,
  ImageFileInputConstraints,
  AudioFileInputConstraints,
])

// export the input objects
export {
  StringInputConstraints,
  NumericInputConstraints,
  ImageFileInputConstraints,
  AudioFileInputConstraints,
  InputConstraints,
}

// define output objects
const StringOutputConstraints = StringInputConstraints
const NumericOutputConstraints = NumericInputConstraints
const ImageFileOutputConstraints = ImageFileInputConstraints
const AudioFileOutputConstraints = AudioFileInputConstraints

const OutputConstraints = z.union([
  StringOutputConstraints,
  NumericOutputConstraints,
  ImageFileOutputConstraints,
  AudioFileOutputConstraints,
])

// export the output objects
export {
  StringOutputConstraints,
  NumericOutputConstraints,
  ImageFileOutputConstraints,
  AudioFileOutputConstraints,
  OutputConstraints,
}
