import { AIFunctionT } from "@/types"
import { Dispatch, SetStateAction, useState, useEffect } from "react"
import DatasetFormDialog from "./DatasetFormDialog"
import AddIcon from "@mui/icons-material/Add"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import RemoveIcon from "@mui/icons-material/Remove"
import Typography from "@mui/material/Typography"
import { InputVariableT } from "@/types"

interface DatasetFormProps {
  inputVariables: Array<InputVariableT>
  dataset: AIFunctionT["dataset"]
  setDataset: Dispatch<SetStateAction<AIFunctionT["dataset"]>>
}

const DatasetForm: React.FC<DatasetFormProps> = ({ dataset, setDataset, inputVariables }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [datasetIndx, setDatasetIndx] = useState<number>(0)

  function onClickAddRecord() {
    setDatasetIndx(dataset.length + 1)
    setOpenDialog(true)
  }

  const onEdit = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDatasetIndx(indx)
      setOpenDialog(true)
    }
    return f
  }

  const onDelete = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const aux = dataset.filter((item, i) => i !== indx)
      setDataset([...aux])
    }
    return f
  }
  return (
    <>
      <DatasetFormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        dataset={dataset}
        setDataset={setDataset}
        inputVariables={inputVariables}
        indx={datasetIndx}
      ></DatasetFormDialog>

      <IconButton color="primary" onClick={onClickAddRecord}>
        <AddIcon />
      </IconButton>

      <List sx={{ width: "100%", maxHeight: "20%", overflow: "auto" }}>
        {dataset.map((record, indx) => {
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
              <ListItemText id={labelId} primary={<Typography>{"placeholder"}</Typography>} />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default DatasetForm
