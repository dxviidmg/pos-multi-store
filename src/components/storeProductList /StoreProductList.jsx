import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProducts } from "../apis/products";
import { Container, Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import * as XLSX from "xlsx";
import { getUserData } from "../apis/utils";
import { getFormattedDate, exportToExcel } from "../utils/utils";

const StoreProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getStoreProducts();
      console.log(response);
      setProducts(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);


  const handleExport = () => {
    // Crear una hoja de cálculo a partir de los datos

    const products_to_report = products.map(({ id, product_id, stock_in_other_stores, store, product, ...resto }) => ({
      Código: resto.product_code,
      Descripción: resto.description,
      'Stock total': resto.stock,
      'Stock disponible': resto.available_stock,
      'Stock Reservado': resto.reserved_stock,
    }));
    
    const prefix_name = "Reporte Inventario " + getUserData().store_name 
    exportToExcel(products_to_report, prefix_name)
  };


  return (
    <Container fluid>
      <Row className="section">
        <Col md={12}>
          <Form.Label className="fw-bold">Inventario</Form.Label>

          <br></br>
          <CustomButton onClick={() => handleExport()}>
            Descargar reporte
          </CustomButton>

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
                selector: (row) => row.description,
              },

              {
                name: "Stock total",
                selector: (row) => row.stock,
                wrap: true,
              },

              {
                name: "Stock Disponible",
                selector: (row) => row.available_stock,
              },
              {
                name: "Stock Reservado",
                selector: (row) => row.reserved_stock,
              },
            ]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StoreProductList;
