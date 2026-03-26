import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { useCancelSale } from "../../../hooks/useSaleMutations";
import { Grid, TextField, Checkbox, FormControlLabel } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const INITIAL_FORM_DATA = {
  products_sale: [],
};

const SaleModal = ({ isOpen, sale, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [quantitiesToCancel, setQuantitiesToCancel] = useState({});
  const [totalCancel, setTotalCancel] = useState(false);
  const [reason, setReason] = useState("");
  const cancelMutation = useCancelSale();

  useEffect(() => {
    setFormData(sale?.id ? sale : INITIAL_FORM_DATA);
    setQuantitiesToCancel({});
    setTotalCancel(false);
    setReason("");
  }, [sale]);

  const handleQuantityChange = (rowId, max, value) => {
    const quantity = Math.min(parseInt(value) || 0, max);
    const updated = { ...quantitiesToCancel, [rowId]: quantity };
    setQuantitiesToCancel(updated);

    // Auto-marcar cancelación total si se devuelve todo
    const allReturned = formData.products_sale.every(
      (p) => (updated[p.id] || 0) >= p.quantity
    );
    setTotalCancel(allReturned);
  };

  const disabledButton = () => {
    if (reason.trim() === "") return true;
    if (totalCancel) return false;
    const total = Object.values(quantitiesToCancel).reduce((sum, qty) => sum + qty, 0);
    return total === 0;
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      const all = {};
      formData.products_sale.forEach((p) => { all[p.id] = p.quantity; });
      setQuantitiesToCancel(all);
    } else {
      setQuantitiesToCancel({});
      setReason("");
    }
    setTotalCancel(e.target.checked);
  };

  const handleSaveClient = async () => {
    const payload = totalCancel
      ? { id: sale.id, is_canceled: true, reason_cancel: reason }
      : { id: sale.id, products_to_return: quantitiesToCancel, reason_return: reason };

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
      title={totalCancel ? "Cancelar venta" : "Devolver productos"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
        <Grid container spacing={2}>
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
            <FormControlLabel
              control={
                <Checkbox size="small"
                  checked={totalCancel}
                  onChange={handleCheck}
                />
              }
              label="Cancelar venta completa"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField size="small" fullWidth label={totalCancel ? "Motivo de cancelación" : "Motivo de devolución"} type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <h5>{totalCancel ? "Todos los productos serán devueltos" : "Selecciona los productos a devolver"}</h5>
            <SimpleTable
              data={formData.products_sale}
              columns={[
                { name: "Descripción", selector: (row) => row.name },
                { name: "Cantidad vendida", selector: (row) => row.quantity },
                {
                  name: "Devolver",
                  selector: (row) => (
                    <TextField size="small" type="number"
                      inputProps={{ min: 0, max: row.quantity }}
                      value={quantitiesToCancel[row.id] || 0}
                      disabled={totalCancel}
                      onChange={(e) => handleQuantityChange(row.id, row.quantity, e.target.value)}
                    />
                  ),
                },
                { name: "Precio unitario", selector: (row) => `$${row.price}` },
                { name: "Importe", selector: (row) => `$${row.price * row.quantity}` },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <CustomButton
              fullWidth
              onClick={handleSaveClient}
              marginTop="10px"
              disabled={disabledButton()}
              startIcon={<ShoppingCartIcon />}
            >
              {totalCancel ? "Cancelar venta" : "Devolver productos"}
            </CustomButton>
          </Grid>
        </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default SaleModal;
