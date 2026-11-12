import React, { useRef, useState } from "react";
import SearchProduct from "../../products/SearchProduct/SearchProduct";
import MultiCart from "../../inventory/Cart/MultiCart";
import { Grid } from "@mui/material";
import { CART_VIEW } from "../../inventory/Cart/cartViewModes";

const SaleCreate = () => {
  const searchInputRef = useRef(null);
  const [cartViewMode, setCartViewMode] = useState(CART_VIEW.TABLE);

  return (
    <Grid container>
      <Grid item xs={12} className="card" sx={{ marginBottom: '0.75rem' }}>
        <SearchProduct searchInputRef={searchInputRef} />
        <MultiCart searchInputRef={searchInputRef} cartViewMode={cartViewMode} setCartViewMode={setCartViewMode} />
      </Grid>
    </Grid>
  );
};

export default SaleCreate;
