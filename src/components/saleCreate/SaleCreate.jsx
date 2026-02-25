import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import TabCart from "../cart/TabCart";
import { Grid } from "@mui/material";

const SaleCreate = () => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12} className="custom-section">
        <SearchProduct />
      </Grid>
      <Grid xs={12} className="custom-section">
        <TabCart />
      </Grid>
    </Grid>
  );
};

export default SaleCreate;
