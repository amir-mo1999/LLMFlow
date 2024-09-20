"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"

interface StringTypeFormProps {
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
}

const StringTypeForm: React.FC<StringTypeFormProps> = ({ value, setValue }) => {
  return (
    <>
      <Typography>Value</Typography>
      <TextField value={value ? value : ""} onChange={(e) => setValue(e.target.value)} />
    </>
  )
}

export default StringTypeForm
