import React, { useEffect, useState } from "react";

import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import Swal from "sweetalert2";
import { getDepartments } from "../../../api/departments";
import CustomButton from "../../ui/Button/Button";
import { reassignProducts } from "../../../api/products";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const REASSIGN_TYPE = [
  {
    value: "brand",
    label: "Marca",
  },
  {
    value: "department",
    label: "Departamento",
  },
];

const DELETE_ORIGIN = [
  {
    value: true,
    label: "Si",
  },
  {
    value: false,
    label: "No",
  },
];

const INITIAL_FORM_DATA = {
  reassign_type: "",
  origin_id: "",
  destination_id: "",
  delete_origin: ""
};
const ProductReassign = () => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [params, setParams] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    const fetchStoreProducts = async () => {
      setLoading(true);
      if (params.reassign_type === "department") {
        const departments = await getDepartments();
        setOptions(departments.data);
      } else if (params.reassign_type === "brand") {
        const departments = await getBrands();
        setOptions(departments.data);
      } else {
        setOptions([]);
      }
      setLoading(false);
    };

    fetchStoreProducts();
  }, [params.reassign_type]);

  const handleReassignProducts = async () => {
    const response = await reassignProducts(params);

    if (response.status === 200) {
      setParams(INITIAL_FORM_DATA);
      Swal.fire({
        icon: "success",
        title: "Productos reasignados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al reasignar Productos",
        timer: 5000,
      });
    }
  };

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <CustomSpinner isLoading={loading} />
        <h1>Reasignación de productos</h1>
        <Grid container spacing={2} className="mt-3">
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de reasignación</InputLabel>
              <Select fullWidth size="small" value={params.reassign_type}
            onChange={handleDataChange}
            name="reassign_type"
            //              disabled={isLoading}
           label="Tipo de reasignación">
            <MenuItem value="">Selecciona</MenuItem>
            {REASSIGN_TYPE.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
            </FormControl>
        </Grid>

        <Grid item xs={3}>
          {" "}
          <FormControl fullWidth size="small">
              <InputLabel>Origen</InputLabel>
              <Select fullWidth size="small" value={options.origin_id}
            onChange={handleDataChange}
            name="origin_id"
            //              disabled={isLoading}
           label="Origen">
            <MenuItem value="">Origen</MenuItem>
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name} ({option.product_count})
              </MenuItem>
            ))}
          </Select>
            </FormControl>
        </Grid>

        <Grid item xs={3}>
          {" "}
          <FormControl fullWidth size="small">
              <InputLabel>Destino</InputLabel>
              <Select fullWidth size="small" value={options.destination_id}
            onChange={handleDataChange}
            name="destination_id"
            //              disabled={isLoading}
           label="Destino">
            <MenuItem value="">Destino</MenuItem>
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name} ({option.product_count})
              </MenuItem>
            ))}
          </Select>
            </FormControl>
        </Grid>

        <Grid item xs={3}>
          {" "}
          <FormControl fullWidth size="small">
              <InputLabel>Borrar origen</InputLabel>
              <Select fullWidth size="small" value={options.delete_origin}
            onChange={handleDataChange}
            name="delete_origin"
            //              disabled={isLoading}
           label="Borrar origen">
            <MenuItem value="">Selecciona</MenuItem>
            {DELETE_ORIGIN.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
            </FormControl>
        </Grid>

        <Grid item xs={12} className="d-flex flex-column justify-content-end">
          <CustomButton
            fullWidth={true}
            disabled={
              Object.values(params).some((value) => value === "") ||
              params.origin_id === params.destination_id
            }
            onClick={handleReassignProducts}
            startIcon={<SwapHorizIcon />}
          >
            Reasignar
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
    </Grid>
  );
};

export default ProductReassign;
