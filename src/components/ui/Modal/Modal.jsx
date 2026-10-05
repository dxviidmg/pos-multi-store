import { memo } from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';
import CustomTooltip from '../Tooltip';
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
      slotProps={{ backdrop: { sx: { backgroundColor: colors.backdrop, backdropFilter: 'blur(4px)' } } }}
    >
      <Box className="modal-enter" sx={{ ...style, maxWidth }}>
        <Box className="modal__header" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <CustomTooltip text="Cerrar" position="bottom">
            <IconButton onClick={onClose} size="small" aria-label="Cerrar" sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}>
              <CloseIcon />
            </IconButton>
          </CustomTooltip>
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

/**
 * Cuerpo estándar de un modal: padding de 1rem y fondo `modalBody.main`.
 * `sx` se combina al final; el resto de props pasa al Box.
 */
export const ModalBody = ({ children, sx, ...props }) => (
  <Box sx={{ padding: '1rem', backgroundColor: 'modalBody.main', ...sx }} {...props}>
    {children}
  </Box>
);

export default memo(CustomModal);
