import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, FormCheck, Row } from "react-bootstrap";
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

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantitiesToCancel, setQuantitiesToCancel] = useState({});
  const [totalCancel, setTotalCancel] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(sale.id ? sale : INITIAL_FORM_DATA);
    setQuantitiesToCancel({});
    setSelectedRows([]);
  }, [sale]);

  const handleQuantityChange = (rowId, max, value) => {
    const quantity = Math.min(parseInt(value) || 0, max);

    setQuantitiesToCancel((prev) => ({ ...prev, [rowId]: quantity }));
  };

  const disabledButton = () => {
    if (totalCancel) {
      return reasonCancel.trim() === "";
    }
  
    const total = Object.entries(quantitiesToCancel)
      .filter(([id]) => selectedRows.some((r) => r.id === +id))
      .reduce((sum, [, qty]) => sum + qty, 0);
  
    return total === 0;
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      formData.products_sale.forEach((product_sale) => {
        setQuantitiesToCancel((prev) => ({
          ...prev,
          [product_sale.id]: product_sale.quantity,
        }));
        setSelectedRows((prev) => [...prev, product_sale]);
      });
    } else {
      formData.products_sale.forEach((product_sale) => {
        setQuantitiesToCancel((prev) => ({ ...prev, [product_sale.id]: 0 }));
        setSelectedRows([]);
      });
      setReasonCancel("");
    }
    setTotalCancel(e.target.checked);
  };

  const handleSaveClient = async () => {
    const payload = {
      id: sale.id,
      products_sale_to_cancel: quantitiesToCancel,
      reason_cancel: reasonCancel
    };

    const response = await cancelSale(payload);
    if (loading) return
    setLoading(true)

    if (response.status === 200) {
      const { sale: updatedSale, cash_back } = response.data;

      onUpdateSaleList(updatedSale);
      dispatch(hideSaleModal());
      setTimeout(() => {
        setLoading(false)
      }, 164);

      Swal.fire({
        icon: "success",
        title: `Devolución exitosa. Devolver $${cash_back}`,
        timer: 5000,
      });
    } else {
      setLoading(false)
      handleClientError();
    }
  };

  const handleClientError = () => {
    Swal.fire({
      icon: "error",
      title: "Error al cancelar venta",
      text: "Error desconocido. Por favor, contacte soporte.",
      timer: 5000,
    });
  };

  return (
    <CustomModal
      showOut={showSaleModal}
      title={totalCancel ? "Cancelación de compra" : "Devolución de productos"}
    >
      <div className="custom-section">
        <Row>
          {/* Información general de la venta */}
          <Col md={2}>
            <Form.Label>Folio</Form.Label>
            <Form.Control type="text" value={formData.id} disabled />
          </Col>
          <Col md={4}>
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              type="text"
              value={formData.client?.full_name}
              disabled
            />
          </Col>
          <Col md={2}>
            <Form.Label>Total</Form.Label>
            <Form.Control type="text" value={formData.total} disabled />
          </Col>
          <Col md={4}>
            <Form.Label>Creación</Form.Label>
            <Form.Control type="text" value={formData.created_at} disabled />
          </Col>
          <Col md={3}>
            <Form.Label>Vendedor</Form.Label>
            <Form.Control
              type="text"
              value={formData.seller_username}
              disabled
            />
          </Col>
          <Col md={4}>
            <Form.Label></Form.Label>
            <div className="d-flex flex-column justify-content-end">
              <FormCheck
                label="Cancelación total"
                className="m-3"
                checked={totalCancel}
                onChange={handleCheck}
              />
            </div>
          </Col>
          <Col md={5}>
            <Form.Label>Razon cancelacion</Form.Label>
            <Form.Control
              type="text"
              value={reasonCancel}
              disabled={!totalCancel}
              onChange={(e) => setReasonCancel(e.target.value)}
            />
          </Col>
          {/* Tabla de productos */}
          <Col md={12}>
            <h5>Productos comprados</h5>
            <CustomTable
              data={formData.products_sale}
              setSelectedRows={setSelectedRows}
              columns={[
                { name: "Descripción", selector: (row) => row.name, grow: 3 },
                { name: "C. Vendida", selector: (row) => row.quantity },
                {
                  name: "Devolver",
                  selector: (row) => (
                    <Form.Control
                      type="number"
                      min={1}
                      max={row.quantity}
                      value={quantitiesToCancel[row.id] || 0}
                      disabled={!selectedRows.some((r) => r.id === row.id)}
                      onChange={(e) =>
                        handleQuantityChange(
                          row.id,
                          row.quantity,
                          e.target.value
                        )
                      }
                    />
                  ),
                },
                { name: "P. unitario", selector: (row) => `$${row.price}` },
                {
                  name: "Importe",
                  selector: (row) => `$${row.price * row.quantity}`,
                },
              ]}
            />
          </Col>

          {/* Botón de acción */}
          <Col md={12}>
            <CustomButton
              fullWidth
              onClick={handleSaveClient}
              marginTop="10px"
              disabled={disabledButton()}
            >
              {totalCancel ? "Cancelar" : "Devolver"}
            </CustomButton>
          </Col>
        </Row>
      </div>
    </CustomModal>
  );
};

export default SaleModal;
