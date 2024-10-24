import { Assertion } from "@/api/apiSchemas"
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
import { NumberChip } from "../Chips"
import Chip from "@mui/material/Chip"

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
  return (
    <Paper
      onClick={onClick}
      sx={{
        ...sx,
        minWidth: "20%",
        padding: 1,
        maxHeight: 210,
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
      <Box display="flex" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontWeight={700} align="center">
          {assertion.type}
        </Typography>
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
          <Typography>{assertion.value as string}</Typography>
        </>
      )}
    </Paper>
  )
}

export default AssertionPaper
