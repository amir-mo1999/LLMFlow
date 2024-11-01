import React from "react"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import { TestCaseInput } from "@/api/apiSchemas"
import { InputVariablePaper } from "@/components"

interface InputVariableOverviewProps {
  vars: TestCaseInput["vars"]
  displayOnly?: boolean
  sx?: SxProps
}

const InputVariableOverview: React.FC<InputVariableOverviewProps> = ({
  vars,
  displayOnly = false,
  sx,
}) => {
  return (
    <Box
      sx={{
        ...sx,
        mt: 1,
        display: "flex",
        width: "100%",
        maxHeight: 390,
        pb: 0.3,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        overflow: "auto",
      }}
    >
      {Object.entries(vars).map(([varName, varContent], varIndex) => (
        <InputVariablePaper
          key={varIndex}
          displayOnly={displayOnly}
          varName={varName}
          content={varContent}
        ></InputVariablePaper>
      ))}
    </Box>
  )
}

export default InputVariableOverview
