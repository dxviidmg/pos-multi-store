import React, { useEffect, useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import UndoIcon from "@mui/icons-material/Undo";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import PageHeader from "../../ui/PageHeader";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getSales } from "../../../api/sales";
import { getFormattedDate, getFormattedDateTime } from "../../../utils/date";
import { formatCurrency } from "../../../utils/currency";
import { showRequestError } from "../../../utils/alerts";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../context/UserContext";
import { isSeller } from "../../../constants/routeAccess";
import SaleModal from "../SaleModal/SaleModal";
import ProductsPopperButton from "../ProductsPopperButton/ProductsPopperButton";
import SaleSearchFields from "../shared/SaleSearchFields";
import PrintTicketButton from "../shared/PrintTicketButton";

// Los apartados en curso viven en ReservationList; aquí solo se listan ventas
const TYPE_OPTIONS = [
  { value: false, label: "Ventas" },
];

const QUICK_FILTERS = {
  all: () => true,
  duplicated: (sale) => sale.is_repeated,
  canceled: (sale) => sale.is_canceled,
  returned: (sale) => sale.has_return,
};

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
  const saleModal = useModal();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const salesResponse = await getSales(params);
        setSales(salesResponse.data);
      } catch (error) {
        showRequestError("cargar las ventas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, [params]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  // Tras una devolución o cancelación se vuelve a consultar la lista
  const refreshSales = () => setParams((prev) => ({ ...prev }));

  const duplicatedCount = sales.filter(QUICK_FILTERS.duplicated).length;

  const renderQuickFilter = (value, label, extraProps) => (
    <Grid item xs={6} md={3}>
      <CustomButton
        fullWidth
        variant={quickFilter === value ? "contained" : "outlined"}
        onClick={() => setQuickFilter(value)}
        {...extraProps}
      >
        {label} ({sales.filter(QUICK_FILTERS[value]).length})
      </CustomButton>
    </Grid>
  );

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <SaleModal isOpen={saleModal.isOpen} sale={saleModal.data} onClose={saleModal.close} onUpdate={refreshSales} />

      <Grid className="card">
        <PageHeader title="Ventas" />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Select "Tipo" oculto — solo tiene 1 opción (Ventas).
              Descomentar si se reactiva el filtro de apartados. */}
          {/* <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select value={params.reservation_in_progress} onChange={handleDataChange} name="reservation_in_progress" label="Tipo">
                {TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={String(opt.value)} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}

          <SaleSearchFields params={params} onChange={handleDataChange} maxDate={today} />

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
          {renderQuickFilter("all", "Todas")}
          {renderQuickFilter("duplicated", "Duplicadas", {
            color: duplicatedCount > 0 && quickFilter !== "duplicated" ? "error" : "primary",
          })}
          {renderQuickFilter("canceled", "Canceladas")}
          {renderQuickFilter("returned", "Con devolución")}
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin ventas"
          searcher
          data={sales.filter(QUICK_FILTERS[quickFilter])}
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
            ...(isSeller(user) ? [] : [{ name: "Total", selector: (row) => formatCurrency(row.total), width: 100 }]),
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
                  ) : (
                    <>
                      {printer && <PrintTicketButton sale={row} />}
                      {row.has_return ? (
                        <CustomTooltip text={row.reason_return || "Sin motivo"}>
                          <CustomButton disabled><UndoIcon color="info" /></CustomButton>
                        </CustomTooltip>
                      ) : row.is_cancelable && (
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
