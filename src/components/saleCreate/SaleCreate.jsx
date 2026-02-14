import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import TabCart from "../cart/TabCart";
import { padding } from "@mui/system";

const SaleCreate = () => {
  return (
    <div>
      <div className="custom-section">
        <SearchProduct />
      </div>

      <div className="custom-section" style={{marginTop: '1rem'}}>
        <TabCart />
      </div>
    </div>
  );
};

export default SaleCreate;
