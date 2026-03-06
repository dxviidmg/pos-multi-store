import React from "react";
import SearchProduct from "../../products/SearchProduct/SearchProduct";
import MultiCart from "../../inventory/Cart/MultiCart";
import { Grid } from "@mui/material";

const SaleCreate = () => {
  return (
    <>
      <Grid container>
      <Grid item xs={12} className="card" sx={{ marginBottom: '0.75rem' }}>
        <SearchProduct />
        <MultiCart />
      </Grid>
      </Grid>
    </>
  );
};

export default SaleCreate;
