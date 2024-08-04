import { InputVariableT } from "@/types"
import { useState, Dispatch, SetStateAction } from "react"
import AddIcon from "@mui/icons-material/Add"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import RemoveIcon from "@mui/icons-material/Remove"
import * as React from "react"
import { InputVariableFormDialog } from "./InputVariableFormDialog"

interface InputVariableFormProps {
  inputVariables: Array<InputVariableT>
  setInputVariables: Dispatch<SetStateAction<Array<InputVariableT>>>
}

const InputVariableForm: React.FC<InputVariableFormProps> = ({
  inputVariables,
  setInputVariables,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [inputVariableIndx, setInputVariableIndx] = useState<number>(0)

  function onClickAddVariable() {
    setInputVariableIndx(inputVariables.length + 1)
    setOpenDialog(true)
  }

  const onEdit = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setInputVariableIndx(indx)
      setOpenDialog(true)
    }
    return f
  }

  const onDelete = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const aux = inputVariables.filter((item, i) => i !== indx)
      setInputVariables([...aux])
    }
    return f
  }

  return (
    <>
      <InputVariableFormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        inputVariables={inputVariables}
        setInputVariables={setInputVariables}
        indx={inputVariableIndx}
      ></InputVariableFormDialog>

      <IconButton color="primary" onClick={onClickAddVariable}>
        <AddIcon />
      </IconButton>

      <List sx={{ width: "100%", maxHeight: "20%", overflow: "auto" }}>
        {inputVariables.map((inputVariable, indx) => {
          const labelId = `checkbox-list-label-${indx}`
          return (
            <ListItem
              key={indx}
              secondaryAction={
                <>
                  <IconButton color="primary" onClick={onEdit(indx)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={onDelete(indx)}>
                    <RemoveIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText id={labelId} primary={inputVariable.name} />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default InputVariableForm