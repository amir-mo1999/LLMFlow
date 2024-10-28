"use client"

import { StringSchema, NumberSchema, ArraySchema, ObjectSchema } from "../FieldRow"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { useState, useEffect } from "react"
import NumberInput from "@/components/NumberInput"
import RegexInput from "@/components/RegexInput"
import { max } from "lodash"

interface StringDialogProps {
  stringSettings: StringSchema
  onSubmit: (settings: StringSchema | NumberSchema | ArraySchema | ObjectSchema) => void
  onClose: () => void
  open: boolean
  displayOnly?: boolean
}
const StringDialog: React.FC<StringDialogProps> = ({
  stringSettings,
  onSubmit,
  onClose,
  open,
  displayOnly = false,
}) => {
  const [settings, setSettings] = useState<StringSchema>({})
  const [minLength, setMinLength] = useState<number>()
  const [maxLength, setMaxLength] = useState<number>()
  const [pattern, setPattern] = useState<string>()
  const [patternError, setPatternError] = useState(false)
  const [showPatternError, setShowPatternError] = useState(false)

  useEffect(() => {
    const newSettings: StringSchema = {}

    if (minLength !== undefined) newSettings.minLength = minLength
    if (maxLength !== undefined) newSettings.maxLength = maxLength
    if (pattern !== undefined && pattern !== "") newSettings.pattern = pattern
    console.log("setting settings")
    setSettings(newSettings)
  }, [minLength, maxLength, pattern])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box>
          <Typography variant="h6" gutterBottom>
            Advanced Settings
          </Typography>
          <Stack direction="column" gap={1}>
            <Box>
              <Typography>Min Length</Typography>
              <NumberInput number={minLength} setNumber={setMinLength}></NumberInput>
            </Box>
            <Box>
              <Typography>Max Length</Typography>
              <NumberInput number={maxLength} setNumber={setMaxLength}></NumberInput>
            </Box>
            <Box>
              <Typography>Pattern</Typography>
              <RegexInput
                pattern={pattern}
                setPattern={setPattern}
                setError={setPatternError}
                showError={showPatternError}
              ></RegexInput>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => {
            if (patternError) {
              setShowPatternError(true)
            } else {
              console.log(settings)
              onSubmit(settings)
            }
          }}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StringDialog
