"use client"
import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import {
  useEvaluate,
  useDeleteAiFunction,
  useGetPrompts,
  useDeletePrompt,
} from "@/api/apiComponents"
import { PromptOverview } from "../Prompt"
import { useRouter } from "next/navigation"
import { AIFunction } from "@/api/apiSchemas"

interface AIFunctionSingleOverviewProps {
  onDeleteAIFunction: (indx: number) => void
  aiFunction: AIFunction
  selectedAIFunctionIndx: number
  setSelectedAIFunctionIndx: React.Dispatch<React.SetStateAction<number | undefined>>
}

const AIFunctionSingleOverview: React.FC<AIFunctionSingleOverviewProps> = ({
  onDeleteAIFunction,
  aiFunction,
  selectedAIFunctionIndx,
  setSelectedAIFunctionIndx,
}) => {
  const router = useRouter()

  const [showAllAssertions, setShowAllAssertions] = useState(false)
  const [showAllTestCases, setShowAllTestCases] = useState(false)
  const [expandedTestCases, setExpandedTestCases] = useState<{ [key: number]: boolean }>({})

  const { refetch: refetchPrompts } = useGetPrompts({
    pathParams: { aiFunctionId: aiFunction._id as string },
  })

  const { data: prompts } = useGetPrompts({
    pathParams: { aiFunctionId: aiFunction._id as string },
  })

  const { mutate: evaluate } = useEvaluate({
    onSuccess: (response) => {
      refetchPrompts()
    },
    onError: (err) => {
      console.log("error status", err)
    },
  })

  const { mutate: deletePrompt } = useDeletePrompt({
    onSuccess: () => {
      refetchPrompts()
    },
  })

  const onDeletePrompt = (promptID: string) => {
    deletePrompt({ pathParams: { promptId: promptID } })
  }

  const { mutate: deleteAIFunction } = useDeleteAiFunction({
    onSuccess: () => {
      router.push("/ai-functions")
    },
  })

  const onClickDelete = () => {
    onDeleteAIFunction(selectedAIFunctionIndx)
    setSelectedAIFunctionIndx(undefined)
    deleteAIFunction({ pathParams: { aiFunctionId: aiFunction._id as string } })
  }

  const evaluatePrompts = (evaluateAll: boolean = false) => {
    prompts?.forEach((prompt) => {
      if (!prompt.last_eval || evaluateAll) {
        evaluate({ pathParams: { promptId: prompt._id as string } })
      }
    })
  }

  useEffect(evaluatePrompts, [prompts?.length])

  const toggleAssertions = () => {
    setShowAllAssertions((prev) => !prev)
  }

  const toggleTestCases = () => {
    setShowAllTestCases((prev) => !prev)
  }

  const toggleTestCase = (index: number) => {
    setExpandedTestCases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const MAX_VISIBLE_ASSERTIONS = 2
  const MAX_VISIBLE_TEST_CASES = 2

  if (!aiFunction) {
    return <></>
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* AI Function Name */}
      <Typography variant="h4" gutterBottom>
        {aiFunction.name}
      </Typography>
      {/* Description */}
      <Typography variant="body1" gutterBottom>
        {aiFunction.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {/* Input Variables */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Input Variables</Typography>
        <List>
          {aiFunction.input_variables.map((input, index) => (
            <ListItem key={index}>
              <ListItemText primary={input.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Output Assertions */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Output Assertions</Typography>
        {aiFunction.assert.length === 0 ? (
          <Typography variant="body2">No output assertions defined.</Typography>
        ) : (
          <List>
            {aiFunction.assert
              .slice(0, showAllAssertions ? aiFunction.assert.length : MAX_VISIBLE_ASSERTIONS)
              .map((assertion, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <>
                        <Typography>Type: {assertion.type}</Typography>
                        {<Typography>Value: {assertion.value as string}</Typography>}
                        {assertion.threshold !== null && assertion.threshold !== undefined && (
                          <Typography>Threshold: {assertion.threshold}</Typography>
                        )}
                        {assertion.weight !== null && assertion.weight !== undefined && (
                          <Typography>Weight: {assertion.weight}</Typography>
                        )}
                        {assertion.metric && <Typography>Metric: {assertion.metric}</Typography>}
                      </>
                    }
                  />
                </ListItem>
              ))}
            {aiFunction.assert.length > MAX_VISIBLE_ASSERTIONS && (
              <Button
                onClick={toggleAssertions}
                startIcon={showAllAssertions ? <ExpandLess /> : <ExpandMore />}
              >
                {showAllAssertions ? "Show Less" : "Show More"}
              </Button>
            )}
          </List>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Test Cases */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Test Cases</Typography>
        {aiFunction.test_cases.length === 0 ? (
          <Typography variant="body2">No test cases defined.</Typography>
        ) : (
          <List>
            {aiFunction.test_cases
              .slice(0, showAllTestCases ? aiFunction.test_cases.length : MAX_VISIBLE_TEST_CASES)
              .map((testCase, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <ListItem button onClick={() => toggleTestCase(index)}>
                    <ListItemText primary={`Test Case ${index + 1}`} />
                    {expandedTestCases[index] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={expandedTestCases[index]} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      {/* Variables */}
                      <Typography variant="subtitle1">Variables:</Typography>
                      <List>
                        {Object.entries(testCase.vars).map(([key, value], idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={`${key}: ${value}`} />
                          </ListItem>
                        ))}
                      </List>

                      {/* Assertions */}
                      <Typography variant="subtitle1">Assertions:</Typography>
                      {testCase.assert === null ? (
                        <Typography variant="body2">No assertions for this test case.</Typography>
                      ) : (
                        <List>
                          {testCase.assert.map((assertion, aIdx) => (
                            <ListItem key={aIdx}>
                              <ListItemText
                                primary={`Type: ${assertion.type}`}
                                secondary={
                                  <>
                                    {assertion.value && (
                                      <Typography>Value: {assertion.value as string}</Typography>
                                    )}
                                    {assertion.threshold !== null &&
                                      assertion.threshold !== undefined && (
                                        <Typography>Threshold: {assertion.threshold}</Typography>
                                      )}
                                    {assertion.weight !== null &&
                                      assertion.weight !== undefined && (
                                        <Typography>Weight: {assertion.weight}</Typography>
                                      )}
                                    {assertion.metric && (
                                      <Typography>Metric: {assertion.metric}</Typography>
                                    )}
                                  </>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            {aiFunction.test_cases.length > MAX_VISIBLE_TEST_CASES && (
              <Button
                onClick={toggleTestCases}
                startIcon={showAllTestCases ? <ExpandLess /> : <ExpandMore />}
              >
                {showAllTestCases ? "Show Less" : "Show More"}
              </Button>
            )}
          </List>
        )}
      </Box>
      {/* Prompts Overview */}
      {prompts && <PromptOverview prompts={prompts} onDeletePrompt={onDeletePrompt} />}

      {/* Add prompt button */}
      <Button
        variant="contained"
        onClick={() => router.push(("/create/prompt/" + aiFunction._id) as string)}
      >
        Add Prompt
      </Button>
      <Divider></Divider>
      <Button variant="contained" onClick={onClickDelete}>
        Delete AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionSingleOverview
