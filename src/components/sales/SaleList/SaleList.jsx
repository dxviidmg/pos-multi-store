import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSales } from "../../../api/sales";
import CustomButton from "../../ui/Button/Button";
import {
  getFormattedDate,
  handlePrintTicket,
  getFormattedDateTime,
  upsertById,
  formatCurrency,
} from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import SaleModal from "../SaleModal/SaleModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PrintIcon from "@mui/icons-material/Print";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlockIcon from "@mui/icons-material/Block";
import UndoIcon from "@mui/icons-material/Undo";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import PaymentEditModal from "../PaymentEditModal/PaymentEditModal";
import CustomTooltip from "../../ui/Tooltip";
import PageHeader from "../../ui/PageHeader";
import ProductsPopperButton from "../ProductsPopperButton/ProductsPopperButton";

const TYPE_OPTIONS = [
  { value: false, label: "Ventas" },
];

const SEARCH_BY_OPTIONS = [
  { value: "date", label: "Fecha" },
  { value: "sale_id", label: "Id" },
  { value: "client", label: "Cliente" },
];

const SaleList = () => {
  const { user } = useUser();
  const printer = user.store_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [params, setParams] = useState({
    date: today,
    reservation_in_progress: false,
  });
  const [loading, setLoading] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const [searchBy, setSearchBy] = useState("date");
  const saleModal = useModal();
  const paymentEditModal = useModal();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSales(params);
      setSales(salesResponse.data);
      setLoading(false);
    };
    fetchSalesData();
  }, [params]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSaleList = (updated) => {
    if (!updated) {
      setParams((prev) => ({ ...prev }));
      return;
    }
    setSales((prev) => upsertById(prev, updated));
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <PaymentEditModal isOpen={paymentEditModal.isOpen} sale={paymentEditModal.data} onClose={paymentEditModal.close} onUpdate={handleUpdateSaleList} />
      <SaleModal isOpen={saleModal.isOpen} sale={saleModal.data} onClose={saleModal.close} onUpdate={handleUpdateSaleList} />

      <Grid className="card">
        <PageHeader title="Ventas" />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select value={params.reservation_in_progress} onChange={handleDataChange} name="reservation_in_progress" label="Tipo">
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Búsqueda por</InputLabel>
              <Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} label="Búsqueda por">
                {SEARCH_BY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {searchBy === "date" ? (
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Fecha" type="date" value={params.date} onChange={handleDataChange} name="date" inputProps={{ max: today }} />
            </Grid>
          ) : searchBy === "sale_id" ? (
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="#" type="number" value={params.sale_id} onChange={handleDataChange} name="sale_id" />
            </Grid>
          ) : searchBy === "client" ? (
            <>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Nombre" type="text" value={params.first_name} onChange={handleDataChange} name="first_name" />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Apellidos" type="text" value={params.last_name} onChange={handleDataChange} name="last_name" />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={() => setShowAllFields((prev) => !prev)}
              startIcon={showAllFields ? <VisibilityOffIcon /> : <VisibilityIcon />}
              fullWidth
            >
              {showAllFields ? "Ocultar campos" : "Ver todos los campos"}
            </CustomButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "all" ? "contained" : "outlined"} onClick={() => setQuickFilter("all")}>
              Todas ({sales.length})
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "duplicated" ? "contained" : "outlined"} onClick={() => setQuickFilter("duplicated")} color={sales.filter(s => s.is_repeated).length > 0 && quickFilter !== "duplicated" ? "error" : "primary"}>
              Duplicadas ({sales.filter(s => s.is_repeated).length})
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "canceled" ? "contained" : "outlined"} onClick={() => setQuickFilter("canceled")}>
              Canceladas ({sales.filter(s => s.is_canceled).length})
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "returned" ? "contained" : "outlined"} onClick={() => setQuickFilter("returned")}>
              Con devolución ({sales.filter(s => s.has_return).length})
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin ventas"
          searcher
          data={quickFilter === "all" ? sales
            : quickFilter === "duplicated" ? sales.filter(s => s.is_repeated)            : quickFilter === "canceled" ? sales.filter(s => s.is_canceled)
            : sales.filter(s => s.has_return)
          }
          columns={[
            { name: "#", selector: (row) => row.id, width: 70 },
            {
              name: "Unica",
              selector: (row) =>
                row.is_repeated
                  ? <ErrorIcon className="icon-danger" />
                  : <CheckCircleIcon className="icon-success" />,
              width: 70,
            },
            ...(showAllFields
              ? [{ name: "Cliente", selector: (row) => row.client?.full_name }]
              : []),
            {
              name: "Fecha y hora",
              selector: (row) => getFormattedDateTime(row.created_at),
              minWidth: 150,
            },
            {
              name: "Productos",
              selector: (row) => <ProductsPopperButton row={row} />,
            },
            { name: "Número de productos", selector: (row) => row.products_sale?.reduce((sum, p) => sum + (p.sells_by_fraction ? 1 : p.quantity), 0) || 0, width: 80 },
            { name: "Total", selector: (row) => formatCurrency(row.total), width: 100, omit: user.role === "seller" },
            ...(params.reservation_in_progress === "true"
              ? [
                  { name: "Pagado", selector: (row) => formatCurrency(row.paid), width: 100 },
                  { name: "Falta", selector: (row) => formatCurrency(row.total - row.paid), width: 100 },
                ]
              : []),
            { name: "Métodos de pago", selector: (row) => row.payments_methods.join(", ") },
            ...(showAllFields
              ? [
                  { name: "Referencia", selector: (row) => row.reference },
                  { name: "Vendedor", selector: (row) => row.seller_username },
                ]
              : []),
            {
              name: "Acciones",
              cell: (row) => (
                <>
                  {row.is_canceled ? (
                    <CustomTooltip text={row.reason_cancel || "Sin motivo"}>
                      <CustomButton disabled><BlockIcon color="error" /></CustomButton>
                    </CustomTooltip>
                  ) : row.has_return ? (
                    <>
                      {printer && (
                        <CustomTooltip text="Imprimir ticket">
                          <CustomButton onClick={() => handlePrintTicket("ticket", row)}>
                            <PrintIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                      <CustomTooltip text={row.reason_return || "Sin motivo"}>
                        <CustomButton disabled><UndoIcon color="info" /></CustomButton>
                      </CustomTooltip>
                    </>
                  ) : (
                    <>
                      {printer && (
                        <CustomTooltip text="Imprimir ticket">
                          <CustomButton onClick={() => handlePrintTicket("ticket", row)}>
                            <PrintIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                      {params.reservation_in_progress === "true" && (
                        <CustomTooltip text="Editar pago">
                          <CustomButton onClick={() => paymentEditModal.open(row)}>
                            <AttachMoneyIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                      {row.is_cancelable && (
                        <CustomTooltip text="Devolución">
                          <CustomButton onClick={() => saleModal.open(row)}>
                            <UndoIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default SaleList;
