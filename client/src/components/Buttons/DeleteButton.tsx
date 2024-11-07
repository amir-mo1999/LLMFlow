import Button from "@mui/material/Button"
import DeleteIcon from "@mui/icons-material/Delete"

interface DeleteButtonProps {
  onClick: () => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<DeleteIcon sx={{ mb: 0.4 }} />}
      onClick={onClick}
    >
      Delete
    </Button>
  )
}

export default DeleteButton
