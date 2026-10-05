import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlockIcon from "@mui/icons-material/Block";
import UndoIcon from "@mui/icons-material/Undo";
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
import { upsertById } from "../../../utils/array";
import { showRequestError } from "../../../utils/alerts";
import { useModal } from "../../../hooks/useModal";
import { useUser } from "../../../context/UserContext";
import SaleModal from "../SaleModal/SaleModal";
import PaymentEditModal from "../PaymentEditModal/PaymentEditModal";
import ProductsPopperButton from "../ProductsPopperButton/ProductsPopperButton";
import SaleSearchFields from "../shared/SaleSearchFields";
import PrintTicketButton from "../shared/PrintTicketButton";

const ReservationList = () => {
  const { user } = useUser();
  const printer = user.store_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [params, setParams] = useState({
    date: today,
    reservation_in_progress: "true",
  });
  const [loading, setLoading] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all");
  const saleModal = useModal();
  const paymentEditModal = useModal();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const salesResponse = await getSales(params);
        setSales(salesResponse.data);
      } catch (error) {
        showRequestError("cargar los apartados", error);
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

  const handleUpdateSaleList = (updated) => {
    if (!updated) {
      setParams((prev) => ({ ...prev }));
      return;
    }
    if (updated.delete) {
      setSales((prev) => prev.filter((item) => item.id !== updated.id));
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
        <PageHeader title="Apartados" />

        <Grid container spacing={2} sx={{ mb: 2 }}>
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
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "all" ? "contained" : "outlined"} onClick={() => setQuickFilter("all")}>
              Activos ({sales.filter(s => !s.is_canceled).length})
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton fullWidth variant={quickFilter === "canceled" ? "contained" : "outlined"} onClick={() => setQuickFilter("canceled")}>
              Cancelados ({sales.filter(s => s.is_canceled).length})
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin apartados"
          searcher
          data={quickFilter === "all" ? sales.filter(s => !s.is_canceled)
            : sales.filter(s => s.is_canceled)
          }
          columns={[
            { name: "#", selector: (row) => row.id, width: 70 },
            { name: "Cliente", selector: (row) => row.client?.full_name },
            {
              name: "Fecha y hora",
              selector: (row) => getFormattedDateTime(row.created_at),
              minWidth: 150,
            },
            {
              name: "Productos",
              selector: (row) => <ProductsPopperButton row={row} />,
            },
            { name: "Cant.", selector: (row) => row.products_sale?.reduce((sum, p) => sum + p.quantity, 0) || 0, width: 80 },
            { name: "Total", selector: (row) => formatCurrency(row.total), width: 100 },
            { name: "Pagado", selector: (row) => formatCurrency(row.paid), width: 100 },
            { name: "Falta", selector: (row) => formatCurrency(row.total - row.paid), width: 100 },
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
                      ) : (
                        <>
                          <CustomTooltip text="Cobrar abono">
                            <CustomButton onClick={() => paymentEditModal.open(row)}>
                              <AttachMoneyIcon />
                            </CustomButton>
                          </CustomTooltip>
                          <CustomTooltip text="Cancelar apartado">
                            <CustomButton onClick={() => saleModal.open(row)}>
                              <BlockIcon />
                            </CustomButton>
                          </CustomTooltip>
                        </>
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

export default ReservationList;
