import { styled } from "@mui/material";

const DropZone = styled('label')(({ theme, isDragging }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 12,
  cursor: 'pointer',
  backgroundColor: isDragging ? 'rgba(4, 52, 107, 0.06)' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(4, 52, 107, 0.04)',
  },
}));

export default DropZone;
