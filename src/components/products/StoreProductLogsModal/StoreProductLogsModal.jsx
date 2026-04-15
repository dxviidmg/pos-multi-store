import React, { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProductLogs, updateStoreProduct } from "../../../api/products";
import { getFormattedDateTime } from "../../../utils/utils";
import { showSuccess, showError } from "../../../utils/alerts";
import CustomButton from "../../ui/Button/Button";
import { chooseIcon } from "../../ui/Icons/Icons";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const INITIAL_FORM_DATA = { stock: "" };

const StoreProductLogsModal = ({ isOpen, logs: logsData, onClose, onUpdate }) => {
  const storeProduct = logsData?.storeProduct || {};
  const adjustStock = logsData?.adjustStock || false;

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const fetchStoreProductLogs = async () => {
      if (storeProduct.id) {
        setFormData(storeProduct);

        try {
          const response = await getStoreProductLogs({
            "store-product-id": storeProduct.id,
            months
          });
          setLogs(response.data);
        } catch (error) {
          // Error silencioso - logs no críticos
        }
      } else {
        setFormData(INITIAL_FORM_DATA);
        setLogs([]);
      }
    };

    fetchStoreProductLogs();
  }, [storeProduct.id, months]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateAdjustStock = async () => {
    const response = await updateStoreProduct(formData);

    if (response.status === 200) {
      setFormData(INITIAL_FORM_DATA);
      onClose();
      onUpdate(response.data);
      showSuccess("Ajuste exitoso");
    } else {
      showError("Error al realizar el ajuste", "Por favor llame a soporte técnico");
    }
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={`${adjustStock ? "Ajustar cantidad" : "Historial de movimientos"} de ${formData.product?.code} - ${formData.product?.name}`}
    >
     <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
       <Grid item xs={12} className="card">
     <Grid container spacing={2}>

        {adjustStock && (
        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth label="Cantidad" type="text"
            value={formData.stock}
            placeholder="Cantidad"
            name={"stock"}
            onChange={handleInputChange}
          />
        </Grid>
        )}

        {adjustStock && (
        <Grid item xs={12} md={6}>
          <CustomButton
            onClick={() => handleCreateAdjustStock()}
            fullWidth
            startIcon={<SaveIcon />}
          >
            Ajustar
          </CustomButton>
        </Grid>
        )}

        {!adjustStock && (
        <Grid item xs={12} md={12}>
          <TextField
            size="small"
            label="Meses anteriores (iniciar desde cuantos meses atras)"
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            inputProps={{ min: 1, max: 12 }}
            sx={{ width: '100%', mb: 2 }}
          />
          <h1>Últimos movimientos</h1>
          <DataTable
            noDataComponent="Sin movimientos"
            data={logs}
            columns={[
              {
                name: "Fecha y hora",
                selector: (row) => getFormattedDateTime(row.created_at),
              },
              {
                name: "Descripción",
                selector: (row) => row.description,
              },
              {
                name: "Stock anterior",
                selector: (row) => row.previous_stock,
              },
              {
                name: "Stock actualizado",
                selector: (row) => row.updated_stock,
              },
              {
                name: "Diferencia",
                selector: (row) => row.difference,
              },
              {
                name: "Usuario",
                selector: (row) => row.user_username,
              },
              {
                name: "OK",
                selector: (row) => chooseIcon(row.is_consistent),
              },
            ]}
          />
        </Grid>
        )}
      </Grid>
       </Grid>
      </Grid>
     </CustomModal>
  );
};

export default StoreProductLogsModal;
