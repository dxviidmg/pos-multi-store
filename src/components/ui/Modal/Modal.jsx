import { memo } from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const headerStyle = {
  background: 'linear-gradient(135deg, #04346b 0%, #065a9e 100%)',
  color: 'white',
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

function CustomModal({ showOut, onClose, title, children }) {
  return (
    <Modal open={showOut} onClose={onClose}>
      <Box sx={style}>
        <Box sx={headerStyle}>
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
