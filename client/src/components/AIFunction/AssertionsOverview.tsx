import { Assertion } from "@/api/apiSchemas"
import React from "react"
import { SxProps } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import ListItemIcon from "@mui/material/ListItemIcon"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import { splitArrayIntoChunks } from "@/utils"
import { StringXor } from "next/dist/compiled/webpack/webpack"
import theme from "@/theme"

interface AssertionsOverviewProps {
  assertions: Assertion[]
  mode?: "form" | "edit" | "display"
  sx?: SxProps
  onClick?: (indx: number) => void
  onDelete?: (indx: number) => void
}

const AssertionsOverview: React.FC<AssertionsOverviewProps> = ({
  assertions,
  sx,
  mode = "display",
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
                    borderRadius: 2,
                    padding: 1,
                    position: "relative",
                    overflow: "auto",
                    overflowX: "hidden",
                  }}
                  elevation={2}
                >
                  <Typography>{assertion.type}</Typography>
                  {}
                  {assertion.value ? (
                    typeof assertion.value === "string" ? (
                      <>
                        <Typography noWrap>
                          <strong>Value:</strong> {assertion.value}{" "}
                        </Typography>
                      </>
                    ) : (
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
                    )
                  ) : (
                    <></>
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(chunkIndx * 4 + indx)
                    }}
                    size="small"
                    sx={{
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
