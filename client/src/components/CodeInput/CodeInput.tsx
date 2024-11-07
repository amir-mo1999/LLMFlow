import { SxProps } from "@mui/material"
import CodeMirror from "@uiw/react-codemirror"
import Box from "@mui/material/Box"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { autocompletion } from "@codemirror/autocomplete"

interface CodeInputProps {
  value: string
  onChange: (_: string) => void
  extension: "python" | "javascript"
  sx?: SxProps
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, extension, sx }) => {
  return (
    <Box sx={{ borderWidth: 1, borderColor: "black", ...sx }}>
      <CodeMirror
        value={value}
        height="200px"
        onChange={onChange}
        extensions={
          extension === "javascript"
            ? [javascript({ jsx: true }), autocompletion()]
            : extension === "python"
              ? [python(), autocompletion()]
              : []
        }
        style={{ height: "100%", width: "100%" }}
      />
    </Box>
  )
}

export default CodeInput
