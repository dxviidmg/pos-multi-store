import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProducts, getStoreProductsReport } from "../apis/products";
import { Container, Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import { exportToExcel } from "../utils/utils";


const StoreProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log('dif', diffInSeconds)
    };

    fetchData();
  }, []);


  const handleDownloadStockReport = async () => {
    try {
      const response = await getStoreProductsReport();
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Reporte stock.xlsx"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };


  return (
    <Container fluid>
      <Row className="section">
        <Col md={12}>
          <Form.Label className="fw-bold">Inventario</Form.Label>

          <br/>
          <CustomButton onClick={handleDownloadStockReport}>Descargar inventario</CustomButton>
          <br/>

          <Form.Label className="fw-bold">Logs de un producto</Form.Label>

          <Form.Control
        type="text"
        placeholder="Buscar producto"
      />
          <CustomTable
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
                name: "Stock total",
                selector: (row) => row.stock,
              },

            ]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StoreProductList;
