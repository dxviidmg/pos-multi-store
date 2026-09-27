import { memo } from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Modal.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
};

function CustomModal({ showOut, onClose, title, children, maxWidth = 800 }) {
  return (
    <Modal
      open={showOut}
      onClose={onClose}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(2,17,38,0.45)', backdropFilter: 'blur(4px)' } } }}
    >
      <Box className="modal-enter" sx={{ ...style, maxWidth }}>
        <Box className="modal__header" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

export default memo(CustomModal);
