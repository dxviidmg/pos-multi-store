import React, { useState } from "react";
import { Grid } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import CustomButton from "../../ui/Button/Button";
import { Person, Save } from "@mui/icons-material";
import ProfileCard from "./ProfileCard";
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
      <ProfileCard
        icon={Person}
        title="Información del usuario"
        description="Tus datos de contacto"
        delay={60}
        action={
          <CustomButton startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ width: { xs: "100%", sm: "auto" } }}>
            Guardar cambios
          </CustomButton>
        }
      >
        <TextField fullWidth label="Usuario" name="username" value={userData.username} size="small" disabled />
        {EDITABLE_FIELDS.map(({ name, label, type }) => (
          <TextField
            key={name}
            fullWidth
            label={label}
            name={name}
            value={userData[name]}
            onChange={handleChange}
            size="small"
            type={type}
          />
        ))}
      </ProfileCard>
    </Grid>
  );
};

export default UserSection;
