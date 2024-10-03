import React from "react"
import TextField from "@mui/material/TextField"
import SearchIcon from "@mui/icons-material/Search"
import InputAdornment from "@mui/material/InputAdornment"
import theme from "@/theme"

interface SearchFieldProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
}

const SearchField: React.FC<SearchFieldProps> = ({ value, setValue, placeholder }) => {
  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      sx={{
        width: 400,
        "& .MuiOutlinedInput-root": {
          borderRadius: "160px",
          backgroundColor: theme.palette.background.paper,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      }}
    ></TextField>
  )
}

export default SearchField
