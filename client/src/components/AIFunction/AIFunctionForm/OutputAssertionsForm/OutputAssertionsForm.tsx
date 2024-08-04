import { OutputAssertionT } from "@/types"
import { useState, Dispatch, SetStateAction, useEffect } from "react"
import AddIcon from "@mui/icons-material/Add"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import RemoveIcon from "@mui/icons-material/Remove"
import * as React from "react"
import { OutputAssertionsFormDialog } from "./OutputAssertionsFormDialog"

interface OutputAssertionsFormProps {
  outputAssertions: Array<OutputAssertionT>
  setOutputAssertions: Dispatch<SetStateAction<Array<OutputAssertionT>>>
}

const OutputAssertionsForm: React.FC<OutputAssertionsFormProps> = ({
  outputAssertions,
  setOutputAssertions,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const [assertionIndx, setAssertionIndx] = useState<number>(0)

  function onClickAddVariable() {
    setAssertionIndx(outputAssertions.length + 1)
    setOpenDialog(true)
  }

  const onEdit = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAssertionIndx(indx)
      setOpenDialog(true)
    }
    return f
  }

  const onDelete = (indx: number) => {
    const f = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const aux = outputAssertions.filter((item, i) => i !== indx)
      setOutputAssertions([...aux])
    }
    return f
  }

  return (
    <>
      <OutputAssertionsFormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        outputAssertions={outputAssertions}
        setOutputAssertions={setOutputAssertions}
        indx={assertionIndx}
      ></OutputAssertionsFormDialog>

      <IconButton color="primary" onClick={onClickAddVariable}>
        <AddIcon />
      </IconButton>

      <List sx={{ width: "100%", maxHeight: "20%", overflow: "auto" }}>
        {outputAssertions.map((outputAssertions, indx) => {
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
              <ListItemText id={labelId} primary={"Placeholder"} />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default OutputAssertionsForm
