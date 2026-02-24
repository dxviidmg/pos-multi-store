import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Form, FormCheck } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import CustomTable from "../commons/customTable/customTable";
import { hideSaleModal } from "../redux/saleModal/SaleModalActions";
import { useCancelSale } from "../../hooks/useSaleMutations";
import { Grid } from "@mui/material";

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
  const cancelMutation = useCancelSale();

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

    cancelMutation.mutate(payload, {
      onSuccess: () => {
        onUpdateSaleList();
        dispatch(hideSaleModal());
      },
    });
  };

  return (
    <CustomModal
      showOut={showSaleModal}
      onClose={() => dispatch(hideSaleModal())}
      title={totalCancel ? "Cancelación de compra" : "Devolución de productos"}
    >
      <div className="custom-section">
        <Grid container>
          {/* Información general de la venta */}
          <Grid item xs={12} md={2}>
            <Form.Label>Folio</Form.Label>
            <Form.Control type="text" value={formData.id} disabled />
          </Grid>
          <Grid item xs={12} md={4}>
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              type="text"
              value={formData.client?.full_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Form.Label>Total</Form.Label>
            <Form.Control type="text" value={formData.total} disabled />
          </Grid>
          <Grid item xs={12} md={4}>
            <Form.Label>Creación</Form.Label>
            <Form.Control type="text" value={formData.created_at} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <Form.Label>Vendedor</Form.Label>
            <Form.Control
              type="text"
              value={formData.seller_username}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Form.Label></Form.Label>
            <div className="d-flex flex-column justify-content-end">
              <FormCheck
                label="Cancelación total"
                className="m-3"
                checked={totalCancel}
                onChange={handleCheck}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <Form.Label>Razon cancelacion</Form.Label>
            <Form.Control
              type="text"
              value={reasonCancel}
              disabled={!totalCancel}
              onChange={(e) => setReasonCancel(e.target.value)}
            />
          </Grid>
          {/* Tabla de productos */}
          <Grid item xs={12} md={12}>
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
          </Grid>

          {/* Botón de acción */}
          <Grid item xs={12} md={12}>
            <CustomButton
              fullWidth
              onClick={handleSaveClient}
              marginTop="10px"
              disabled={disabledButton()}
            >
              {totalCancel ? "Cancelar" : "Devolver"}
            </CustomButton>
          </Grid>
        </Grid>
      </div>
    </CustomModal>
  );
};

export default SaleModal;
