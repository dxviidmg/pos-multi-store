import React, { useState, useMemo, useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { Grid, TextField, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { updatePricesProducts } from "../../../api/products";
import { showSuccess, showError } from "../../../utils/alerts";

const PriceUpdateModal = ({ isOpen, onClose, selectedProducts, onSuccess }) => {
  const [formData, setFormData] = useState({
    cost: "",
    unit_price: "",
    wholesale_price: "",
    min_wholesale_quantity: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const hasSamePrices = useMemo(() => {
    if (selectedProducts.length < 2) return true;
    const first = selectedProducts[0];
    return selectedProducts.every(
      (p) =>
        p.cost === first.cost &&
        p.unit_price === first.unit_price &&
        p.wholesale_price === first.wholesale_price &&
        p.min_wholesale_quantity === first.min_wholesale_quantity
    );
  }, [selectedProducts]);

  useEffect(() => {
    if (hasSamePrices && selectedProducts.length > 0) {
      const first = selectedProducts[0];
      setFormData({
        cost: first.cost || "",
        unit_price: first.unit_price || "",
        wholesale_price: first.wholesale_price || "",
        min_wholesale_quantity: first.min_wholesale_quantity || "",
      });
    }
  }, [selectedProducts, hasSamePrices]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const selectedIds = selectedProducts.map((p) => p.id);
    const prices = {};
    if (formData.cost !== "") prices.cost = formData.cost;
    if (formData.unit_price !== "") prices.unit_price = formData.unit_price;
    if (formData.wholesale_price !== "") prices.wholesale_price = formData.wholesale_price;
    if (formData.min_wholesale_quantity !== "") prices.min_wholesale_quantity = formData.min_wholesale_quantity;

    const response = await updatePricesProducts({ product_ids: selectedIds, ...prices });

    if (response.status === 200) {
      showSuccess("Precios actualizados");
      setFormData({ cost: "", unit_price: "", wholesale_price: "", min_wholesale_quantity: "" });
      onClose();
      onSuccess();
    } else {
      showError("Error al actualizar precios");
    }
    setIsLoading(false);
  };

  const isFormEmpty = !formData.cost && !formData.unit_price && !formData.wholesale_price && !formData.min_wholesale_quantity;

  const isWholesaleInconsistent = (formData.wholesale_price !== "") !== (formData.min_wholesale_quantity !== "");

  const isWholesaleHigher = formData.wholesale_price !== "" && formData.unit_price !== "" && Number(formData.wholesale_price) >= Number(formData.unit_price);

  const isCostHigher = formData.cost !== "" && formData.unit_price !== "" && Number(formData.cost) >= Number(formData.unit_price);

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title={`Actualización masiva de costos y precios (${selectedProducts.length} productos)`}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {!hasSamePrices ? (
          <Grid item xs={12}>
            <Alert severity="warning" variant="filled">
              Los productos seleccionados no comparten el mismo costo, precio unitario, precio de mayoreo o cantidad mínima de mayoreo. La actualización masiva solo está disponible cuando todos estos valores coinciden.
            </Alert>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Costo" type="number"
                value={formData.cost} name="cost" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={isCostHigher}
                helperText={isCostHigher ? "El costo debe ser menor al precio unitario" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Precio unitario" type="number"
                value={formData.unit_price} name="unit_price" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={isCostHigher}
                helperText={isCostHigher ? "Debe ser mayor al costo" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Precio mayoreo" type="number"
                value={formData.wholesale_price} name="wholesale_price" onChange={handleDataChange}
                inputProps={{ min: 0, max: formData.unit_price || undefined }}
                error={isWholesaleHigher || (formData.wholesale_price !== "" && formData.min_wholesale_quantity === "")}
                helperText={isWholesaleHigher ? "Debe ser menor al precio unitario" : (formData.wholesale_price !== "" && formData.min_wholesale_quantity === "") ? "Requiere cantidad mínima mayoreo" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Cantidad mínima de mayoreo" type="number"
                value={formData.min_wholesale_quantity} name="min_wholesale_quantity" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={formData.min_wholesale_quantity !== "" && formData.wholesale_price === ""}
                helperText={(formData.min_wholesale_quantity !== "" && formData.wholesale_price === "") ? "Requiere precio mayoreo" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton fullWidth onClick={handleSubmit} disabled={isFormEmpty || isWholesaleInconsistent || isWholesaleHigher || isCostHigher || isLoading} startIcon={<SaveIcon />}>
                {isLoading ? "Actualizando..." : "Actualizar precios"}
              </CustomButton>
            </Grid>
          </>
        )}
      </Grid>
    </CustomModal>
  );
};

export default PriceUpdateModal;
