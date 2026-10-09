import React, { useEffect, useMemo, useState } from "react";
import { Grid, TextField, LinearProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import { chooseIcon } from "../../ui/Icons/Icons";
import { getStoreProductLogs, updateStoreProduct } from "../../../api/products";
import { getFormattedDateTime } from "../../../utils/utils";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { logger } from "../../../utils/logger";
import { useForm } from "../../../hooks/useForm";

const INITIAL_FORM_DATA = { stock: "" };
const MAX_STOCK = 99999999;
const MAX_MONTHS = 12;
const FETCH_DELAY = 500;

const COLUMNS = [
  { name: "Fecha y hora", selector: (row) => getFormattedDateTime(row.created_at) },
  { name: "Descripción", selector: (row) => row.description },
  { name: "Stock anterior", selector: (row) => row.previous_stock },
  { name: "Stock actualizado", selector: (row) => row.updated_stock },
  { name: "Diferencia", selector: (row) => row.difference },
  { name: "Usuario", selector: (row) => row.user_username },
  { name: "OK", selector: (row) => chooseIcon(row.is_consistent) },
];

/** Solo dígitos, con tope en MAX_STOCK. */
const sanitizeStock = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits === "" ? "" : Math.min(Number(digits), MAX_STOCK).toString();
};

const clampMonths = (value) => Math.min(MAX_MONTHS, Math.max(1, Math.trunc(Number(value)) || 1));

/**
 * Historial de movimientos de un store-product o, con `adjustStock`, ajuste de su cantidad.
 * `logs` = `{ storeProduct, adjustStock }`.
 */
const StoreProductLogsModal = ({ isOpen, logs: logsData, onClose, onUpdate }) => {
  const storeProduct = useMemo(() => logsData?.storeProduct || {}, [logsData]);
  const adjustStock = logsData?.adjustStock || false;

  const { values: formData, setValue: setFormValue, setValues: setFormData, reset: resetForm } = useForm(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeProduct.id) {
      setFormData(storeProduct);
    } else {
      resetForm();
    }
    setLogs([]);
  }, [storeProduct, setFormData, resetForm]);

  // Carga con espera para no consultar en cada tecla de "meses"; descarta respuestas viejas
  useEffect(() => {
    if (!storeProduct.id) return undefined;
    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getStoreProductLogs({ "store-product-id": storeProduct.id, months });
        if (active) setLogs(response.data);
      } catch (error) {
        // Historial no crítico: no interrumpe al usuario
        logger.warn("No se pudo cargar el historial de stock", error);
      } finally {
        if (active) setLoading(false);
      }
    }, FETCH_DELAY);

    return () => {
      active = false;
      clearTimeout(timer);
      setLoading(false);
    };
  }, [storeProduct.id, months]);

  const handleCreateAdjustStock = async () => {
    try {
      const response = await updateStoreProduct(formData);
      resetForm();
      onClose();
      onUpdate(response.data);
      showSuccess("Stock ajustado");
    } catch (error) {
      showRequestError("ajustar el stock", error);
    }
  };

  const isUnchanged = String(formData.stock) === String(storeProduct.stock);
  const action = adjustStock ? (isUnchanged ? "Confirmar cantidad" : "Editar cantidad") : "Historial de movimientos";

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={`${action} de ${formData.product?.code} - ${formData.product?.name}`}
    >
      <ModalBody>
        <Grid item xs={12} className="card">
          {adjustStock ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField size="small" fullWidth label="Cantidad" type="text"
                  value={formData.stock}
                  placeholder="Cantidad"
                  name="stock"
                  onChange={(e) => setFormValue("stock", sanitizeStock(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomButton onClick={handleCreateAdjustStock} fullWidth startIcon={<SaveIcon />}>
                  {isUnchanged ? "Confirmar" : "Modificar"}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <>
              {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}
              <TextField
                size="small"
                label="Meses anteriores (iniciar desde cuántos meses atrás)"
                type="number"
                value={months}
                onChange={(e) => setMonths(clampMonths(e.target.value))}
                inputProps={{ min: 1, max: MAX_MONTHS }}
                sx={{ width: "100%", mb: 2 }}
              />
              <PageHeader title="Últimos movimientos" plain />
              <DataTable noDataComponent="Sin movimientos" data={logs} columns={COLUMNS} />
            </>
          )}
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default StoreProductLogsModal;
