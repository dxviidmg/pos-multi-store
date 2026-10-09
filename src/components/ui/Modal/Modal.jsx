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
  width: { xs: 'calc(100% - 24px)', sm: '90%' },
  maxHeight: { xs: 'calc(100dvh - 24px)', sm: '90vh' },
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: { xs: 2, sm: 3 },
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
        <Box className="modal__header" sx={{ px: { xs: 2, sm: 3 }, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.0625rem', fontWeight: 700, color: 'text.primary', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {title}
          </Typography>
          <CustomTooltip text="Cerrar" position="bottom">
            <IconButton onClick={onClose} size="small" aria-label="Cerrar" sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover', color: 'text.primary' } }}>
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
  <Box sx={{ padding: { xs: '1rem', sm: '1.25rem 1.5rem' }, backgroundColor: 'modalBody.main', ...sx }} {...props}>
    {children}
  </Box>
);

export default memo(CustomModal);
