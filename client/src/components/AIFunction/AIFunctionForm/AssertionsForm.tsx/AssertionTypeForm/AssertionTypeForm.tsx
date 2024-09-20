"use client"
import { Assertion, BaseAssertionTypes } from "@/api/apiSchemas"
import StringTypeForm from "./StringTypesForm"
import ListTypesForm from "./ListTypesForm"

interface AssertionTypeFormProps {
  open: boolean
  type: BaseAssertionTypes
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
}

const AssertionTypeForm: React.FC<AssertionTypeFormProps> = ({ open, type, value, setValue }) => {
  let componentToRender: React.ReactElement
  switch (type) {
    case "contains":
    case "equals":
    case "icontains":
    case "javascript":
    case "levenshtein":
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
        <ListTypesForm open={open} values={value} setValues={setValue}></ListTypesForm>
      )
      break
    default:
      componentToRender = <></>
  }

  return componentToRender
}

export default AssertionTypeForm
