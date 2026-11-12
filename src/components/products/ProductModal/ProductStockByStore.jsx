import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { getStoreProducts } from "../../../api/products";
import { getStores } from "../../../api/stores";
import { showRequestError } from "../../../utils/alerts";

const COLUMNS = [
  { name: "Nombre", selector: (row) => row.store_name },
  { name: "Stock", selector: (row) => row.stock },
];

/** Stock del producto (por código) en todas las tiendas y almacenes. */
const ProductStockByStore = ({ code }) => {
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchStock = async () => {
      try {
        const [storeProductsRes, storesRes] = await Promise.all([
          getStoreProducts({ code, all_stores: "Y" }),
          getStores(),
        ]);
        if (!active) return;
        const storeMap = Object.fromEntries(storesRes.data.map((store) => [store.id, store.full_name]));
        setStoreProducts(storeProductsRes.data.map((sp) => ({ ...sp, store_name: storeMap[sp.store] || `Tienda #${sp.store}` })));
      } catch (error) {
        if (active) showRequestError("cargar el stock del producto", error);
      }
    };
    fetchStock();
    return () => { active = false; };
  }, [code]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SimpleTable noDataComponent="Sin stock" data={storeProducts} columns={COLUMNS} />
      </Grid>
    </Grid>
  );
};

export default ProductStockByStore;
