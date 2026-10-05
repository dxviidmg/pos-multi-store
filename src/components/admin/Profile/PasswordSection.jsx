import React, { useState } from "react";
import { Box, Button, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import ProfileSectionTitle from "./ProfileSectionTitle";
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
        current_password: passwordData.current_password,
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

  const isIncomplete = PASSWORD_FIELDS.some(({ name }) => !passwordData[name]);

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ mb: 3 }}>
        <ProfileSectionTitle icon={Lock} title="Cambiar contraseña" />
        <Grid container spacing={2}>
          {PASSWORD_FIELDS.map(({ name, label }) => (
            <Grid item xs={12} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                value={passwordData[name]}
                onChange={handleChange}
                size="small"
                type={visible[name] ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleVisibility(name)} edge="end" size="small">
                        {visible[name] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<Lock />}
        onClick={handleSave}
        disabled={saving || isIncomplete}
      >
        Cambiar contraseña
      </Button>
    </Grid>
  );
};

export default PasswordSection;
