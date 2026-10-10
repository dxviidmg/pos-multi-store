import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { Person, Save } from "@mui/icons-material";
import ProfileSectionTitle from "./ProfileSectionTitle";
import { updateUser } from "../../../api/users";
import { showRequestError, showSuccess } from "../../../utils/alerts";

const EDITABLE_FIELDS = [
  { name: "first_name", label: "Nombre" },
  { name: "last_name", label: "Apellido" },
  { name: "email", label: "Email", type: "email" },
];

/** Datos del usuario en sesión. */
const UserSection = ({ userId, initialUser }) => {
  const [userData, setUserData] = useState({
    username: initialUser.username || "",
    email: initialUser.email || "",
    first_name: initialUser.first_name || "",
    last_name: initialUser.last_name || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(userId, userData);
      showSuccess("Datos del usuario guardados");
    } catch (error) {
      showRequestError("guardar los datos del usuario", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Box sx={{ mb: 3 }}>
        <ProfileSectionTitle icon={Person} title="Información del usuario" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Usuario" name="username" value={userData.username} size="small" disabled />
          </Grid>
          {EDITABLE_FIELDS.map(({ name, label, type }) => (
            <Grid item xs={12} key={name}>
              <TextField
                fullWidth
                label={label}
                name={name}
                value={userData[name]}
                onChange={handleChange}
                size="small"
                type={type}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button fullWidth variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>
        Guardar datos del usuario
      </Button>
    </Grid>
  );
};

export default UserSection;
