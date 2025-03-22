import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getSellers } from "../apis/sellers";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import { hideSellerModal, showSellerModal } from "../redux/sellerModal/SellerModalActions";
import SellerModal from "../sellerModal/SellerModal";


const SellerList = () => {
  const dispatch = useDispatch();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSellers();
      setSellers(salesResponse.data);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  const handleOpenModal = (brand) => {
    dispatch(hideSellerModal());
    setTimeout(() => dispatch(showSellerModal(brand)));
  };


  const handleUpdateSellerList = (updatedBrand) => {
    setSellers((prevBrands) => {
      const brandExists = prevBrands.some((b) => b.id === updatedBrand.id);
      return brandExists
        ? prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
        : [...prevBrands, updatedBrand];
    });
  };

  return (
    <>
      <div className="custom-section">
        <SellerModal onUpdateSellerList={handleUpdateSellerList}></SellerModal>
        <Form.Label className="fw-bold">Lista de vendedores</Form.Label>
        <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
        <CustomTable
        progressPending={loading}
          data={sellers}
          pagination={false}
          columns={[
            {
              name: "Tienda",
              selector: (row) => row.store_detail?.name,
            },

            {
              name: "Username",
              selector: (row) => row.worker.username,
            },
            {
              name: "Nombre",
              selector: (row) => `${row.worker.first_name} ${row.worker.last_name}`,
            },
            {
              name: "Vendido hoy",
              selector: (row) => `$${row.total_sales}`,
            }
          ]}
        />
      </div>
    </>
  );
};

export default SellerList;
