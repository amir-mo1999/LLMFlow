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
import { splitArrayIntoChunks } from "@/utils"
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
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column", ...sx }}>
      {splitArrayIntoChunks(assertions, 4).map((assertionsChunk, chunkIndx) => {
        return (
          <Box
            key={chunkIndx}
            sx={{
              display: "flex",
              width: "100%",
              gap: 2,
              paddingBottom: 2,
              height: 150,
            }}
          >
            {assertionsChunk.map((assertion, indx) => {
              return (
                <Paper
                  key={indx}
                  onClick={() => onClick(chunkIndx * 4 + indx)}
                  sx={{
                    width: "20%",
                    padding: 1,
                    position: "relative",
                    overflow: "auto",
                    overflowX: "hidden",
                    "&:hover": {
                      backgroundColor: displayOnly ? "white" : "inherit",
                    },
                  }}
                  elevation={2}
                >
                  <Typography>{assertion.type}</Typography>
                  {!assertion.threshold ? (
                    <></>
                  ) : (
                    <>
                      <Typography noWrap>
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
                              <ListItemText primaryTypographyProps={{ noWrap: true }}>
                                • {val}
                              </ListItemText>
                            </ListItem>
                          )
                        })}
                      </List>
                    </>
                  ) : (
                    <>
                      <Typography noWrap>
                        <strong>Value: {JSON.stringify(assertion.value)}</strong>
                      </Typography>
                    </>
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(chunkIndx * 4 + indx)
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
      })}
    </Box>
  )
}

export default AssertionsOverview
