"use client"

import React from "react"
import TextField from "@mui/material/TextField"
import { SxProps, Theme } from "@mui/material/styles"

interface NumberInputProps {
  number?: number
  setNumber: (value: number | undefined) => void
  maxValue?: number
  minValue?: number
  integer?: boolean
  variant?: "outlined" | "filled" | "standard"
  size?: "small" | "medium"
  positive?: boolean
  sx?: SxProps<Theme>
  disabled?: boolean
}

const NumberInput: React.FC<NumberInputProps> = ({
  number,
  setNumber,
  maxValue,
  minValue,
  integer = false,
  variant = "outlined",
  size = "medium",
  positive = false,
  disabled = false,
  sx,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Regex to allow only numbers, optional decimal, and minus at start if not positive
    const regex = integer
      ? positive
        ? /^\d*$/
        : /^-?\d*$/
      : positive
        ? /^\d*\.?\d*$/
        : /^-?\d*\.?\d*$/

    if (regex.test(value)) {
      let num: number | undefined = integer ? parseInt(value, 10) : parseFloat(value)

      if (value === "" || value === "-") {
        setNumber(undefined)
        return
      }

      if (isNaN(num)) {
        setNumber(undefined)
        return
      }

      if (positive && num < 0) {
        num = 0
      }

      if (minValue !== undefined && num < minValue) {
        num = minValue
      }

      if (maxValue !== undefined && num > maxValue) {
        num = maxValue
      }

      setNumber(num)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+"].includes(e.key)) {
      e.preventDefault()
    } else if (e.key === "-") {
      if (positive) {
        e.preventDefault()
      } else {
        const input = e.currentTarget
        if (input.selectionStart !== 0) {
          e.preventDefault()
        }
      }
    }
  }

  return (
    <TextField
      type="text"
      value={number !== undefined ? number : ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      variant={variant}
      size={size}
      inputProps={{
        inputMode: "decimal",
        pattern: integer ? "[0-9]*" : "[0-9]*[.,]?[0-9]*",
      }}
      disabled={disabled}
      sx={sx}
    />
  )
}

export default NumberInput
