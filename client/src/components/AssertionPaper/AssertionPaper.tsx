import { Assertion, JsonSchemaInput } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Box from "@mui/material/Box"
import ListItemText from "@mui/material/ListItemText"
import ClearIcon from "@mui/icons-material/Clear"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import theme from "@/theme"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import { NumberChip } from "@/components"
import { parseJsonSchema } from "@/utils"

interface AssertionPaperProps {
  assertion: Assertion
  onClick?: () => void
  onDelete?: () => void
  displayOnly?: boolean
  passed?: boolean
  sx?: SxProps
}

const AssertionPaper: React.FC<AssertionPaperProps> = ({
  assertion,
  onClick = () => {},
  onDelete = () => {},
  displayOnly = false,
  passed,
  sx,
}) => {
  if (assertion.type === "is-json") {
    onClick = () => {}
    displayOnly = true
  }
  return (
    <Paper
      onClick={assertion.type === "is-json" ? () => {} : onClick}
      sx={{
        ...sx,
        minWidth: "20%",
        padding: 1,
        maxHeight: 300,
        height: "auto",
        position: "relative",
        overflow: "auto",
        overflowX: "hidden",
        maxWidth: "100%",
        "&:hover": {
          backgroundColor: displayOnly ? "white" : "",
        },
      }}
      elevation={2}
    >
      <Box display="flex" sx={{ alignItems: "center", gap: 2, flexDirection: "row" }}>
        <Typography fontWeight={700}>{assertion.type}</Typography>
        <NumberChip number={assertion.weight as number} label="Weight" labelFirst />
        {/* Passed Indicator */}
        {passed === undefined ? (
          <></>
        ) : passed ? (
          <Chip size="small" label="Passed" variant="filled" color="success" />
        ) : (
          <Chip size="small" label="Failed" variant="filled" color="error" />
        )}
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          size="small"
          sx={{
            display: displayOnly ? "none" : "normal",
            color: theme.palette.primary.main,
          }}
        >
          <ClearIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 1, mt: 0.5 }} />

      {/* Threshold */}
      {!assertion.threshold ? (
        <></>
      ) : (
        <Box display="flex" sx={{ justifyContent: "center" }}>
          <NumberChip
            sx={{ fontSize: "1rem" }}
            number={assertion.threshold}
            label="Threshold"
            labelFirst
          />
        </Box>
      )}

      {/* Value */}
      {!assertion.value ? (
        <></>
      ) : Array.isArray(assertion.value) ? (
        <>
          <List disablePadding>
            {assertion.value.map((val: string, indx: number) => {
              return (
                <ListItem key={indx} disablePadding>
                  <ListItemText primaryTypographyProps={{ sx: { overflow: "wrap" } }}>
                    • {val}
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </>
      ) : (
        <>
          <Typography>
            {typeof assertion.value === "string"
              ? assertion.value
              : JSON.stringify(
                  displayOnly
                    ? assertion.value
                    : parseJsonSchema(assertion.value as JsonSchemaInput),
                  null,
                  2
                )}
          </Typography>
        </>
      )}
    </Paper>
  )
}

export default AssertionPaper
