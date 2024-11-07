"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { SxProps } from "@mui/material"
import CodeInput from "@/components/CodeInput/CodeInput"

interface CodeTypeFormProps {
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
  extension: "python" | "javascript"
  sx?: SxProps
}

const CodeTypeForm: React.FC<CodeTypeFormProps> = ({ value, setValue, extension, sx }) => {
  return (
    <>
      <Typography>Value</Typography>
      <CodeInput
        extension={extension}
        value={typeof value === "string" ? value : ""}
        onChange={(value) => setValue(value)}
        sx={sx}
      ></CodeInput>
    </>
  )
}

export default CodeTypeForm
