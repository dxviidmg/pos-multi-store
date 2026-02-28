import { logger } from "../../../utils/logger";
import React, { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import Swal from "sweetalert2";
import { updateProduct } from "../../../api/products";
import { getStores } from "../../../api/stores";
import { getUserData } from "../../../api/utils";
import { createSeller } from "../../../api/sellers";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const SellerModal = ({ isOpen, seller, onClose, onUpdate }) => {
  const user = getUserData();
  const short_name = user.tenant_short_name
  const INITIAL_FORM_DATA = {
    role: "V",
    store_id: "",
    worker:{
      username: "",
      first_name: "Vendedor",
      last_name: "generico",
    }
  };

  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (seller) {
      setFormData(seller);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }

    const fetchBrands = async () => {
      try {
        const response = await getStores({ store_type: "T" });
        setStores(response.data);
      } catch (error) {
        logger.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [seller]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;  
    setFormData((prevData) => {
      const updatedData = { ...prevData };
  
      if (!updatedData.worker) {
        updatedData.worker = {};
      }
  
      if (name === "store_id") {
        updatedData.store_id = value;
  
        const store = stores.find((s) => s.id == value);
  
        if (store) {
          const storeName = store.name.toLowerCase();
          const workersCount = store.workers_count + 1;
          logger.log(workersCount)
          const username = `${short_name}.tienda.${storeName}.vendedor${workersCount}`;
          updatedData.worker.username = username;
        }
      } else if (["first_name", "last_name"].includes(name)) {
        updatedData.worker[name] = value;
      } else {
        updatedData[name] = value;
      }
  
      return updatedData;
    });
  };

  const handleProductSubmit = async () => {
    const apiCall = formData.id ? updateProduct : createSeller;
    const response = await apiCall(formData);

    if ([200, 201].includes(response.status)) {
      onClose();
      onUpdate(response.data);
      setFormData(INITIAL_FORM_DATA);
      Swal.fire({
        icon: "success",
        title: `Producto ${formData.id ? "actualizado" : "creado"}`,
        timer: 5000,
      });
    } else {
      handleClientError(response);
    }
  };

  const handleClientError = (response) => {
    let message = "Error desconocido. Por favor, contacte soporte.";
    if (response.response?.status === 400 && response.response.data?.code) {
      const codeError = response.response.data.code[0];
      if (codeError === "product with this code already exists.") {
        message = "El código ya existe.";
      }
    }
    Swal.fire({
      icon: "error",
      title: `Error al ${formData.id ? "actualizar" : "crear"} producto`,
      text: message,
      timer: 5000,
    });
  };

  const isFormIncomplete = () => {
    return formData.store === ""
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={formData.id ? "Actualizar vendedor" : "Crear vendedor"}
    >
      <Grid className="custom-section">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Tienda</InputLabel>
              <Select fullWidth size="small" value={formData.store_id}
              onChange={handleDataChange}
              name="store_id"
             label="Tienda">
              <MenuItem value="">Selecciona una tienda</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField size="small" fullWidth label="Usuario y contraseña" disabled
              type="text"
              value={formData.worker?.username}
              placeholder="Usuario"
              name="username"
              onChange={handleDataChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField size="small" fullWidth label="Nombre" type="text"
              value={formData.worker?.first_name}
              placeholder="Nombre"
              name="first_name"
              onChange={handleDataChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField size="small" fullWidth label="Apellidos" type="text"
              value={formData.worker?.last_name}
              placeholder="Apellidos"
              name="last_name"
              onChange={handleDataChange}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <CustomButton
              fullWidth={true}
              onClick={handleProductSubmit}
              disabled={isFormIncomplete()}
              marginTop="10px"
              startIcon={<SaveIcon />}
            >
              {formData.id ? "Actualizar" : "Crear"} vendedor
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default SellerModal;
