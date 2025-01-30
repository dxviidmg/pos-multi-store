import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import TabCart from "../cart/TabCart";

const SaleCreate = () => {
  return (
    <div>
      <div className="section2">
        <SearchProduct></SearchProduct>
      </div>

      <div className="section2">
        <TabCart />
      </div>
    </div>
  );
};

export default SaleCreate;
