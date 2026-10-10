import React from "react";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { useBrands } from "../../../hooks/useBrands";
import { useDepartments } from "../../../hooks/useDepartments";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { reassignProducts } from "../../../api/products";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { useForm } from "../../../hooks/useForm";
import CustomButton from "../../ui/Button/Button";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PageHeader from "../../ui/PageHeader";

const REASSIGN_TYPE = [
  { value: "brand", label: "Marca" },
  { value: "department", label: "Departamento" },
];

const DELETE_ORIGIN = [
  { value: true, label: "Si" },
  { value: false, label: "No" },
];

const INITIAL_FORM_DATA = {
  reassign_type: "",
  origin_id: "",
  destination_id: "",
  delete_origin: "",
};

const ProductReassign = () => {
  const { values: params, handleChange: handleDataChange, reset } = useForm(INITIAL_FORM_DATA);
  const brandsQuery = useBrands();
  const departmentsQuery = useDepartments();
  const selectedQuery = { brand: brandsQuery, department: departmentsQuery }[params.reassign_type];
  const options = selectedQuery?.data || [];
  const loading = selectedQuery?.isLoading || false;
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const optionsDisabled = !loading && Boolean(params.reassign_type) && options.length === 0;

  const handleReassignProducts = async () => {
    try {
      await reassignProducts(params);
      reset();
      invalidateCatalogOptions();
      showSuccess("Productos reasignados");
    } catch (error) {
      showRequestError("reasignar los productos", error);
    }
  };

  const isFormIncomplete = Object.values(params).some((v) => v === "") || params.origin_id === params.destination_id;

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <CustomSpinner isLoading={loading} />
        <PageHeader title="Reasignación de productos" />

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de reasignación</InputLabel>
              <Select value={params.reassign_type} onChange={handleDataChange} name="reassign_type" label="Tipo de reasignación">
                <MenuItem value="">Selecciona</MenuItem>
                {REASSIGN_TYPE.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Origen</InputLabel>
              <Select value={params.origin_id} onChange={handleDataChange} name="origin_id" label="Origen" disabled={optionsDisabled}>
                <MenuItem value="">Origen</MenuItem>
                {loading && <MenuItem disabled>Cargando...</MenuItem>}
                {options.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name} ({opt.product_count})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Destino</InputLabel>
              <Select value={params.destination_id} onChange={handleDataChange} name="destination_id" label="Destino" disabled={optionsDisabled}>
                <MenuItem value="">Destino</MenuItem>
                {loading && <MenuItem disabled>Cargando...</MenuItem>}
                {options.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name} ({opt.product_count})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Eliminar origen</InputLabel>
              <Select value={params.delete_origin} onChange={handleDataChange} name="delete_origin" label="Eliminar origen">
                <MenuItem value="">Selecciona</MenuItem>
                {DELETE_ORIGIN.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton fullWidth disabled={isFormIncomplete} onClick={handleReassignProducts} startIcon={<SwapHorizIcon />}>
              Reasignar
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductReassign;
