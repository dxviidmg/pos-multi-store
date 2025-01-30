import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import TabCart from "../cart/TabCart";

const SaleCreate = () => {
  return (
    <div>
      <div className="custom-section">
        <SearchProduct></SearchProduct>
      </div>

      <div className="custom-section">
        <TabCart />
      </div>
    </div>
  );
};

export default SaleCreate;
