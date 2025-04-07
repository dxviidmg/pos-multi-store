import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, FormCheck } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { deleteBrands, getBrands } from "../apis/brands";
import BrandModal from "../brandModal/BrandModal";
import { useDispatch } from "react-redux";
import {
  hideBrandModal,
  showBrandModal,
} from "../redux/brandModal/BrandModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import { EditIcon } from "../commons/icons/Icons";

const BrandList = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (brand) => {
    dispatch(hideBrandModal());
    setTimeout(() => dispatch(showBrandModal(brand)));
  };

  const handleUpdateBrandList = (updatedBrand) => {
    setBrands((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updatedBrand.id);
      return brandExists
        ? prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
        : [...prevBrands, updatedBrand];
    });
  };

  const handleDeleteBrands = async () => {
    console.log(selectedRows);

    const productsCount = selectedRows.reduce((sum, element) => sum + element.product_count, 0);


    if (productsCount > 0){
      Swal.fire({
        icon: "error",
        title: "Error al borrar marcas",
        text: "Las marcas no deben tener productos relacionados",
        timer: 5000,
      });
      return
    }
    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteBrands(selectedIds);

    console.log(response);
    if (response.status === 200) {
      const updatedBrands = brands.filter(
        (brand) => !selectedIds.includes(brand.id)
      );

      setBrands(updatedBrands);

      Swal.fire({
        icon: "success",
        title: "Marcas eliminados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al borrar marcas",
        timer: 5000,
      });
    }
  };

  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  return (
    <div className="custom-section">
      <BrandModal onUpdateBrandList={handleUpdateBrandList}></BrandModal>{" "}
      <Form.Label className="fw-bold">Lista de marcas</Form.Label>
      <br></br>
      <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
      <CustomButton
        onClick={handleDeleteBrands}
        disabled={
          selectedRows.length === 0 ||
          !confirmDeletion ||
          getUserData().role !== "owner"
        }
      >
        Borrar marcas
      </CustomButton>
      <FormCheck
        label={"Confirmar borrado"}
        checked={confirmDeletion}
        onChange={handleCheck}
      ></FormCheck>
      <CustomTable
        progressPending={loading}
        data={brands}
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
              <CustomButton onClick={() => handleOpenModal(row)}>
                <EditIcon></EditIcon>
              </CustomButton>
            ),
          },
        ]}
      />
    </div>
  );
};

export default BrandList;
