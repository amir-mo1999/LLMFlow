"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"

interface ThresholdTypeFormProps {
  threshold: Assertion["threshold"]
  setThreshold: React.Dispatch<React.SetStateAction<Assertion["threshold"]>>
}

const ThresholdTypeForm: React.FC<ThresholdTypeFormProps> = ({ threshold, setThreshold }) => {
  const onThresholdChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setThreshold(Number(e.target.value))
  }

  return (
    <>
      <Typography>Threshold</Typography>
      <TextField
        type="number"
        value={threshold ? threshold : ""}
        onChange={onThresholdChange}
        fullWidth
      />
    </>
  )
}

export default ThresholdTypeForm
