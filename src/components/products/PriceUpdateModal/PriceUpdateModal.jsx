import React, { useState, useMemo, useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { Grid, TextField, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { updatePricesProducts } from "../../../api/products";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { formatCurrency } from "../../../utils/utils";
import { getPriceErrors } from "../ProductModal/productValidation";

const EMPTY_PRICES = { cost: "", unit_price: "", wholesale_price: "", min_wholesale_quantity: "" };

const pricesOf = (product) => ({
  cost: product.cost || "",
  unit_price: product.unit_price || "",
  wholesale_price: product.wholesale_price || "",
  min_wholesale_quantity: product.min_wholesale_quantity || "",
});

const formatOptionalCurrency = (value) => (value ? formatCurrency(value) : "");

const COMPARISON_COLUMNS = [
  { name: "Código", selector: (row) => row.code || "" },
  { name: "Producto", selector: (row) => row.name },
  { name: "Costo", selector: (row) => formatOptionalCurrency(row.cost) },
  { name: "Unitario", selector: (row) => formatOptionalCurrency(row.unit_price) },
  { name: "Mayoreo", selector: (row) => formatOptionalCurrency(row.wholesale_price) },
  { name: "Cant. mín.", selector: (row) => row.min_wholesale_quantity || "" },
];

const PriceUpdateModal = ({ isOpen, onClose, selectedProducts, onSuccess }) => {
  const [formData, setFormData] = useState(EMPTY_PRICES);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedDifferentPrices, setConfirmedDifferentPrices] = useState(false);

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

  const showForm = hasSamePrices || confirmedDifferentPrices;

  useEffect(() => {
    setFormData(hasSamePrices && selectedProducts.length > 0 ? pricesOf(selectedProducts[0]) : EMPTY_PRICES);
  }, [selectedProducts, hasSamePrices]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmedDifferentPrices(false);
    }
  }, [isOpen]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const selectedIds = selectedProducts.map((p) => p.id);
    // Solo se envían los valores llenados
    const prices = Object.fromEntries(Object.entries(formData).filter(([, value]) => value !== ""));

    try {
      await updatePricesProducts({ product_ids: selectedIds, ...prices });
      showSuccess("Precios actualizados");
      setFormData(EMPTY_PRICES);
      setConfirmedDifferentPrices(false);
      onClose();
      onSuccess();
    } catch (error) {
      showRequestError("actualizar los precios", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormEmpty = Object.values(formData).every((value) => !value);
  const priceErrors = getPriceErrors(formData, { partial: true });

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title={`Actualización masiva de costos y precios (${selectedProducts.length} productos)`}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {!hasSamePrices && !confirmedDifferentPrices ? (
          <>
            <Grid item xs={12}>
              <Alert severity="warning" variant="filled">
                Los productos seleccionados no comparten el mismo costo, precio unitario, precio de mayoreo o cantidad mínima de mayoreo. Los campos se mostrarán vacíos y solo se actualizarán los valores que llenes.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <SimpleTable
                data={selectedProducts}
                columns={COMPARISON_COLUMNS}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton
                fullWidth
                onClick={() => setConfirmedDifferentPrices(true)}
                startIcon={<WarningAmberIcon />}
                color="warning"
              >
                Continuar con la actualización masiva
              </CustomButton>
            </Grid>
          </>
        ) : showForm ? (
          <>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Costo" type="number"
                value={formData.cost} name="cost" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={!!priceErrors.cost}
                helperText={priceErrors.cost}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Precio unitario" type="number"
                value={formData.unit_price} name="unit_price" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={!!priceErrors.unitPrice}
                helperText={priceErrors.unitPrice}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Precio mayoreo" type="number"
                value={formData.wholesale_price} name="wholesale_price" onChange={handleDataChange}
                inputProps={{ min: 0, max: formData.unit_price || undefined }}
                error={!!priceErrors.wholesale}
                helperText={priceErrors.wholesale}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Cantidad mínima de mayoreo" type="number"
                value={formData.min_wholesale_quantity} name="min_wholesale_quantity" onChange={handleDataChange}
                inputProps={{ min: 0 }}
                error={!!priceErrors.minQty}
                helperText={priceErrors.minQty}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton fullWidth onClick={handleSubmit} disabled={isFormEmpty || priceErrors.hasAnyError || isLoading} startIcon={<SaveIcon />}>
                {isLoading ? "Actualizando..." : "Actualizar precios"}
              </CustomButton>
            </Grid>
          </>
        ) : null}
      </Grid>
    </CustomModal>
  );
};

export default PriceUpdateModal;
