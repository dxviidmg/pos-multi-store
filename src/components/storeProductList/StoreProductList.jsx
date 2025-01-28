import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProducts } from "../apis/products";
import { Container, Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import { exportToExcel } from "../utils/utils";
import {
  hideLogsModal,
  showLogsModal,
} from "../redux/logsModal/LogsModalActions";
import { useDispatch } from "react-redux";
import StoreProductLogsModal from "../storeproductlogsModal/StoreProductLogsModal";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";

const StoreProductList = () => {
  const dispatch = useDispatch();
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = getUserData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStoreProducts();
      setStoreProducts(response.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    const storeProductsForReport = storeProducts.map(
      ({
        product_code: Código,
        product_brand: Marca,
        product_name: Nombre,
        stock: Stock,
      }) => ({
        Código,
        Marca,
        Nombre,
        Stock,
      })
    );

    const prefixName = "Reporte Inventario " + getUserData().store_name;
    exportToExcel(storeProductsForReport, prefixName);
  };

  const handleOpenModal = (storeProduct, adjustStock) => {
    dispatch(hideLogsModal());
    setTimeout(() => dispatch(showLogsModal(storeProduct, adjustStock)));
  };

  const handleUpdateStoreProductList = (updatedStoreProduct) => {
    setStoreProducts((prevStoreProducts) => {
      const StoreProductsExists = prevStoreProducts.some((b) => b.id === updatedStoreProduct.id);
      return StoreProductsExists
        ? prevStoreProducts.map((b) => (b.id === updatedStoreProduct.id ? updatedStoreProduct : b))
        : [...prevStoreProducts, updatedStoreProduct];
    });
  };

  return (
    <Container fluid>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <StoreProductLogsModal onUpdateStoreProductList={handleUpdateStoreProductList}/>
      <Row className="section">
        <Col md={12}>
          <Form.Label className="fw-bold">Inventario</Form.Label>

          <br />
          <CustomButton onClick={handleDownload}>
            Descargar inventario
          </CustomButton>
          <br />
          <CustomTable
            searcher={true}
            progressPending={loading}
            data={storeProducts}
            columns={[
              {
                name: "Código",
                selector: (row) => row.product_code,
              },
              {
                name: "Marca",
                selector: (row) => row.product_brand,
              },
              {
                name: "Nombre",
                selector: (row) => row.product_name,
                grow: 3,
                wrap: true,
              },

              {
                name: "Stock",
                selector: (row) => row.stock,
              },
              {
                name: "Accciones",
                grow: 4,
                cell: (row) => (
                  <>
                    {user.is_owner && (
                      <CustomButton onClick={() => handleOpenModal(row, true)}>
                        Ajustar cantidad
                      </CustomButton>
                    )}
                    <CustomButton onClick={() => handleOpenModal(row, false)}>
                      Movimientos de stock {user.is_owner}
                    </CustomButton>
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StoreProductList;
