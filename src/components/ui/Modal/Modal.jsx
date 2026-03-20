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
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
  borderRadius: 1,
  border: '1px solid #e8ecf1',
};

function CustomModal({ showOut, onClose, title, children }) {
  return (
    <Modal open={showOut} onClose={onClose}>
      <Box sx={style}>
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
