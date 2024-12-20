import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Project } from "@/api/apiSchemas"
import { UserChip, NumberChip, DateChip, ItemTypeChip } from "@/components"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"

interface ProjectPaperProps {
  sx?: SxProps
  project: Project
  onClick?: () => void
  selected?: boolean
}

const ProjectPaper: React.FC<ProjectPaperProps> = ({ sx, onClick, project, selected = false }) => {
  const renderFigures = () => {
    const nAIFunctions = project.api_routes.length

    return (
      <Stack direction="row" spacing={2} mb={1}>
        <NumberChip
          number={nAIFunctions}
          label={nAIFunctions === 1 ? "AI Function" : "AI Functions"}
        />
      </Stack>
    )
  }
  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        backgroundColor: selected ? "#E8E3F2" : "white",
        width: "100%",
        paddingX: 2,
        paddingTop: 1,
        paddingBottom: 1.5,
        maxHeight: 150,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: 1, maxWidth: "80%" }}>
          <ItemTypeChip itemType="Project" />
          <Tooltip title={project.name} placement="top">
            <Typography
              variant="h6"
              noWrap
              sx={{ whiteSpace: "noWrap", textOverflow: "ellipsis" }}
              maxHeight={50}
            >
              {project.name}
            </Typography>
          </Tooltip>
        </Box>

        <DateChip isoString={project.creation_time} />
      </Box>
      <UserChip username={project.username} sx={{ marginRight: 10000, mb: 1 }} />
      <Typography
        sx={{
          display: "-webkit-box",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          mb: 1,
        }}
      >
        {project.description}
      </Typography>

      {renderFigures()}
    </Paper>
  )
}

export default ProjectPaper
