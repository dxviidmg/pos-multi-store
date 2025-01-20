import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { createClient, updateClient } from "../apis/clients";
import { hideSaleModal } from "../redux/saleModal/SaleModalActions";
import CustomTable from "../commons/customTable/customTable";
import { cancelSale } from "../apis/sales";

const INITIAL_FORM_DATA = {
  products: [],
};

const SaleModal = ({ onUpdateClientList }) => {
  const { showSaleModal, sale } = useSelector(
    (state) => state.SaleModalReducer
  );

  const [productsToCancel, setProductsToCancel] = useEffect([]);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("xxx", sale);
    if (sale.id) {
      setFormData(sale);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [sale]);

  const handleSaveClient = async () => {
    const response = await cancelSale(formData);

    if ([200].includes(response.status)) {
      dispatch(hideSaleModal());
      //        onUpdateClientList(response.data);
      //        setFormData(INITIAL_FORM_DATA);

      Swal.fire({
        icon: "success",
        title: "Venta cancelada",
        timer: 5000,
      });
    } else {
      handleClientError(response);
    }
  };

  const handleClientError = (response) => {
    let message = "Error desconocido. Por favor, contacte soporte.";

    Swal.fire({
      icon: "error",
      title: "Error al cancelar venta",
      text: message,
      timer: 5000,
    });
  };


  const handleSelectProduct = (row) => {
    setProductsToCancel(productsToCancel, row.id)

    
  };
  return (
    <CustomModal showOut={showSaleModal} title="Cancelación de compra">
      <Row className="section">
        <Col md={3}>
          <Form.Label>Folio</Form.Label>
          <Form.Control
            type="text"
            value={formData.id}
            placeholder="Folio"
            disabled
          />
        </Col>

        <Col md={6}>
          <Form.Label>Cliente</Form.Label>
          <Form.Control
            type="text"
            value={formData.client?.full_name}
            placeholder="Cliente"
            disabled
          />
        </Col>

        <Col md={3}>
          <Form.Label>Total</Form.Label>
          <Form.Control
            type="text"
            value={formData.total}
            placeholder="total"
            name="Total"
            disabled
          />
        </Col>
        <Col md={7}>
          <Form.Label>Creación</Form.Label>
          <Form.Control
            type="text"
            value={formData.created_at}
            placeholder="Creación"
            disabled
          />
        </Col>

        <Col md={5}>
          <Form.Label>Vendedor</Form.Label>
          <Form.Control
            type="text"
            value={formData.saler_username}
            placeholder="Vendedor"
            disabled
          />
        </Col>
        <Col md={12}>
          <Form.Label className="fw-bold">Productos</Form.Label>

          <CustomTable
            data={formData.products}
            columns={[
              {
                name: "Descripción",
                selector: (row) => row.description,
                grow: 3,
              },

              {
                name: "Cantidad",
                selector: (row) => row.quantity,
                grow: 2,
              },
              {
                name: "Precio unitario",
                selector: (row) => "$" + row.price / row.quantity,
              },
              {
                name: "Precio",
                selector: (row) => "$" + row.price,
              },
              {
                name: "Cancelar",
                selector: (row) => (
                  <Form.Check // prettier-ignore
                    type={"checkbox"}
                    id={`default-${"checkbox"}`}
                    onClick={() => handleSelectProduct(row)}
                  />
                ),
              },
            ]}
          ></CustomTable>
        </Col>
        <Col md={12}>
          <CustomButton fullWidth onClick={handleSaveClient} marginTop="10px">
            Cancelar venta
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default SaleModal;
