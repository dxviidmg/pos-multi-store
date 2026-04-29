import React, { useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { Grid, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { showSuccess, showError } from "../../../utils/alerts";
import httpClient from "../../../api/httpClient";
import { getApiUrl } from "../../../api/utils";

const StockUpdateRequestModal = ({ isOpen, storeProduct, onClose }) => {
  const [requestedStock, setRequestedStock] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await httpClient.post(getApiUrl("stock-update-request"), {
        store_product: storeProduct.id,
        requested_stock: Number(requestedStock),
      });
      showSuccess("Solicitud enviada");
      setRequestedStock("");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo enviar la solicitud";
      showError("Error", msg);
      if (err.response?.status === 400) onClose();
    }
    setLoading(false);
  };

  const handleSubmit2 = async () => {
    setLoading(true);
    try {
      await httpClient.patch(getApiUrl(`store-product/${storeProduct.id}`), {
        requires_stock_verification: false,
      });
      showSuccess("Stock verificado");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "No se pudo verificar el stock";
      showError("Error", msg);
    }
    setLoading(false);
  };

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Solicitar ajuste de stock">
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
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
              <TextField size="small" fullWidth label="Cantidad correcta" type="number" value={requestedStock} onChange={(e) => setRequestedStock(e.target.value)} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomButton fullWidth onClick={handleSubmit2} disabled={requestedStock !== "" || loading} startIcon={<SendIcon />}>
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
      </Grid>
    </CustomModal>
  );
};

export default StockUpdateRequestModal;
