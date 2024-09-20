"use client"
import { Assertion, BaseAssertionTypes } from "@/api/apiSchemas"
import StringTypeForm from "./StringTypes"

interface AssertionTypeFormProps {
  type: BaseAssertionTypes
  value: Assertion["value"]
  setValue: React.Dispatch<React.SetStateAction<Assertion["value"]>>
}

const AssertionTypeForm: React.FC<AssertionTypeFormProps> = ({ type, value, setValue }) => {
  switch (type) {
    case "contains":
    case "equals":
    case "icontains":
    case "javascript":
    case "levenshtein":
    case "python":
    case "regex":
    case "starts-with":
      return <StringTypeForm value={value} setValue={setValue}></StringTypeForm>
  }
}

export default AssertionTypeForm
