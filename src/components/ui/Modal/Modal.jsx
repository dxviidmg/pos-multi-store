import { memo } from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { colors } from '../../../theme/colors';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 'calc(100% - 24px)', sm: '90%' },
  maxHeight: { xs: 'calc(100dvh - 24px)', sm: '90vh' },
  overflow: 'auto',
  bgcolor: 'modalHeader.main',
  boxShadow: 24,
  borderRadius: { xs: 2, sm: 3 },
  border: '1px solid',
  borderColor: 'divider',
};

const modalFieldSx = {
  '& .MuiOutlinedInput-root': { bgcolor: 'modalField.main' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'modalBorder.main' },
};

// Evita que la X le quite el foco al campo activo: en móvil el teclado se cierra, la pantalla se mueve y el clic se pierde
const keepInputFocus = (e) => e.preventDefault();

function CustomModal({ showOut, onClose, title, children, maxWidth = 800 }) {
  return (
    <Modal
      open={showOut}
      onClose={onClose}
      slotProps={{ backdrop: { sx: { backgroundColor: colors.backdrop, backdropFilter: 'blur(4px)' } } }}
    >
      <Box className="modal-enter" sx={{ ...style, maxWidth }}>
        <Box sx={{ background: colors.gradient.sidebar, color: colors.white, px: { xs: 2, sm: 3 }, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 2 }}>
          <Typography variant="h6" sx={{ px: 5, textAlign: 'center', fontSize: '1.0625rem', fontWeight: 700, color: 'inherit' }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} onMouseDown={keepInputFocus} size="small" aria-label="Cerrar" sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: { xs: 8, sm: 16 }, color: alpha(colors.white, 0.8), '&:hover': { bgcolor: alpha(colors.white, 0.12), color: colors.white } }}>
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

// Las cards dentro de un modal van más compactas y la última no deja margen extra
const modalCardSx = {
  '& .card': { padding: { xs: '1rem', sm: '1.25rem' } },
  '& > .card:last-child': { marginBottom: 0 },
};

/**
 * Cuerpo estándar de un modal: padding de 1rem y fondo `modalBody.main`.
 * `sx` se combina al final; el resto de props pasa al Box.
 */
export const ModalBody = ({ children, sx, ...props }) => (
  <Box sx={{ padding: { xs: '0.75rem', sm: '1rem' }, backgroundColor: 'modalBody.main', ...modalFieldSx, ...modalCardSx, ...sx }} {...props}>
    {children}
  </Box>
);

export default memo(CustomModal);
