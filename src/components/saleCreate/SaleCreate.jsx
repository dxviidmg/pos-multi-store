import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import Cart from "../cart/Cart";
import { Grid } from "@mui/material";

const SaleCreate = () => {
  return (
    <>
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <SearchProduct />
      </Grid>
      <Grid item xs={12} className="custom-section">
        <Cart />
      </Grid>
      </Grid>
    </>
  );
};

export default SaleCreate;
