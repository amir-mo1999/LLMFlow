"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { SxProps } from "@mui/material"

interface StringTypeFormProps {
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
  sx?: SxProps
}

const StringTypeForm: React.FC<StringTypeFormProps> = ({ value, setValue, sx }) => {
  return (
    <>
      <Typography>Value</Typography>
      <TextField
        sx={sx}
        value={value ? value : ""}
        onChange={(e) => setValue(e.target.value)}
        required
        fullWidth
        multiline
        minRows={2}
        maxRows={8}
      />
    </>
  )
}

export default StringTypeForm
