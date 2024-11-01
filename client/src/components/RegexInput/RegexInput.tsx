// src/RegexInput.tsx

import React, { useEffect, useState } from "react"
import { TextField, TextFieldProps } from "@mui/material"

interface RegexInputProps {
  pattern?: string
  setPattern: (pattern: string) => void
  setError: (error: boolean) => void
  showError?: boolean
  variant?: TextFieldProps["variant"]
  size?: TextFieldProps["size"]
  disabled?: boolean
  sx?: TextFieldProps["sx"]
}

const RegexInput: React.FC<RegexInputProps> = ({
  pattern,
  setPattern,
  setError,
  showError = false,
  variant = "outlined",
  size = "medium",
  disabled = false,
  sx,
}) => {
  const [inputValue, setInputValue] = useState<string>(pattern || "")
  const [isValid, setIsValid] = useState<boolean>(true)

  useEffect(() => {
    setInputValue(pattern || "")
  }, [pattern])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    setPattern(value)

    if (value === "") {
      setIsValid(true)
      setError(false)
      return
    }

    try {
      new RegExp(value)
      setIsValid(true)
      setError(false)
    } catch (e) {
      setIsValid(false)
      setError(true)
    }
  }

  return (
    <TextField
      placeholder="\d+(\.\d\d)?"
      variant={variant}
      size={size}
      sx={sx}
      value={inputValue}
      onChange={handleChange}
      error={!isValid && showError}
      helperText={!isValid && showError ? "Invalid regex pattern" : ""}
      disabled={disabled}
      fullWidth
    />
  )
}

export default RegexInput
