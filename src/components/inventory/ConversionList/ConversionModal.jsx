import React, { useState, useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useConversionUnits, useCreateConversion, useUpdateConversion } from "../../../hooks/useConversions";
import { getStoreProducts } from "../../../api/products";

const INITIAL_FORM = {
  source_store_product: null,
  target_store_product: null,
  factor: "",
  source_unit: "",
  target_unit: "",
};

const ConversionModal = ({ isOpen, onClose, conversion }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [sourceOptions, setSourceOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const { data: units = [] } = useConversionUnits();
  const createMutation = useCreateConversion({ onSuccess: () => onClose() });
  const updateMutation = useUpdateConversion({ onSuccess: () => onClose() });

  const isEditing = Boolean(conversion);

  useEffect(() => {
    if (conversion) {
      setFormData({
        source_store_product: conversion.source_store_product,
        target_store_product: conversion.target_store_product,
        factor: conversion.factor,
        source_unit: conversion.source_unit,
        target_unit: conversion.target_unit,
      });
      setSelectedSource({ id: conversion.source_store_product, label: conversion.source_product_name });
      setSelectedTarget({ id: conversion.target_store_product, label: conversion.target_product_name });
    } else {
      setFormData(INITIAL_FORM);
      setSelectedSource(null);
      setSelectedTarget(null);
    }
  }, [conversion, isOpen]);

  // Buscar productos origen
  useEffect(() => {
    if (!sourceSearch || sourceSearch.length < 2) {
      setSourceOptions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSourceLoading(true);
      try {
        const res = await getStoreProducts({ name: sourceSearch });
        const products = res.data || res;
        setSourceOptions(
          (Array.isArray(products) ? products : []).map((p) => ({
            id: p.id,
            label: p.product?.name || p.name || `Producto ${p.id}`,
          }))
        );
      } catch {
        setSourceOptions([]);
      }
      setSourceLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [sourceSearch]);

  // Buscar productos destino
  useEffect(() => {
    if (!targetSearch || targetSearch.length < 2) {
      setTargetOptions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setTargetLoading(true);
      try {
        const res = await getStoreProducts({ name: targetSearch });
        const products = res.data || res;
        setTargetOptions(
          (Array.isArray(products) ? products : []).map((p) => ({
            id: p.id,
            label: p.product?.name || p.name || `Producto ${p.id}`,
          }))
        );
      } catch {
        setTargetOptions([]);
      }
      setTargetLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetSearch]);

  const handleSubmit = () => {
    const payload = {
      source_store_product: formData.source_store_product,
      target_store_product: formData.target_store_product,
      factor: Number(formData.factor),
      source_unit: formData.source_unit,
      target_unit: formData.target_unit,
    };

    if (isEditing) {
      updateMutation.mutate({ id: conversion.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isFormIncomplete =
    !formData.source_store_product ||
    !formData.target_store_product ||
    !formData.factor ||
    !formData.source_unit ||
    !formData.target_unit;

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar conversión" : "Nueva conversión"}
    >
      <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
        <Typography variant="body2" sx={{ mb: 2.5, color: "text.secondary" }}>
          Define la equivalencia entre dos productos. Ejemplo: 1 Costal = 10 Kilogramos.
        </Typography>

        <Grid container spacing={2}>
          {/* Producto origen */}
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              options={sourceOptions}
              getOptionLabel={(option) => option.label || ""}
              value={selectedSource}
              onChange={(_, value) => {
                setSelectedSource(value);
                setFormData((prev) => ({ ...prev, source_store_product: value?.id || null }));
              }}
              onInputChange={(_, value) => setSourceSearch(value)}
              loading={sourceLoading}
              noOptionsText={sourceSearch.length < 2 ? "Escribe para buscar" : "Sin resultados"}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto origen (ej: Costal)"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {sourceLoading && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Unidad origen */}
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad origen</InputLabel>
              <Select
                value={formData.source_unit}
                onChange={(e) => setFormData((prev) => ({ ...prev, source_unit: e.target.value }))}
                label="Unidad origen"
              >
                {units.map((u) => (
                  <MenuItem key={u.value} value={u.value}>
                    {u.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Factor */}
          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Factor"
              placeholder="Ej: 10"
              type="number"
              value={formData.factor}
              onChange={(e) => setFormData((prev) => ({ ...prev, factor: e.target.value }))}
              inputProps={{ min: 0.001, step: "any" }}
            />
          </Grid>

          {/* Indicador visual */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                1 {units.find((u) => u.value === formData.source_unit)?.label || "—"}
              </Typography>
              <SwapHorizIcon color="primary" />
              <Typography variant="body2" color="text.secondary">
                {formData.factor || "?"} {units.find((u) => u.value === formData.target_unit)?.label || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Producto destino */}
          <Grid item xs={12}>
            <Autocomplete
              size="small"
              options={targetOptions}
              getOptionLabel={(option) => option.label || ""}
              value={selectedTarget}
              onChange={(_, value) => {
                setSelectedTarget(value);
                setFormData((prev) => ({ ...prev, target_store_product: value?.id || null }));
              }}
              onInputChange={(_, value) => setTargetSearch(value)}
              loading={targetLoading}
              noOptionsText={targetSearch.length < 2 ? "Escribe para buscar" : "Sin resultados"}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto destino (ej: Kilo)"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {targetLoading && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Unidad destino */}
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Unidad destino</InputLabel>
              <Select
                value={formData.target_unit}
                onChange={(e) => setFormData((prev) => ({ ...prev, target_unit: e.target.value }))}
                label="Unidad destino"
              >
                {units.map((u) => (
                  <MenuItem key={u.value} value={u.value}>
                    {u.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Botón guardar */}
          <Grid item xs={12}>
            <CustomButton
              fullWidth
              onClick={handleSubmit}
              disabled={isFormIncomplete || loading}
              startIcon={<SaveIcon />}
              sx={{ height: "40px", mt: 0.5 }}
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar conversión" : "Crear conversión"}
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
};

export default ConversionModal;
