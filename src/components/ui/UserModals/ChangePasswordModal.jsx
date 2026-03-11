import { Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CustomModal from "../Modal/Modal";
import CustomButton from "../Button/Button";

const ChangePasswordModal = ({ open, onClose, passwordData, onChange, onSave, showPasswords, onToggleVisibility }) => {
  return (
    <CustomModal showOut={open} onClose={onClose} title="Cambiar Contraseña">
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tu Contraseña Actual (Seguridad)"
                name="old_password"
                value={passwordData.old_password}
                onChange={onChange}
                size="small"
                type={showPasswords.current ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => onToggleVisibility('current')} edge="end" size="small">
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="new_password"
                value={passwordData.new_password}
                onChange={onChange}
                size="small"
                type={showPasswords.new ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => onToggleVisibility('new')} edge="end" size="small">
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={onChange}
                size="small"
                type={showPasswords.confirm ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => onToggleVisibility('confirm')} edge="end" size="small">
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton 
                onClick={onSave} 
                variant="contained" 
                fullWidth
                disabled={!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password}
              >
                Cambiar Contraseña
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default ChangePasswordModal;
