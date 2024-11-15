import React from "react"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { SxProps } from "@mui/material"
import { Prompt } from "@/api/apiSchemas"
import LinearProgress from "@mui/material/LinearProgress"
import { UserChip, NumberChip, DateChip, TextChip, ItemTypeChip } from "@/components"
import { getEvalAverages } from "@/utils"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"

interface PromptPaperProps {
  sx?: SxProps
  prompt: Prompt
  onClick?: () => void
  selected?: boolean
  disableHover?: boolean
}

const PromptPaper: React.FC<PromptPaperProps> = ({
  sx,
  onClick,
  prompt,
  selected = false,
  disableHover = false,
}) => {
  const numberOfMessages: number = prompt.messages.length

  const renderFigures = () => {
    if (!prompt.evals) {
      return <LinearProgress sx={{ display: prompt.revision_required ? "none" : "normal" }} />
    }
    const [meanScore, totalCost, meanLatency] = getEvalAverages(prompt.evals)

    return (
      <Stack
        direction="row"
        columnGap={2}
        mb={1}
        rowGap={1}
        flexWrap="wrap"
        justifyContent="flex-start"
        alignItems="start"
      >
        <NumberChip
          number={numberOfMessages}
          label={numberOfMessages === 1 ? "Message" : "Messages"}
        />
        <NumberChip labelFirst number={totalCost} label="Cost" unit="$" />
        <NumberChip
          labelFirst
          number={meanScore as number}
          label="Score"
          color={meanScore >= 0.8 ? "success" : meanScore >= 0.4 ? "warning" : "error"}
          variant="filled"
        />
        <NumberChip
          labelFirst
          number={meanLatency as number}
          label="Latency"
          unit="ms"
          sx={{ marginLeft: 0 }}
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
        "&:hover": {
          backgroundColor: disableHover ? "white" : "#E8E3F2",
        },
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 0.5 }}>
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: 1, maxWidth: "80%" }}>
          <ItemTypeChip itemType="Prompt" />
          <Tooltip title={`${prompt.ai_function_name} #${prompt.index}`} placement="top">
            <Typography
              variant="h6"
              noWrap
              sx={{ whiteSpace: "noWrap", textOverflow: "ellipsis" }}
              maxHeight={50}
            >
              {prompt.ai_function_name} #{prompt.index}
            </Typography>
          </Tooltip>
        </Box>

        <DateChip isoString={prompt.creation_time} />
      </Box>
      <Stack direction="row" mb={2} spacing={2}>
        <UserChip username={prompt.username} />
        <TextChip
          sx={{ display: prompt.revision_required ? "normal" : "none" }}
          label="revision required"
          color="warning"
          variant="filled"
        />
      </Stack>

      {renderFigures()}
    </Paper>
  )
}

export default PromptPaper
