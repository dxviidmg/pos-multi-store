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
import LogsModal from "../logsModal/LogsModal";

const StoreProductList = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = getUserData();

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      setIsLoading(true);
      const response = await getStoreProducts();
      console.log(response);
      setProducts(response.data);
      setIsLoading(false);
      const now2 = new Date();
      const diffInSeconds = Math.abs(now2.getTime() - now.getTime()) / 1000;
      console.log("dif", diffInSeconds);
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    const storeProductsForReport = products.map(
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

  return (
    <Container fluid>
      <LogsModal></LogsModal>
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
            progressPending={isLoading}
            data={products}
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
