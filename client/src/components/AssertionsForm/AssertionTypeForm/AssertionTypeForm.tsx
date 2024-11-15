"use client"
import { Assertion, BaseAssertionTypes } from "@/api/apiSchemas"
import StringTypeForm from "./StringTypesForm"
import ListTypesForm from "./ListTypesForm"
import ThresholdTypeForm from "./ThresholdTypeForm"
import CodeTypeForm from "./CodeTypeForm"
import { Typography } from "@mui/material"
import RegexTypeForm from "./RegexTypeForm"

interface AssertionTypeFormProps {
  open: boolean
  type: BaseAssertionTypes
  value: Assertion["value"]
  threshold: Assertion["threshold"]
  setThreshold: React.Dispatch<React.SetStateAction<Assertion["threshold"]>>
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
}

const AssertionTypeForm: React.FC<AssertionTypeFormProps> = ({
  open,
  type,
  value,
  setValue,
  threshold,
  setThreshold,
}) => {
  let componentToRender: React.ReactElement
  switch (type) {
    case "contains":
    case "equals":
    case "icontains":
    case "starts-with":
      componentToRender = <StringTypeForm value={value} setValue={setValue}></StringTypeForm>
      break
    case "regex":
      componentToRender = <RegexTypeForm value={value} setValue={setValue}></RegexTypeForm>
      break
    case "javascript":
      componentToRender = (
        <CodeTypeForm extension="javascript" value={value} setValue={setValue}></CodeTypeForm>
      )
      break
    case "python":
      componentToRender = (
        <CodeTypeForm extension="python" value={value} setValue={setValue}></CodeTypeForm>
      )
      break
    case "contains-all":
    case "contains-any":
    case "icontains-all":
    case "icontains-any":
      componentToRender = (
        <>
          <Typography>Values</Typography>{" "}
          <ListTypesForm required open={open} values={value} setValues={setValue}></ListTypesForm>
        </>
      )
      break

    case "levenshtein":
      componentToRender = (
        <>
          <StringTypeForm value={value} setValue={setValue} sx={{ mb: 1 }}></StringTypeForm>
          <ThresholdTypeForm threshold={threshold} setThreshold={setThreshold}></ThresholdTypeForm>
        </>
      )
      break
    default:
      componentToRender = <></>
  }

  return componentToRender
}

export default AssertionTypeForm
