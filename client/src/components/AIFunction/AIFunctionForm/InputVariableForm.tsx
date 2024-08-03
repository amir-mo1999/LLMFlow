import { InputVariableT } from "@/types"
import { useState, Dispatch, SetStateAction } from "react"
import AddIcon from "@mui/icons-material/Add"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import RemoveIcon from "@mui/icons-material/Remove"

interface InputVariableFormProps {
  inputVariables: Array<InputVariableT>
  setInputVariables: Dispatch<SetStateAction<Array<InputVariableT>>>
}

const InputVariableForm: React.FC<InputVariableFormProps> = ({
  inputVariables,
  setInputVariables,
}) => {
  // variable for opening the dialog
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  // variable for index of the input variable that is currently being updated
  const [inputVariableIndx, setInputVariableIndx] = useState<number>(0)

  // variable holds a new input variable that is added once the create button is pressed
  const [newInputVariable, setNewInputVariable] = useState<InputVariableT>()

  // event handler for when add input variable button is clicked
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

  // event handler for when dialog is closed
  function onClose(reason: string) {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (reason !== "backdropClick") {
        setOpenDialog(false)
      }
    }
    return f
  }

  // event handler create button is clicked in dialog
  function onCreate() {
    if (newInputVariable === undefined) {
      return
    }

    const auxArray = inputVariables
    if (inputVariableIndx >= inputVariables.length) {
      auxArray.push(newInputVariable)
    } else {
      auxArray[inputVariableIndx] = newInputVariable
    }
    setInputVariables([...auxArray])
    setOpenDialog(false)
  }

  return (
    <>
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
