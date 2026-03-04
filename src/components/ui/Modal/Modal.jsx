import { memo } from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Modal.css';
import { colors } from '../../../theme/colors';

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
  boxShadow: 24,
  borderRadius: 1,
};

function CustomModal({ showOut, onClose, title, children}) {
  return (
    <Modal open={showOut} onClose={onClose}>
      <Box sx={style}>
        <Box className="custom-modal-header" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box className="custom-modal-body" sx={{ p: 2, backgroundColor: colors.background.main }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

export default memo(CustomModal);