import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { Grid,  Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import httpClient from "../../../api/httpClient";
import { getApiUrl, getUserData } from "../../../api/utils";
import { getFormattedDateTime } from "../../../utils/utils";
import { showSuccess, showError } from "../../../utils/alerts";
import { getStockUpdateRequests } from "../../../api/notifications";
import Swal from "sweetalert2";
import PageHeader from "../../ui/PageHeader";

const StockUpdateRequestList = () => {
  const user = getUserData();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStockUpdateRequests();
      setRequests(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleApply = async (row) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Confirmar ajuste?",
      text: `${row.product_name} — Cantidad: ${row.requested_stock}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    });
    if (!isConfirmed) return;
    try {
      await httpClient.post(getApiUrl(`stock-update-request/${row.id}/approve`), {});
      setRequests((prev) => prev.map((r) => r.id === row.id ? { ...r, applied: true } : r));
      showSuccess("Ajuste aplicado");
    } catch {
      showError("Error", "No se pudo aplicar el ajuste");
    }
  };

  const handleDelete = async (row) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Borrar solicitud?",
      text: `${row.product_name} — Cantidad: ${row.requested_stock}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;
    try {
      await httpClient.delete(getApiUrl(`stock-update-request/${row.id}`));
      setRequests((prev) => prev.filter((r) => r.id !== row.id));
      showSuccess("Solicitud eliminada");
    } catch {
      showError("Error", "No se pudo eliminar la solicitud");
    }
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <Grid item xs={12} className="card">
        <PageHeader title={"Solicitudes de ajustes " + (user.store_id === null ? "(todas las tiendas)": "(Solo esta tienda)")}  />
        <DataTable
          progressPending={loading}
          noDataComponent="Sin solicitudes pendientes"
          data={requests}
          columns={[
            { name: "#", selector: (row) => row.id, width: 70 },
            ...(user.store_id === null ? [{ name: "Tienda", selector: (row) => row.store_name }] : []),
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
                {user.role === "owner" &&
                  <CustomTooltip text="Confirmar ajuste">
                    <CustomButton onClick={() => handleApply(row)}>
                      <CheckCircleIcon />
                    </CustomButton>
                  </CustomTooltip>
                  }
                  <CustomTooltip text="Borrar solicitud">
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
    </>
  );
};

export default StockUpdateRequestList;
