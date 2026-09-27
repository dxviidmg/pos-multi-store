import React from "react";
import CatalogList from "../CatalogList/CatalogList";
import { deleteBrands } from "../../../api/brands";
import { useBrands } from "../../../hooks/useBrands";
import { useCreateBrand, useUpdateBrand } from "../../../hooks/useBrandMutations";

const LABELS = {
  title: "Marcas",
  singular: "marca",
  create: "Nueva marca",
  deleteSelected: "Eliminar seleccionadas",
  empty: "Sin marcas",
  countUnit: "marca(s)",
  confirmTitle: "¿Eliminar marcas seleccionadas?",
  deleted: "Marcas eliminadas",
  deleteError: "Error al borrar marcas",
  hasProducts: "Las marcas no deben tener productos relacionados",
};

const BrandList = () => (
  <CatalogList
    useData={useBrands}
    deleteFn={deleteBrands}
    useCreate={useCreateBrand}
    useUpdate={useUpdateBrand}
    labels={LABELS}
  />
);

export default BrandList;
