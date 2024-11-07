import Button from "@mui/material/Button"
import EditIcon from "@mui/icons-material/Edit"

interface EditButtonProps {
  onClick: () => void
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      sx={{ mr: 5 }}
      onClick={onClick}
      startIcon={<EditIcon sx={{ mb: 0.4 }} />}
    >
      Edit
    </Button>
  )
}

export default EditButton
