import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { FormCheck } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { deleteDepartments, getDepartments } from "../apis/departments";
import { useDispatch } from "react-redux";

import Swal from "sweetalert2";
import {
  hideDepartmentModal,
  showDepartmentModal,
} from "../redux/departmentModal/DepartmentModalActions";
import DepartmentModal from "../departmentModal/DepartmentModal";
import { getUserData } from "../apis/utils";
import { EditIcon } from "../commons/icons/Icons";
import CustomTooltip from "../commons/Tooltip";
import Grid from '@mui/material/Grid';

const DepartmentList = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (department) => {
    dispatch(hideDepartmentModal());
    setTimeout(() => dispatch(showDepartmentModal(department)));
  };

  const handleUpdateDepartmentList = (updatedDepartment) => {
    setDepartments((prevDepartments) => {
      const departmentExists = prevDepartments.some(
        (b) => b.id === updatedDepartment.id
      );
      return departmentExists
        ? prevDepartments.map((b) =>
            b.id === updatedDepartment.id ? updatedDepartment : b
          )
        : [...prevDepartments, updatedDepartment];
    });
  };

  const handleDeleteDepartments = async () => {
    const productsCount = selectedRows.reduce(
      (sum, element) => sum + element.product_count,
      0
    );

    if (productsCount > 0) {
      Swal.fire({
        icon: "error",
        title: "Error al borrar departamentos",
        text: "Los departamentos no deben tener productos relacionados",
        timer: 5000,
      });
      return;
    }

    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteDepartments(selectedIds);

    if (response.status === 200) {
      const updatedDepartments = departments.filter(
        (department) => !selectedIds.includes(department.id)
      );

      setDepartments(updatedDepartments);

      Swal.fire({
        icon: "success",
        title: "Departamentos eliminados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al borrar Departamentos",
        timer: 5000,
      });
    }
  };

  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  return (
    <Grid container spacing={2} className="custom-section">
      <DepartmentModal
        onUpdateDepartmentList={handleUpdateDepartmentList}
      ></DepartmentModal>{" "}
      <Grid xs={12}>
      <h1>Departamentos</h1>
      <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
      <CustomButton
        onClick={handleDeleteDepartments}
        disabled={
          selectedRows.length === 0 ||
          !confirmDeletion ||
          getUserData().role !== "owner"
        }
      >
        Borrar departamentos
      </CustomButton>
      <FormCheck
        label={"Confirmar borrado"}
        checked={confirmDeletion}
        onChange={handleCheck}
      ></FormCheck>
      <CustomTable
        progressPending={loading}
        data={departments}
        setSelectedRows={setSelectedRows}
        columns={[
          {
            name: "Nombre",
            selector: (row) => row.name,
            grow: 2,
            wrap: true,
          },
          {
            name: "Número de productos",
            selector: (row) => row.product_count,
          },
          {
            name: "Acciones",
            cell: (row) => (
              <CustomTooltip text={"Editar Departamento"}>
                <CustomButton onClick={() => handleOpenModal(row)}>
                  <EditIcon></EditIcon>
                </CustomButton>
              </CustomTooltip>
            ),
          },
        ]}
      />
      </Grid>
    </Grid>
  );
};

export default DepartmentList;
