import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { Grid, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../../../context/UserContext";
import { isOwner } from "../../../constants/routeAccess";
import { getFormattedDateTime } from "../../../utils/utils";
import { showSuccess, showRequestError, showConfirm } from "../../../utils/alerts";
import {
  getStockUpdateRequests,
  approveStockUpdateRequest,
  deleteStockUpdateRequest,
} from "../../../api/stockRequests";
import { colors } from "../../../theme/colors";
import PageHeader from "../../ui/PageHeader";

const StockUpdateRequestList = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const allStores = user.store_id === null;

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const response = await getStockUpdateRequests();
        if (!ignore) setRequests(response.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar las solicitudes", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const handleApply = async (row) => {
    const isConfirmed = await showConfirm(
      "¿Confirmar ajuste?",
      `${row.product_name} — Cantidad: ${row.requested_stock}`,
      { confirmText: "Confirmar", confirmColor: colors.primary, icon: "question" }
    );
    if (!isConfirmed) return;
    try {
      await approveStockUpdateRequest(row.id);
      setRequests((prev) => prev.map((r) => r.id === row.id ? { ...r, applied: true } : r));
      showSuccess("Ajuste aplicado");
    } catch (error) {
      showRequestError("aplicar el ajuste", error);
    }
  };

  const handleDelete = async (row) => {
    const isConfirmed = await showConfirm(
      "¿Eliminar solicitud?",
      `${row.product_name} — Cantidad: ${row.requested_stock}`
    );
    if (!isConfirmed) return;
    try {
      await deleteStockUpdateRequest(row.id);
      setRequests((prev) => prev.filter((r) => r.id !== row.id));
      showSuccess("Solicitud eliminada");
    } catch (error) {
      showRequestError("eliminar la solicitud", error);
    }
  };

  return (
    <Grid item xs={12} className="card">
      <PageHeader title={`Ajustes de inventario${allStores ? "" : " en esta tienda"}`} />
      <DataTable
        progressPending={loading}
        noDataComponent="Sin solicitudes pendientes"
        data={requests}
        columns={[
          { name: "#", selector: (row) => row.id, width: 70 },
          ...(allStores ? [{ name: "Tienda", selector: (row) => row.store_name }] : []),
          { name: "Código", selector: (row) => row.product_code },
          { name: "Producto", selector: (row) => row.product_name },
          { name: "Cantidad solicitada", selector: (row) => row.requested_stock },
          { name: "Solicitante", selector: (row) => row.requested_by_username },
          { name: "Fecha", selector: (row) => getFormattedDateTime(row.created_at), minWidth: 150 },
          { name: "Estado", selector: (row) => (
            <Chip
              label={row.applied ? "Aplicado" : "Pendiente"}
              color={row.applied ? "success" : "warning"}
              size="small"
            />
          )},
          {
            name: "Acciones",
            cell: (row) => !row.applied ? (
              <>
                {isOwner(user) && (
                  <CustomTooltip text="Confirmar ajuste">
                    <CustomButton onClick={() => handleApply(row)}>
                      <CheckCircleIcon />
                    </CustomButton>
                  </CustomTooltip>
                )}
                <CustomTooltip text="Eliminar solicitud">
                  <CustomButton onClick={() => handleDelete(row)}>
                    <DeleteIcon />
                  </CustomButton>
                </CustomTooltip>
              </>
            ) : "-",
          },
        ]}
      />
    </Grid>
  );
};

export default StockUpdateRequestList;
