import { TestCaseInput, Assertion } from "@/api/apiSchemas"
import { SxProps } from "@mui/material"
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import ClearIcon from "@mui/icons-material/Clear"
import Divider from "@mui/material/Divider"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NumberChip } from "@/components"
import { useTheme } from "@mui/material"
import Grid from "@mui/material/Grid"

import { InputVariableOverview, AssertionsOverview, AssertionsForm } from "@/components"

interface TestCaseCardProps {
  testCase: TestCaseInput
  indx: number
  displayOnly?: boolean
  sx?: SxProps
  onClickVars?: () => void
  setAssertions?: (_: Assertion[]) => void
  onDelete?: () => void
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
  testCase,
  indx,
  displayOnly = false,
  sx,
  onClickVars = () => {},
  setAssertions = () => {},
  onDelete = () => {},
}) => {
  const [open, setOpen] = useState(false)
  const handleCollapse = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  return (
    <Box
      sx={{
        borderRadius: 1,
        borderWidth: 1,
        borderColor: theme.palette.primary.main,
        paddingX: 2,
        paddingY: 1,
        ...sx,
      }}
    >
      <Grid
        container
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "space-between", width: "100%", mt: 0 }}
      >
        <Grid>
          <Typography sx={{ color: theme.palette.primary.main }} variant="h6">
            # {indx}
          </Typography>
        </Grid>
        <Grid>
          <IconButton onClick={handleCollapse}>
            {open ? <ExpandLessIcon fontSize="medium" /> : <ExpandMoreIcon fontSize="medium" />}
          </IconButton>
        </Grid>
        {testCase.assert && (
          <Grid xs={2}>
            <NumberChip
              number={testCase.assert.length}
              label={testCase.assert.length === 1 ? "Assertion" : "Assertions"}
            />
          </Grid>
        )}
        <Grid xs></Grid>
        <Grid>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            size="small"
            sx={{
              display: displayOnly ? "none" : "normal",
              color: theme.palette.primary.main,
              marginLeft: "auto",
            }}
          >
            <ClearIcon sx={{ marginLeft: "auto" }} />
          </IconButton>
        </Grid>
      </Grid>

      <Collapse in={open}>
        <Box sx={{ my: 1 }}>
          <Divider />

          {/* Variables Section */}
          <Box sx={{ mb: 2 }} onClick={() => onClickVars()}>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Variables
            </Typography>
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
      </Collapse>
    </Box>
  )
}
export default TestCaseCard
