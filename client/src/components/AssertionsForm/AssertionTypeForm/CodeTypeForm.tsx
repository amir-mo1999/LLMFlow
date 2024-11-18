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
  const pythonDefault = `# Implement your assertion logic as a script that returns 'True' if the result passed the assertion and 'False' otherwise.
# "output" is the raw string response of the Provider, "context" holds test case data and is an AssertContext instance
# class AssertContext(TypedDict):
#   prompt: str
#    vars: Dict[str, str] # Contains input variables as keys and their content as values
#    test: Dict[str, Any] # Contains keys like "vars", "assert", "options"

if output:
    return True
else:
    return False
`

  const javascriptDefault = `// Implement your assertion logic as a script that returns 'true' if the result passed the assertion and 'false' otherwise
// 'output' holds the raw string response of the Provider and 'context' holds the raw prompt and the test case variables and is of type AssertContext

// interface AssertContext {
//    Raw prompt sent to LLM
//    prompt: string;
//    Test case variables
//  vars: Record<string, string | object>;
//  }

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
