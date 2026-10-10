import React, { useState } from "react";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import { showSuccess } from "../../../utils/alerts";
import { useUser } from "../../../context/UserContext";
import { useStoreOptions } from "../../../hooks/useStores";
import { createSeller } from "../../../api/sellers";
import { STORE_TYPES } from "../../../constants";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const STORE_PARAMS = { store_type: STORE_TYPES.STORE };

const INITIAL_FORM_DATA = {
  role: "V",
  store_id: null,
  worker: {
    username: "",
    first_name: "",
    last_name: "",
  },
};

const getStoreName = (store) => store.name;

/** Usuario sugerido según el patrón: `{negocio}.tienda.{tienda}.{sufijo}`. */
const buildUsername = (pattern, prefix, firstName, lastName) => {
  const first = firstName.toLowerCase();
  const last = lastName?.toLowerCase() || "";
  const suffixes = {
    first_name: first,
    last_name: last,
    initials: `${first.charAt(0)}${last.charAt(0)}`,
    first_last: `${first.charAt(0)}${last}`,
  };
  return pattern in suffixes ? `${prefix}.${suffixes[pattern]}` : "";
};

/** Alta de vendedores; la edición se hace desde los modales de usuario de SellerList. */
const SellerModal = ({ isOpen, onClose, onUpdate }) => {
  const { user } = useUser();
  const short_name = user.tenant_short_name;

  const { data: stores } = useStoreOptions(STORE_PARAMS);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [usernamePattern, setUsernamePattern] = useState("first_name");
  const [usernameError, setUsernameError] = useState("");
  const [saving, setSaving] = useState(false);

  const getUsernamePrefix = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? `${short_name}.tienda.${store.name.toLowerCase()}` : null;
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, worker: { ...prevData.worker } };

      if (name === "store_id") {
        updatedData.store_id = value || null;
        const prefix = getUsernamePrefix(value);
        if (prefix) updatedData.worker.username = prefix;
      } else if (name === "last_name") {
        updatedData.worker.last_name = value;
      } else if (name === "first_name") {
        updatedData.worker.first_name = value;
        const prefix = getUsernamePrefix(updatedData.store_id);
        if (prefix) {
          updatedData.worker.username = buildUsername(usernamePattern, prefix, value, updatedData.worker.last_name);
        }
      } else {
        updatedData[name] = value;
      }
      return updatedData;
    });
  };

  const handlePatternChange = (e) => {
    const newPattern = e.target.value;
    setUsernamePattern(newPattern);
    const prefix = getUsernamePrefix(formData.store_id);
    if (prefix && formData.worker?.first_name) {
      const username = buildUsername(newPattern, prefix, formData.worker.first_name, formData.worker.last_name);
      setFormData((prev) => ({ ...prev, worker: { ...prev.worker, username } }));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await createSeller(formData);
      onClose();
      onUpdate(response.data);
      setFormData(INITIAL_FORM_DATA);
      setUsernameError("");
      showSuccess("Vendedor creado");
    } catch {
      setUsernameError("Usuario existente");
    } finally {
      setSaving(false);
    }
  };

  const isFormIncomplete = !formData.store_id || formData.worker?.first_name === "" || formData.worker?.last_name === "";

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Crear vendedor">
      <ModalBody>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <StoreSelect
                value={formData.store_id ?? ""}
                onChange={handleDataChange}
                name="store_id"
                label="Tienda"
                params={STORE_PARAMS}
                allLabel="Selecciona una tienda"
                getOptionLabel={getStoreName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Nombre" type="text" value={formData.worker?.first_name} placeholder="Nombre" name="first_name" onChange={handleDataChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Apellido" type="text" value={formData.worker?.last_name} placeholder="Apellido" name="last_name" onChange={handleDataChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Patrón de usuario</InputLabel>
                <Select fullWidth size="small" value={usernamePattern} onChange={handlePatternChange} name="username_pattern" label="Patrón de usuario">
                  <MenuItem value="first_name">Nombre (juan)</MenuItem>
                  <MenuItem value="last_name">Apellido (perez)</MenuItem>
                  <MenuItem value="initials">Iniciales (jp)</MenuItem>
                  <MenuItem value="first_last">Primera letra + Apellido (jperez)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Usuario y contraseña" disabled type="text" value={formData.worker?.username} placeholder="Usuario" name="username" error={!!usernameError} helperText={usernameError} />
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomButton fullWidth onClick={handleSubmit} disabled={isFormIncomplete || saving} startIcon={<SaveIcon />}>
                Crear vendedor
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default SellerModal;
