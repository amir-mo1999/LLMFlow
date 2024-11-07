"use client"
import { Assertion } from "@/api/apiSchemas"
import Typography from "@mui/material/Typography"
import NumberInput from "@/components/NumberInput/NumberInput"

interface ThresholdTypeFormProps {
  threshold: Assertion["threshold"]
  setThreshold: React.Dispatch<React.SetStateAction<Assertion["threshold"]>>
  maxValue?: number
  minValue?: number
}

const ThresholdTypeForm: React.FC<ThresholdTypeFormProps> = ({
  threshold,
  setThreshold,
  maxValue,
  minValue,
}) => {
  return (
    <>
      <Typography>Threshold</Typography>
      <NumberInput
        number={threshold ? threshold : 0}
        setNumber={setThreshold}
        maxValue={maxValue}
        minValue={minValue}
      ></NumberInput>
    </>
  )
}

export default ThresholdTypeForm
