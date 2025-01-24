import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProductLogs } from "../apis/products";
import { getFormattedDateTime } from "../utils/utils";


const INITIAL_FORM_DATA = {};

const LogsModal = () => {
  const { showLogsModal, storeProduct } = useSelector(
    (state) => state.LogsModalReducer
  );

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchStoreProductLogs = async () => {
      console.log('storeProduct', storeProduct)
      if (storeProduct.id) {
        setFormData(storeProduct);
  
        try {
          // Esperamos la respuesta de getStoreProductLogs
          const response = await getStoreProductLogs(storeProduct);
          console.log(response.data);
          setLogs(response.data);
        } catch (error) {
          console.error('Error fetching store product logs:', error);
          // Manejo del error, puedes mostrar un mensaje o realizar alguna otra acción
        }
  
      } else {
        setFormData(INITIAL_FORM_DATA);
        setLogs([]);
      }
    };
  
    // Llamamos a la función asincrónica
    fetchStoreProductLogs();
  }, [storeProduct]);


  return (
    <CustomModal showOut={showLogsModal} title="Detalle de stock">
      <Row className="section">
        <Col md={3}>
          <Form.Label>Codigo</Form.Label>
          <Form.Control
            type="text"
            value={formData.product_code}
            placeholder="Codigo"
            disabled
          />
        </Col>

        <Col md={3}>
          <Form.Label>Marca</Form.Label>
          <Form.Control
            type="text"
            value={formData.product_brand}
            placeholder="Marca"
            disabled
          />
        </Col>

        <Col md={6}>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={formData.product_name}
            placeholder="Nombre"
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="text"
            value={formData.stock}
            placeholder="Cantidad"
            disabled
          />
        </Col>
        <Col md={12}>
          <Form.Label className="fw-bold">Logs</Form.Label>

          <CustomTable
            data={logs}
            columns={[
              {
                name: "Fecha",
                selector: (row) => getFormattedDateTime(row.created_at),
                grow: 2
              },
              {
                name: "Descripcion",
                selector: (row) => row.description,
                grow: 2
              },
              {
                name: "Stock anterior",
                selector: (row) => row.previous_stock,
              },
              {
                name: "Stock actualizado",
                selector: (row) => row.updated_stock,
              },
              {
                name: "Diferencia",
                selector: (row) => row.difference,
              },
              {
                name: "Hecho por",
                selector: (row) => row.user_username,
                grow: 2
              }
            ]}
          />
        </Col>

      </Row>
    </CustomModal>
  );
};

export default LogsModal;
