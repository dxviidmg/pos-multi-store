import { getStoreProducts } from "../../../api/products";
import { exportToExcel } from "../../../utils/utils";
import { useFilteredList } from "./useFilteredList";

/** Inventario de la sucursal activa filtrado por `params` (ver `useFilteredList`). */
export const useStoreProductList = (initialParams) =>
  useFilteredList(getStoreProducts, initialParams, "cargar el inventario");

/** Exporta el inventario a Excel con Código, Marca, Nombre y Stock. */
export const downloadStoreProducts = (storeProducts, fileName) => {
  const data = storeProducts.map(({ product: { code, brand_name, name }, stock }) => ({
    Código: code, Marca: brand_name, Nombre: name, Stock: stock,
  }));
  exportToExcel(data, fileName);
};
