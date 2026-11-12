import React from "react";
import CatalogList from "../CatalogList/CatalogList";
import { deleteDepartments } from "../../../api/departments";
import { useDepartments } from "../../../hooks/useDepartments";
import { useCreateDepartment, useUpdateDepartment } from "../../../hooks/useCatalogMutations";

const LABELS = {
  title: "Departamentos",
  singular: "departamento",
  create: "Nuevo departamento",
  deleteSelected: "Eliminar seleccionados",
  empty: "Sin departamentos",
  countUnit: "departamento(s)",
  confirmTitle: "¿Eliminar departamentos seleccionados?",
  deleted: "Departamentos eliminados",
  deleteAction: "eliminar los departamentos",
  hasProducts: "Los departamentos seleccionados tienen productos relacionados.",
};

const DepartmentList = () => (
  <CatalogList
    useData={useDepartments}
    queryKey="departments"
    deleteFn={deleteDepartments}
    useCreate={useCreateDepartment}
    useUpdate={useUpdateDepartment}
    labels={LABELS}
  />
);

export default DepartmentList;
