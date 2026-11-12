import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import { showSuccess } from "../../../utils/alerts";
import { useUser } from "../../../context/UserContext";
import { useStoreOptions } from "../../../hooks/useStores";
import { useSellers } from "../../../hooks/useSellers";
import { getFormattedDate } from "../../../utils/utils";
import { checkWorkerExists, createSeller } from "../../../api/sellers";
import { STORE_TYPES } from "../../../constants";
import { Grid, MenuItem, FormControl, InputLabel } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { TextField, Select } from "../../ui/Field/Field";
import SaveIcon from "@mui/icons-material/Save";

const STORE_PARAMS = { store_type: STORE_TYPES.STORE };
const today = getFormattedDate();
const SELLERS_PARAMS = { start_date: today, end_date: today };

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

const isSameUsername = (a, b) => a?.toLowerCase() === b?.toLowerCase();

// Campo deshabilitado pero destacado: es el usuario y contraseña con los que entrará el vendedor
const getCredentialsSx = (hasError) => {
  const tone = hasError ? "error" : "primary";
  return {
    "& .MuiOutlinedInput-root.Mui-disabled": {
      bgcolor: (theme) => alpha(theme.palette[tone].main, 0.06),
      "& fieldset": { borderColor: (theme) => alpha(theme.palette[tone].main, 0.45), borderStyle: "dashed" },
      "& input": { WebkitTextFillColor: (theme) => theme.palette[tone].main, fontWeight: 700 },
    },
    "& .MuiInputLabel-root.Mui-disabled": { color: `${tone}.main`, fontWeight: 600 },
    "& .MuiFormHelperText-root": { fontWeight: 500 },
  };
};

const CREDENTIALS_HELP = "Con este usuario y contraseña entrará el vendedor";
const USERNAME_CHECK_DELAY_MS = 300;
const USERNAME_CHECKING = "Verificando usuario...";
const USERNAME_TAKEN = "Ya existe un vendedor con este usuario. Cambia el nombre o el patrón.";

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

  const queryClient = useQueryClient();
  const { data: stores } = useStoreOptions(STORE_PARAMS);
  const { data: sellers } = useSellers(SELLERS_PARAMS);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [usernamePattern, setUsernamePattern] = useState("first_name");
  const [usernameError, setUsernameError] = useState("");
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

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
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      setFormData(INITIAL_FORM_DATA);
      setUsernameError("");
      showSuccess("Vendedor creado");
    } catch {
      setUsernameError("Usuario existente");
    } finally {
      setSaving(false);
    }
  };

  const username = formData.worker?.username;
  const hasName = Boolean(formData.worker?.first_name);

  // Verifica el usuario con el servidor; si la verificación falla, queda el respaldo local
  useEffect(() => {
    if (!username || !formData.store_id || !hasName) {
      setUsernameStatus(null);
      return undefined;
    }
    const controller = new AbortController();
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const data = await checkWorkerExists(username, { signal: controller.signal });
        if (!controller.signal.aborted) setUsernameStatus(data.exists ? "taken" : "available");
      } catch {
        if (!controller.signal.aborted) setUsernameStatus(null);
      }
    }, USERNAME_CHECK_DELAY_MS);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [username, formData.store_id, hasName]);

  const takenLocally = Boolean(username) && Boolean(sellers?.some((seller) => isSameUsername(seller.worker?.username, username)));
  const usernameTaken = usernameStatus === "taken" || (usernameStatus === null && takenLocally);
  const usernameChecking = usernameStatus === "checking";
  const usernameMessage = usernameError || (usernameTaken ? USERNAME_TAKEN : "");
  const usernameHelp = usernameMessage || (usernameChecking ? USERNAME_CHECKING : CREDENTIALS_HELP);

  const isFormIncomplete = !formData.store_id || formData.worker?.first_name === "" || formData.worker?.last_name === "";

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Crear vendedor">
      <ModalBody>
        <Grid item xs={12} className="card">
          <Grid container className="fill-row" spacing={2}>
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
              <TextField size="small" fullWidth label="Usuario y contraseña" disabled type="text" value={formData.worker?.username} placeholder="Usuario" name="username" error={!!usernameMessage} helperText={usernameHelp} sx={getCredentialsSx(!!usernameMessage)} />
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomButton fullWidth onClick={handleSubmit} disabled={isFormIncomplete || usernameTaken || usernameChecking || saving} startIcon={<SaveIcon />}>
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
