import { styled, alpha } from "@mui/material";

const DropZone = styled('label', { shouldForwardProp: (prop) => prop !== 'isDragging' })(({ theme, isDragging }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.25rem',
  border: `1.5px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 8,
  cursor: 'pointer',
  backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
}));

export default DropZone;
