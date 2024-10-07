"use client"
import { Assertion, BaseAssertionTypes } from "@/api/apiSchemas"
import StringTypeForm from "./StringTypesForm"
import ListTypesForm from "./ListTypesForm"
import ThresholdTypeForm from "./ThresholdTypeForm"
import { Typography } from "@mui/material"
import JSONSchemaForm from "@/components/JSONSchemaForm"

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
    case "javascript":
    case "python":
    case "regex":
    case "starts-with":
      componentToRender = <StringTypeForm value={value} setValue={setValue}></StringTypeForm>
      break
    case "contains-all":
    case "contains-any":
    case "icontains-all":
    case "icontains-any":
      componentToRender = (
        <>
          <Typography>Values</Typography>{" "}
          <ListTypesForm
            open={open}
            values={value}
            label="value"
            setValues={setValue}
          ></ListTypesForm>
        </>
      )
      break
    case "contains-xml":
    case "is-xml":
      componentToRender = (
        <>
          <Typography>Required XML Elements </Typography>{" "}
          <ListTypesForm
            open={open}
            values={value}
            placeholder="root.child"
            setValues={setValue}
          ></ListTypesForm>
        </>
      )
      break
    case "contains-json":
    case "is-json":
      componentToRender = (
        <>
          <Typography>JSON Schema</Typography>
          <JSONSchemaForm
            JSONSchema={value ? (value as Record<string, any>) : {}}
            setJSONSchema={setValue}
          ></JSONSchemaForm>
        </>
      )
      break
    case "cost":
    case "latency":
    case "perplexity":
    case "perplexity-score":
    case "rouge-n":
      componentToRender = (
        <ThresholdTypeForm threshold={threshold} setThreshold={setThreshold}></ThresholdTypeForm>
      )
      break
    case "levenshtein":
      componentToRender = (
        <>
          <StringTypeForm value={value} setValue={setValue}></StringTypeForm>
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
