"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import { SxProps } from "@mui/material"
import RegexInput from "@/components/RegexInput/RegexInput"
import { useState } from "react"

interface RegexTypeFormProps {
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
  sx?: SxProps
}

const RegexTypeForm: React.FC<RegexTypeFormProps> = ({ value, setValue, sx }) => {
  const [error, setError] = useState(false)

  return (
    <>
      <Typography>Value</Typography>
      <RegexInput
        sx={sx}
        setError={setError}
        showError={error ? true : false}
        pattern={value as string}
        setPattern={setValue}
      />
    </>
  )
}

export default RegexTypeForm
