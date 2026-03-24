import React, { useEffect, useState } from "react";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { reassignProducts } from "../../../api/products";
import { showSuccess, showError } from "../../../utils/alerts";
import CustomButton from "../../ui/Button/Button";
import { Grid, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

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
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [params, setParams] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      if (params.reassign_type === "department") {
        const res = await getDepartments();
        setOptions(res.data);
      } else if (params.reassign_type === "brand") {
        const res = await getBrands();
        setOptions(res.data);
      } else {
        setOptions([]);
      }
      setLoading(false);
    };
    fetchOptions();
  }, [params.reassign_type]);

  const handleReassignProducts = async () => {
    const response = await reassignProducts(params);
    if (response.status === 200) {
      setParams(INITIAL_FORM_DATA);
      showSuccess("Productos reasignados");
    } else {
      showError("Error al reasignar productos");
    }
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const isFormIncomplete = Object.values(params).some((v) => v === "") || params.origin_id === params.destination_id;

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <CustomSpinner isLoading={loading} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Reasignación de productos</h1>
        </Stack>

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
              <Select value={params.origin_id} onChange={handleDataChange} name="origin_id" label="Origen">
                <MenuItem value="">Origen</MenuItem>
                {options.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name} ({opt.product_count})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Destino</InputLabel>
              <Select value={params.destination_id} onChange={handleDataChange} name="destination_id" label="Destino">
                <MenuItem value="">Destino</MenuItem>
                {options.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>{opt.name} ({opt.product_count})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Borrar origen</InputLabel>
              <Select value={params.delete_origin} onChange={handleDataChange} name="delete_origin" label="Borrar origen">
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
