"use client"

import React, { useState, useEffect } from "react"
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
  const [inputValue, setInputValue] = useState<string>(
    number !== undefined ? number.toString() : ""
  )

  useEffect(() => {
    console.log(number?.toString(), inputValue)
    const inputValueNum = integer ? parseInt(inputValue, 10) : parseFloat(inputValue)
    if (number !== undefined && (inputValueNum > number || inputValueNum < number)) {
      setInputValue(number.toString())
    } else if (number === undefined && inputValue !== "") {
      setInputValue("")
    }
    console.log("number state", number)
  }, [number, inputValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const regex = integer
      ? positive
        ? /^\d*$/
        : /^-?\d*$/
      : positive
        ? /^\d*\.?\d*$/
        : /^-?\d*\.?\d*$/

    if (regex.test(value)) {
      setInputValue(value)

      if (value !== "" && value !== "-" && value !== "." && value !== "-.") {
        const num = integer ? parseInt(value, 10) : parseFloat(value)
        console.log(num)
        if (!isNaN(num)) {
          let validatedNum = num
          if (positive && validatedNum < 0) validatedNum = 0
          if (minValue !== undefined && validatedNum < minValue) validatedNum = minValue
          if (maxValue !== undefined && validatedNum > maxValue) validatedNum = maxValue
          console.log(validatedNum)
          setNumber(validatedNum)
          return
        }
      }

      setNumber(undefined)
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
      value={inputValue}
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
