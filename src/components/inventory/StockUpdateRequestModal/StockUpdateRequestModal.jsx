import React, { useState } from "react";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { Grid, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { createStockUpdateRequest } from "../../../api/stockRequests";

const MAX_STOCK = 99999999;

const StockUpdateRequestModal = ({ isOpen, storeProduct, onClose }) => {
  const [requestedStock, setRequestedStock] = useState("");
  const [loading, setLoading] = useState(false);

  /** Envía la solicitud; `isAdjustment` = la cantidad la capturó el usuario. */
  const submitRequest = async (requested_stock, isAdjustment) => {
    setLoading(true);
    try {
      await createStockUpdateRequest({ store_product: storeProduct.id, requested_stock });
      showSuccess("Solicitud enviada");
      if (isAdjustment) setRequestedStock("");
      onClose();
    } catch (err) {
      showRequestError("enviar la solicitud", err);
      if (isAdjustment && err.response?.status === 400) onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => submitRequest(Number(requestedStock), true);
  const handleConfirmCurrent = () => submitRequest(storeProduct.stock, false);

  const handleRequestedStockChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setRequestedStock("");
      return;
    }
    const num = Math.max(0, Math.min(Number(raw), MAX_STOCK));
    setRequestedStock(num.toString());
  };

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Solicitar ajuste de stock">
      <ModalBody>
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Código" value={storeProduct?.product?.code || ""} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Producto" value={storeProduct?.product?.name || ""} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Stock actual" value={storeProduct?.stock ?? ""} disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Cantidad correcta" type="number" value={requestedStock} onChange={handleRequestedStockChange} inputProps={{ min: 0, max: MAX_STOCK }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomButton fullWidth onClick={handleConfirmCurrent} disabled={requestedStock !== "" || loading} startIcon={<SendIcon />}>
                {loading ? "Enviando..." : "La cantidad es correcta"}
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomButton fullWidth onClick={handleSubmit} disabled={requestedStock === "" || loading} startIcon={<SendIcon />}>
                {loading ? "Enviando..." : "Solicitar ajuste"}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default StockUpdateRequestModal;
