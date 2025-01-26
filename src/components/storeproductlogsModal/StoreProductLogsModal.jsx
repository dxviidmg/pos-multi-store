import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { getStoreProductLogs, updateStoreProduct } from "../apis/products";
import { getFormattedDateTime } from "../utils/utils";
import Swal from "sweetalert2";
import CustomButton from "../commons/customButton/CustomButton";
import { hideLogsModal } from "../redux/logsModal/LogsModalActions";

const INITIAL_FORM_DATA = {};

const StoreProductLogsModal = ({ onUpdateStoreProductList }) => {
  const dispatch = useDispatch();
  const { showLogsModal, storeProduct, adjustStock } = useSelector(
    (state) => state.LogsModalReducer
  );

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchStoreProductLogs = async () => {
      if (storeProduct.id) {
        setFormData(storeProduct);

        try {
          // Esperamos la respuesta de getStoreProductLogs
          const response = await getStoreProductLogs(storeProduct);
          setLogs(response.data);
        } catch (error) {
          console.error("Error fetching store product logs:", error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateAdjustStock = async () => {
    const response = await updateStoreProduct(formData);

    if (response.status === 200) {
      setFormData(INITIAL_FORM_DATA);
      dispatch(hideLogsModal());
      onUpdateStoreProductList(response.data);
      Swal.fire({
        icon: "success",
        title: "Ajuste exitoso",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al realizar el ajuste",
        text: "Por favor llame a soporte técnico",
        timer: 5000,
      });
    }
  };

  return (
    <CustomModal
      showOut={showLogsModal}
      title={adjustStock ? "Ajuste de stock" : "Movimientos de stock"}
    >
      <Row className="section">
        <Col md={6}>
          <Form.Label>Codigo</Form.Label>
          <Form.Control
            type="text"
            value={formData.product_code}
            placeholder="Codigo"
            disabled
          />
        </Col>

        <Col md={6}>
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
            disabled={!adjustStock}
            name={"stock"}
            onChange={handleInputChange}
          />
        </Col>

        <Col
          md={3}
          className={`d-flex flex-column justify-content-end ${
            !adjustStock ? "d-none" : ""
          }`}
        >
          <CustomButton
            onClick={() => handleCreateAdjustStock()}
            fullWidth
            disabled={!adjustStock}
          >
            Ajustar
          </CustomButton>
        </Col>

        <Col md={12} className={adjustStock ? "d-none" : ""}>
          <CustomTable
            data={logs}
            columns={[
              {
                name: "Fecha",
                selector: (row) => getFormattedDateTime(row.created_at),
                grow: 2,
                wrap: true,
              },
              {
                name: "Descripcion",
                selector: (row) => row.description,
                grow: 2,
                wrap: true,
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
                name: "Conteo(E/S)",
                selector: (row) => row.difference,
              },
              {
                name: "Hecho por",
                selector: (row) => row.user_username,
                grow: 3,
                wrap: true,
              },
            ]}
          />
        </Col>
      </Row>
    </CustomModal>
  );
};

export default StoreProductLogsModal;
