import React, { useEffect, useState, useMemo } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess } from "../../../utils/alerts";
import { updateProduct } from "../../../api/products";
import { getStores } from "../../../api/stores";
import { getUserData } from "../../../api/utils";
import { createSeller } from "../../../api/sellers";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const SellerModal = ({ isOpen, seller, onClose, onUpdate }) => {
  const user = getUserData();
  const short_name = user.tenant_short_name;
  const INITIAL_FORM_DATA = useMemo(() => ({
    role: "V",
    store_id: "",
    worker: {
      username: "",
      first_name: "",
      last_name: "",
    }
  }), []);

  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [usernamePattern, setUsernamePattern] = useState("first_name");
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    if (seller) {
      setFormData(seller);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }

    const fetchStores = async () => {
      try {
        const response = await getStores({ store_type: "T" });
        setStores(response.data);
      } catch (error) {}
    };

    fetchStores();
  }, [seller, INITIAL_FORM_DATA]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData.worker) updatedData.worker = {};

      if (name === "store_id") {
        updatedData.store_id = value;
        const store = stores.find((s) => s.id === value);
        if (store) {
          const storeName = store.name.toLowerCase();
          updatedData.worker.username = `${short_name}.tienda.${storeName}`;
        }
      } else if (name === "last_name") {
        updatedData.worker.last_name = value;
      } else if (name === "first_name") {
        updatedData.worker.first_name = value;
        const store = stores.find((s) => s.id === updatedData.store_id);
        if (store) {
          const storeName = store.name.toLowerCase();
          const firstName = value.toLowerCase();
          const lastName = updatedData.worker.last_name?.toLowerCase() || "";
          let username = "";
          if (usernamePattern === "first_name") {
            username = `${short_name}.tienda.${storeName}.${firstName}`;
          } else if (usernamePattern === "last_name") {
            username = `${short_name}.tienda.${storeName}.${lastName}`;
          } else if (usernamePattern === "initials") {
            username = `${short_name}.tienda.${storeName}.${firstName.charAt(0)}${lastName.charAt(0)}`;
          } else if (usernamePattern === "first_last") {
            username = `${short_name}.tienda.${storeName}.${firstName.charAt(0)}${lastName}`;
          }
          updatedData.worker.username = username;
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
    const store = stores.find((s) => s.id === formData.store_id);
    if (store && formData.worker?.first_name) {
      const storeName = store.name.toLowerCase();
      const firstName = formData.worker.first_name.toLowerCase();
      const lastName = formData.worker.last_name?.toLowerCase() || "";
      let username = "";
      if (newPattern === "first_name") {
        username = `${short_name}.tienda.${storeName}.${firstName}`;
      } else if (newPattern === "last_name") {
        username = `${short_name}.tienda.${storeName}.${lastName}`;
      } else if (newPattern === "initials") {
        username = `${short_name}.tienda.${storeName}.${firstName.charAt(0)}${lastName.charAt(0)}`;
      } else if (newPattern === "first_last") {
        username = `${short_name}.tienda.${storeName}.${firstName.charAt(0)}${lastName}`;
      }
      setFormData((prev) => ({ ...prev, worker: { ...prev.worker, username } }));
    }
  };

  const handleSubmit = async () => {
    const apiCall = formData.id ? updateProduct : createSeller;
    try {
      const response = await apiCall(formData);
      if ([200, 201].includes(response.status)) {
        onClose();
        onUpdate(response.data);
        setFormData(INITIAL_FORM_DATA);
        setUsernameError("");
        showSuccess(`Vendedor ${formData.id ? "actualizado" : "creado"}`);
      } else {
        setUsernameError("Usuario existente");
      }
    } catch (error) {
      setUsernameError("Usuario existente");
    }
  };

  const isFormIncomplete = () => {
    return formData.store_id === "" || formData.worker?.first_name === "" || formData.worker?.last_name === "";
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={formData.id ? "Actualizar vendedor" : "Crear vendedor"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tienda</InputLabel>
                <Select fullWidth size="small" value={formData.store_id} onChange={handleDataChange} name="store_id" label="Tienda">
                  <MenuItem value="">Selecciona una tienda</MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <CustomButton fullWidth={true} onClick={handleSubmit} disabled={isFormIncomplete()} marginTop="10px" startIcon={<SaveIcon />}>
                {formData.id ? "Actualizar" : "Crear"} vendedor
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default SellerModal;
