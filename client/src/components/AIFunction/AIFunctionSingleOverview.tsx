"use client"
import React, { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { useDeleteAiFunction } from "@/api/apiComponents"
import AssertionsOverview from "./AssertionsOverview"
import { AIFunction } from "@/api/apiSchemas"
import Chip from "@mui/material/Chip"

interface AIFunctionSingleOverviewProps {
  onDeleteAIFunction: () => void
  aiFunction: AIFunction
}

const AIFunctionSingleOverview: React.FC<AIFunctionSingleOverviewProps> = ({
  onDeleteAIFunction,
  aiFunction,
}) => {
  const [showAllTestCases, setShowAllTestCases] = useState(false)
  const [expandedTestCases, setExpandedTestCases] = useState<{ [key: number]: boolean }>({})

  const { mutate: deleteAIFunction } = useDeleteAiFunction({})

  const onClickDelete = () => {
    onDeleteAIFunction()
    deleteAIFunction({ pathParams: { aiFunctionId: aiFunction._id as string } })
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
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {/* AI Function Name */}
      <Typography variant="h4" gutterBottom>
        {aiFunction.name}
      </Typography>
      {/* Description */}
      <Typography variant="body1" gutterBottom>
        {aiFunction.description}
      </Typography>
      <Divider />
      {/* Input Variables */}
      <Box>
        <Typography variant="h6">Input Variables</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {aiFunction.input_variables.map((inputVar, indx) => (
            <Chip key={indx} label={inputVar.name} variant="outlined" size="medium"></Chip>
          ))}
        </Box>
      </Box>
      <Divider />
      {/* Output Assertions */}
      <Box>
        <Typography variant="h6">Output Assertions</Typography>
        {aiFunction.assert.length === 0 ? (
          <Typography variant="body2">No output assertions defined.</Typography>
        ) : (
          <AssertionsOverview assertions={aiFunction.assert} displayOnly></AssertionsOverview>
        )}
      </Box>
      <Divider />
      {/* Test Cases */}
      <Box>
        <Typography variant="h6">Test Cases</Typography>
        {aiFunction.test_cases.length === 0 ? (
          <Typography variant="body2">No test cases defined.</Typography>
        ) : (
          <List>
            {aiFunction.test_cases
              .slice(0, showAllTestCases ? aiFunction.test_cases.length : MAX_VISIBLE_TEST_CASES)
              .map((testCase, index) => (
                <Box key={index}>
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

      <Divider></Divider>
      <Button variant="contained" onClick={onClickDelete}>
        Delete AI Function
      </Button>
    </Box>
  )
}

export default AIFunctionSingleOverview
