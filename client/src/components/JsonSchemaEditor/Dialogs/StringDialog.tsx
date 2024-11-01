"use client"

import { StringSchema, NumberSchema, ArraySchema, ObjectSchema } from "../FieldRow"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { useState, useEffect } from "react"
import NumberInput from "@/components/NumberInput/NumberInput"
import RegexInput from "@/components/RegexInput/RegexInput"

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
  const [minLength, setMinLength] = useState<number | undefined>(
    stringSettings.minLength || undefined
  )
  const [maxLength, setMaxLength] = useState<number | undefined>(
    stringSettings.maxLength || undefined
  )
  const [pattern, setPattern] = useState<string | undefined>(stringSettings.pattern || undefined)
  const [patternError, setPatternError] = useState(false)
  const [showPatternError, setShowPatternError] = useState(false)

  useEffect(() => {
    setMinLength(stringSettings.minLength || undefined)
    setMaxLength(stringSettings.maxLength || undefined)
    setPattern(stringSettings.pattern || undefined)
  }, [stringSettings])

  useEffect(() => {
    const newSettings: StringSchema = {}

    if (minLength !== undefined) newSettings.minLength = minLength
    if (maxLength !== undefined) newSettings.maxLength = maxLength
    if (pattern !== undefined && pattern !== "") newSettings.pattern = pattern
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
              <NumberInput
                number={minLength}
                setNumber={setMinLength}
                disabled={displayOnly ? true : false}
              ></NumberInput>
            </Box>
            <Box>
              <Typography>Max Length</Typography>
              <NumberInput
                number={maxLength}
                setNumber={setMaxLength}
                disabled={displayOnly ? true : false}
              ></NumberInput>
            </Box>
            <Box>
              <Typography>Pattern</Typography>
              <RegexInput
                pattern={pattern}
                setPattern={setPattern}
                setError={setPatternError}
                showError={showPatternError}
                disabled={displayOnly ? true : false}
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
