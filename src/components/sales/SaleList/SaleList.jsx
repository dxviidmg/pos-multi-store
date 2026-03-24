import React, { useEffect, useState, useRef } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSales } from "../../../api/sales";
import CustomButton from "../../ui/Button/Button";
import {
  getFormattedDate,
  handlePrintTicket,
  getFormattedDateTime,
} from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import SaleModal from "../SaleModal/SaleModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import UndoIcon from "@mui/icons-material/Undo";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Alert, Popper, Paper, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box, Stack } from "@mui/material";
import { getUserData } from "../../../api/utils";
import PaymentEditModal from "../PaymentEditModal/PaymentEditModal";
import CustomTooltip from "../../ui/Tooltip";

const ProductsPopperButton = ({ row, productsModal }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnchorEl(buttonRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setAnchorEl(null), 200);
  };

  return (
    <>
      <CustomButton
        ref={buttonRef}
        onClick={() => productsModal.open(row)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VisibilityIcon />
      </CustomButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="right"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Paper elevation={3} sx={{ maxHeight: '400px', maxWidth: '350px', overflow: 'auto', p: 1.5 }}>
          {row.products_sale?.map((p, i) => (
            <Box
              key={i}
              sx={{ py: 0.5, borderBottom: i < row.products_sale.length - 1 ? '1px solid #ddd' : 'none' }}
            >
              {p.quantity} - {p.name} {p.code && `(${p.code})`}
            </Box>
          ))}
        </Paper>
      </Popper>
    </>
  );
};

const TYPE_OPTIONS = [
  { value: false, label: "Ventas" },
];

const SEARCH_BY_OPTIONS = [
  { value: "date", label: "Fecha" },
  { value: "sale_id", label: "Id" },
  { value: "client", label: "Cliente" },
];

const SaleList = () => {
  const user = getUserData();
  const printer = user.store_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [params, setParams] = useState({
    date: today,
    reservation_in_progress: false,
  });
  const [loading, setLoading] = useState(false);
  const [salesDuplicated, setSalesDuplicated] = useState([]);
  const [showAllFields, setShowAllFields] = useState(false);
  const [searchBy, setSearchBy] = useState("date");
  const saleModal = useModal();
  const paymentEditModal = useModal();
  const productsModal = useModal();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSales(params);
      setSales(salesResponse.data);
      setSalesDuplicated(
        salesResponse.data.filter((sale) => sale.is_repeated).map((sale) => sale.id)
      );
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
    setSales((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <PaymentEditModal isOpen={paymentEditModal.isOpen} sale={paymentEditModal.data} onClose={paymentEditModal.close} onUpdate={handleUpdateSaleList} />
      <SaleModal isOpen={saleModal.isOpen} sale={saleModal.data} onClose={saleModal.close} onUpdate={handleUpdateSaleList} />

      <Grid className="card">
        {salesDuplicated.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Ids de ventas duplicadas: {salesDuplicated.join(", ")}
          </Alert>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Ventas</h1>
        </Stack>

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

        <DataTable
          data={sales}
          pagination={true}
          columns={[
            { name: "#", selector: (row) => row.id, width: 70 },
            {
              name: "Estado",
              selector: (row) =>
                salesDuplicated.includes(row.id)
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
              selector: (row) => <ProductsPopperButton row={row} productsModal={productsModal} />,
            },
            { name: "Número de productos", selector: (row) => row.products_sale?.reduce((sum, p) => sum + p.quantity, 0) || 0, width: 80 },
            { name: "Total", selector: (row) => `$${row.total}`, width: 80 },
            ...(params.reservation_in_progress === "true"
              ? [
                  { name: "Pagado", selector: (row) => "$" + row.paid, width: 80 },
                  { name: "Falta", selector: (row) => "$" + (row.total - row.paid), width: 80 },
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
                    <>
                      <CancelIcon color="error" /> Razón cancelación:{" "}
                      {row.reason_cancel || "Desconocida"}
                    </>
                  ) : (
                    <>
                      {printer && (
                        <CustomButton onClick={() => handlePrintTicket("ticket", row)}>
                          <PrintIcon />
                        </CustomButton>
                      )}
                      {params.reservation_in_progress === "true" && (
                        <CustomButton fullWidth onClick={() => paymentEditModal.open(row)}>
                          <AttachMoneyIcon />
                        </CustomButton>
                      )}
                      {(row.is_cancelable || row.is_repeated) && (
                        <CustomTooltip text="Generar devolución">
                          <CustomButton onClick={() => saleModal.open(row)}>
                            <UndoIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                      {row.is_repeated && <WarningIcon color="warning" />}
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
