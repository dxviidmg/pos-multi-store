import React, { useState } from "react";
import { Button, Grid, IconButton, InputAdornment } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import { CheckCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import CustomTooltip from "../../ui/Tooltip";
import ProfileCard from "./ProfileCard";
import { getConfirmFieldProps, getConfirmState } from "../../ui/UserModals/passwordConfirm";
import { changePassword } from "../../../api/users";
import { showRequestError, showSuccess, showWarning } from "../../../utils/alerts";

const EMPTY_PASSWORDS = { current_password: "", new_password: "", confirm_password: "" };

const PASSWORD_FIELDS = [
  { name: "current_password", label: "Contraseña actual" },
  { name: "new_password", label: "Nueva contraseña" },
  { name: "confirm_password", label: "Confirmar nueva contraseña" },
];

const MIN_PASSWORD_LENGTH = 6;

/** Cambio de contraseña del usuario en sesión. */
const PasswordSection = ({ userId }) => {
  const [passwordData, setPasswordData] = useState(EMPTY_PASSWORDS);
  const [visible, setVisible] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (name) => {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showWarning("No se pudo cambiar la contraseña", "Las contraseñas no coinciden");
      return;
    }

    if (passwordData.new_password.length < MIN_PASSWORD_LENGTH) {
      showWarning("No se pudo cambiar la contraseña", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      await changePassword(userId, {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      showSuccess("Contraseña actualizada");
      setPasswordData(EMPTY_PASSWORDS);
    } catch (error) {
      showRequestError("cambiar la contraseña", error);
    } finally {
      setSaving(false);
    }
  };

  const { new_password: newPassword, confirm_password: confirmPassword } = passwordData;
  const confirmState = getConfirmState(newPassword, confirmPassword);

  const isIncomplete = PASSWORD_FIELDS.some(({ name }) => !passwordData[name]);

  return (
    <Grid item xs={12} md={6}>
      <ProfileCard
        icon={Lock}
        title="Cambiar contraseña"
        description="Mínimo 6 caracteres"
        delay={120}
        action={
          <Button
            variant="contained"
            startIcon={<Lock />}
            onClick={handleSave}
            disabled={saving || isIncomplete || confirmState === "mismatch"}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Cambiar contraseña
          </Button>
        }
      >
        {PASSWORD_FIELDS.map(({ name, label }) => {
          const isConfirm = name === "confirm_password";
          return (
          <TextField
            key={name}
            fullWidth
            label={label}
            name={name}
            value={passwordData[name]}
            onChange={handleChange}
            size="small"
            type={visible[name] ? "text" : "password"}
            {...(isConfirm ? getConfirmFieldProps(confirmState) : {})}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isConfirm && confirmState === "match" && (
                    <CheckCircle color="success" fontSize="small" aria-hidden="true" sx={{ mr: 0.5 }} />
                  )}
                  <CustomTooltip text={visible[name] ? "Ocultar contraseña" : "Mostrar contraseña"} position="top">
                    <IconButton
                      onClick={() => toggleVisibility(name)}
                      edge="end"
                      size="small"
                      aria-label={visible[name] ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {visible[name] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </CustomTooltip>
                </InputAdornment>
              ),
            }}
          />
          );
        })}
      </ProfileCard>
    </Grid>
  );
};

export default PasswordSection;
