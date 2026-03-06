import React from "react";
import SearchProduct from "../../products/SearchProduct/SearchProduct";
import MultiCart from "../../inventory/Cart/MultiCart";
import { Grid } from "@mui/material";

const SaleCreate = () => {
  return (
    <>
      <Grid container>
      <Grid item xs={12} className="card">
        <SearchProduct />
      </Grid>
      <Grid item xs={12} className="card">
        <MultiCart />
      </Grid>
      </Grid>
    </>
  );
};

export default SaleCreate;
