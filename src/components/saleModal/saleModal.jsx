import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import Swal from "sweetalert2";
import { cancelSale } from "../apis/sales";
import CustomTable from "../commons/customTable/customTable";
import { hideSaleModal } from "../redux/saleModal/SaleModalActions";

const INITIAL_FORM_DATA = {
  products_sale: [],
};

const SaleModal = ({ onUpdateSaleList }) => {
  const { showSaleModal, sale } = useSelector(
    (state) => state.SaleModalReducer
  );

  const [productsSaleToCancel, setProductsSaleToCancel] = useState([]);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const dispatch = useDispatch();

  useEffect(() => {
    if (sale.id) {
      setFormData(sale);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [sale]);

  const handleSaveClient = async () => {
    console.log(productsSaleToCancel)
    const payload = {id: sale.id, products_sale_to_cancel: productsSaleToCancel}
    const response = await cancelSale(payload);

    if (response.status === 200) {

      let cash_back = response.data.cash_back
      const sale_response = response.data.sale

      if ('id' in sale_response){

        onUpdateSaleList(sale_response)
        setFormData(INITIAL_FORM_DATA)
        setProductsSaleToCancel([])
        dispatch(hideSaleModal());        
      }
      else{
        onUpdateSaleList({...sale, delete: true})
        setFormData(INITIAL_FORM_DATA)
        setProductsSaleToCancel([])
        dispatch(hideSaleModal());        
      }

//      const type = response.data[0]['type'] || ''

//      if (type === 'total'){
//        onUpdateSaleList({...sale, delete: true})
//        setFormData(INITIAL_FORM_DATA)
//        setProductsSaleToCancel([])
//        dispatch(hideSaleModal());
  
//      }

      Swal.fire({
        icon: "success",
        title: "Venta cancelada. Devolver $" + cash_back,
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
    setProductsSaleToCancel((prev) => {
      const updatedProducts = [...prev];

      console.log('updatedProducts', updatedProducts)
      if (updatedProducts.includes(row.id)) {
        console.log('quita')
        return updatedProducts.filter((id) => id !== row.id); // Remove product if already selected
      } else {
        console.log('inserta')
        updatedProducts.push(row.id); // Add product to cancel list
        return updatedProducts;
      }
    });
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
            data={formData.products_sale}
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
                  <Form.Check
                    type="checkbox"
                    id={`default-${row.id}`}
                    checked={productsSaleToCancel.includes(row.id)}
                    onChange={() => handleSelectProduct(row)}
                  />
                ),
              },
            ]}
          />
        </Col>
        <Col md={12}>
          <CustomButton fullWidth onClick={handleSaveClient} marginTop="10px" disabled={productsSaleToCancel.length === 0}>
            Cancelar venta
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default SaleModal;
