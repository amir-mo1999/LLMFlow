import { Assertion } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ClearIcon from "@mui/icons-material/Clear"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import theme from "@/theme"

interface AssertionsOverviewProps {
  assertions: Assertion[]
  displayOnly?: boolean
  sx?: SxProps
  onClick?: (indx: number) => void
  onDelete?: (indx: number) => void
}

const AssertionsOverview: React.FC<AssertionsOverviewProps> = ({
  assertions,
  sx,
  displayOnly = false,
  onClick = () => {},
  onDelete = () => {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxHeight: 390,
        pb: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        overflow: "auto",
        ...sx,
      }}
    >
      {assertions.map((assertion, indx) => {
        return (
          <Paper
            key={indx}
            onClick={() => onClick(indx)}
            sx={{
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
            <Typography>{assertion.type}</Typography>
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
                <Typography>
                  <strong>Values:</strong>
                </Typography>
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
                  <strong>Value: </strong> {assertion.value as string}
                </Typography>
              </>
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onDelete(indx)
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
      })}
    </Box>
  )
}

export default AssertionsOverview
