"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material"
import CodeInput from "@/components/CodeInput/CodeInput"
import { useState, useEffect } from "react"

interface CodeTypeFormProps {
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
  extension: "python" | "javascript"
  sx?: SxProps
}

const CodeTypeForm: React.FC<CodeTypeFormProps> = ({ value, setValue, extension, sx }) => {
  const pythonDefault = `# Define logic for your assertion by writing a script that either returns True or False depending on if the assertion is met
# the 'output' variable is injected which holds the Provider response as a string
if output:
    return True
else:
    return False
`

  const javascriptDefault = `// Define logic for your assertion by writing a script that either returns true or false depending on if the assertion is met
// the 'output' variable is injected which holds the Provider response as a string
if (output) {
  return true
} else {
  return false
}
`
  const [defaultVal, setDefaultVal] = useState(
    extension === "python" ? pythonDefault : extension === "javascript" ? javascriptDefault : ""
  )

  useEffect(
    () =>
      setDefaultVal(
        extension === "python" ? pythonDefault : extension === "javascript" ? javascriptDefault : ""
      ),
    [extension, javascriptDefault, pythonDefault]
  )

  return (
    <>
      <Typography>Value</Typography>
      <CodeInput
        extension={extension}
        value={typeof value === "string" ? (value !== "" ? value : defaultVal) : defaultVal}
        onChange={(value) => {
          setValue(value)
          setDefaultVal("")
        }}
        sx={sx}
      ></CodeInput>
    </>
  )
}

export default CodeTypeForm
