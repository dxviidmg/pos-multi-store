import React from "react";
import CatalogList from "../CatalogList/CatalogList";
import { deleteDepartments } from "../../../api/departments";
import { useDepartments } from "../../../hooks/useDepartments";
import { useCreateDepartment, useUpdateDepartment } from "../../../hooks/useDepartmentMutations";

const LABELS = {
  title: "Departamentos",
  singular: "departamento",
  create: "Nuevo departamento",
  deleteSelected: "Eliminar seleccionados",
  empty: "Sin departamentos",
  countUnit: "departamento(s)",
  confirmTitle: "¿Eliminar departamentos seleccionados?",
  deleted: "Departamentos eliminados",
  deleteError: "Error al borrar departamentos",
  hasProducts: "Los departamentos no deben tener productos relacionados",
};

const DepartmentList = () => (
  <CatalogList
    useData={useDepartments}
    deleteFn={deleteDepartments}
    useCreate={useCreateDepartment}
    useUpdate={useUpdateDepartment}
    labels={LABELS}
  />
);

export default DepartmentList;
