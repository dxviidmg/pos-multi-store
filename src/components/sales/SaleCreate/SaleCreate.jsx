import React, { useRef } from "react";
import SearchProduct from "../../products/SearchProduct/SearchProduct";
import MultiCart from "../../inventory/Cart/MultiCart";
import { Grid } from "@mui/material";

const SaleCreate = () => {
  const searchInputRef = useRef(null);
  return (
    <>
      <Grid container>
      <Grid item xs={12} className="card" sx={{ marginBottom: '0.75rem' }}>
        <SearchProduct searchInputRef={searchInputRef} />
        <MultiCart searchInputRef={searchInputRef} />
      </Grid>
      </Grid>
    </>
  );
};

export default SaleCreate;
