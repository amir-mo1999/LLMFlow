import { TestCaseInput, Assertion } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import AssertionsOverview from "./AssertionsOverview"
import theme from "@/theme"
import AssertionsForm from "./AIFunctionForm/AssertionsForm.tsx/AssertionsForm"
import IconButton from "@mui/material/IconButton"
import ClearIcon from "@mui/icons-material/Clear"
import InputVariableOverview from "./InputVariableOverview"
import Divider from "@mui/material/Divider"

interface TestCaseCardProps {
  testCase: TestCaseInput
  displayOnly?: boolean
  sx?: SxProps
  onClickVars?: () => void
  setAssertions?: (assertions: Assertion[]) => void
  onDelete?: () => void
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
  testCase,
  displayOnly = false,
  sx,
  onClickVars = () => {},
  setAssertions = () => {},
  onDelete = () => {},
}) => {
  return (
    <Box
      sx={{
        marginBottom: 2,
        position: "relative",
        borderRadius: 1,
        borderWidth: 1,
        borderColor: theme.palette.primary.main,
        paddingX: 2,
        paddingTop: 1,
        paddingBottom: 1.5,
        ...sx,
      }}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        size="small"
        sx={{
          display: displayOnly ? "none" : "normal",
          position: "absolute",
          top: 1,
          right: 1,
          color: theme.palette.primary.main,
        }}
      >
        <ClearIcon />
      </IconButton>
      {/* Variables Section */}
      <Box sx={{ mb: 2 }} onClick={() => onClickVars()}>
        <Typography variant="h6">Variables</Typography>
        <InputVariableOverview
          vars={testCase.vars}
          displayOnly={displayOnly}
        ></InputVariableOverview>
      </Box>
      <Divider />
      {/* Assertions Section */}
      <Box>
        <Box sx={{ mt: 1 }}>
          {testCase.assert && testCase.assert !== null ? (
            displayOnly ? (
              <Box>
                <Typography variant="h6" marginBottom={1}>
                  Assertions
                </Typography>
                <AssertionsOverview assertions={testCase.assert} displayOnly />
              </Box>
            ) : (
              <AssertionsForm
                assertions={testCase.assert}
                setAssertions={setAssertions}
                headerVariant="h6"
              />
            )
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  )
}
export default TestCaseCard
