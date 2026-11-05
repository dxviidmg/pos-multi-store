import { Grid, IconButton, InputAdornment, Alert } from "@mui/material";
import { TextField } from "../Field/Field";
import { CheckCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import CustomModal from "../Modal/Modal";
import CustomButton from "../Button/Button";
import CustomTooltip from "../Tooltip";
import { getConfirmFieldProps, getConfirmState } from "./passwordConfirm";

const ChangePasswordModal = ({ open, onClose, passwordData, onChange, onSave, showPasswords, onToggleVisibility }) => {
  const confirmState = getConfirmState(passwordData.new_password, passwordData.confirm_password);

  return (
    <CustomModal showOut={open} onClose={onClose} title="Cambiar contraseña">
      <Grid container sx={{ padding: '1rem', backgroundColor: 'modalBody.main' }}>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="warning" variant="filled" sx={{ fontSize: '0.8125rem' }}>
                Al cambiar la contraseña se cerrará la sesión en todos los dispositivos donde esté abierta.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tu contraseña actual (seguridad)"
                name="old_password"
                value={passwordData.old_password}
                onChange={onChange}
                size="small"
                autoComplete="new-password"
                type={showPasswords.current ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomTooltip text={showPasswords.current ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
                        <IconButton onClick={() => onToggleVisibility('current')} edge="end" size="small" aria-label={showPasswords.current ? "Ocultar contraseña" : "Mostrar contraseña"}>
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </CustomTooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nueva contraseña"
                name="new_password"
                value={passwordData.new_password}
                onChange={onChange}
                size="small"
                autoComplete="new-password"
                type={showPasswords.new ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomTooltip text={showPasswords.new ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
                        <IconButton onClick={() => onToggleVisibility('new')} edge="end" size="small" aria-label={showPasswords.new ? "Ocultar contraseña" : "Mostrar contraseña"}>
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </CustomTooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar nueva contraseña"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={onChange}
                size="small"
                autoComplete="new-password"
                type={showPasswords.confirm ? "text" : "password"}
                {...getConfirmFieldProps(confirmState)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {confirmState === "match" && (
                        <CheckCircle color="success" fontSize="small" aria-hidden="true" sx={{ mr: 0.5 }} />
                      )}
                      <CustomTooltip text={showPasswords.confirm ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
                        <IconButton onClick={() => onToggleVisibility('confirm')} edge="end" size="small" aria-label={showPasswords.confirm ? "Ocultar contraseña" : "Mostrar contraseña"}>
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </CustomTooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton 
                onClick={onSave} 
                fullWidth
                disabled={!passwordData.old_password || !passwordData.new_password || confirmState !== "match"}
              >
                Cambiar contraseña
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default ChangePasswordModal;
