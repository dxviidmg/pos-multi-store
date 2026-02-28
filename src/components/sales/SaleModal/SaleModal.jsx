import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";

import CustomButton from "../../ui/Button/Button";
import CustomTable from "../../ui/Table/Table";
import { useCancelSale } from "../../../hooks/useSaleMutations";
import { Grid, TextField, Checkbox, FormLabel } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const INITIAL_FORM_DATA = {
  products_sale: [],
};

const SaleModal = ({ isOpen, sale, onClose, onUpdate }) => {

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantitiesToCancel, setQuantitiesToCancel] = useState({});
  const [totalCancel, setTotalCancel] = useState(false);
  const [reasonCancel, setReasonCancel] = useState("");
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
        onUpdate();
        onClose();
      },
    });
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={totalCancel ? "Cancelación de compra" : "Devolución de productos"}
    >
      <Grid className="custom-section">
        <Grid container spacing={2}>
          {/* Información general de la venta */}
          <Grid item xs={12} md={2}>
            <TextField size="small" fullWidth label="Folio" type="text" value={formData.id} disabled />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField size="small" fullWidth label="Cliente" type="text"
              value={formData.client?.full_name}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField size="small" fullWidth label="Total" type="text" value={formData.total} disabled />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField size="small" fullWidth label="Creación" type="text" value={formData.created_at} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField size="small" fullWidth label="Vendedor" type="text"
              value={formData.seller_username}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormLabel></FormLabel>
            <div className="d-flex flex-column justify-content-end">
              <Checkbox size="small"
                label="Cancelación total"
                className="m-3"
                checked={totalCancel}
                onChange={handleCheck}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField size="small" fullWidth label="Razon cancelacion" type="text"
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
                    <TextField size="small" fullWidth type="number"
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
              startIcon={<ShoppingCartIcon />}
            >
              {totalCancel ? "Cancelar" : "Devolver"}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default SaleModal;
