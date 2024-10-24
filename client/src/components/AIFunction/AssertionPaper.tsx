import { Assertion } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ClearIcon from "@mui/icons-material/Clear"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import theme from "@/theme"
import Divider from "@mui/material/Divider"

interface AssertionPaperProps {
  assertion: Assertion
  onClick?: () => void
  onDelete?: () => void
  displayOnly?: boolean
  sx?: SxProps
}

const AssertionPaper: React.FC<AssertionPaperProps> = ({
  assertion,
  onClick = () => {},
  onDelete = () => {},
  displayOnly = false,
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
      <Typography fontWeight={700}>{assertion.type}</Typography>
      <Divider sx={{ marginBottom: 1 }} />
      {!assertion.threshold ? (
        <></>
      ) : (
        <>
          <Typography>
            <strong>Threshold: </strong>
            {assertion.threshold}
          </Typography>
        </>
      )}
      {!assertion.value ? (
        <></>
      ) : Array.isArray(assertion.value) ? (
        <>
          <Typography>Values</Typography>
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
          <Typography>Value</Typography>
          <Typography>{assertion.value as string}</Typography>
        </>
      )}
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
    </Paper>
  )
}

export default AssertionPaper
