import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { getFormattedDateTime } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { useUser } from "../../../context/UserContext";
import { isOwner as isOwnerUser } from "../../../constants/routeAccess";
import {
  confirmDistribution,
  deleteDistribution,
  deleteTransfer,
  getDistributions,
  updateTransfer,
} from "../../../api/transfers";
import CustomTooltip from "../../ui/Tooltip";
import { Grid, TextField } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import PageHeader from "../../ui/PageHeader";

const DistributionList = () => {
  const { user } = useUser();
  const isOwner = isOwnerUser(user);
  const [distributions, setDistributions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const fetchDistributions = async () => {
      setLoading(true);
      try {
        const res = await getDistributions();
        setDistributions(res.data);
      } catch (error) {
        showRequestError("cargar las distribuciones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistributions();
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await confirmDistribution({ id: selected.id });
      setDistributions((prev) => prev.filter((d) => d.id !== selected.id));
      setSelected(null);
      showSuccess("Distribución realizada");
    } catch (error) {
      showRequestError("confirmar la distribución", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row.product_code);
    setEditedQuantity(row.quantity);
  };

  const handleSaveClick = async (row) => {
    try {
      await updateTransfer({ ...row, quantity: editedQuantity });
      setSelected((prev) => ({
        ...prev,
        transfers: prev.transfers.map((t) =>
          t.id === row.id ? { ...t, quantity: editedQuantity } : t
        ),
      }));
      setEditingRow(null);
    } catch (error) {
      showRequestError("actualizar la cantidad", error);
    }
  };

  const handleDeleteTransfer = async (row) => {
    try {
      await deleteTransfer(row);
      setSelected((prev) => ({
        ...prev,
        transfers: prev.transfers.filter((t) => t.id !== row.id),
      }));
    } catch (error) {
      showRequestError("eliminar el producto", error);
    }
  };

  const handleDeleteDistribution = async (row) => {
    try {
      await deleteDistribution(row.id);
      setDistributions((prev) => prev.filter((d) => d.id !== row.id));
      showSuccess("Distribución eliminada");
    } catch (error) {
      showRequestError("eliminar la distribución", error);
    }
  };

  return (
    <>
      <CustomSpinner isLoading={submitting} />

      <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
        <PageHeader title="Distribuciones" />

        <DataTable
          progressPending={loading}
          noDataComponent="Sin distribuciones"
          data={distributions}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Fecha y hora", selector: (row) => getFormattedDateTime(row.created_at) },
            { name: "Descripción", selector: (row) => row.description },
            {
              name: "Acciones",
              cell: (row) => (
                <>
                  <CustomTooltip text="Ver productos">
                    <CustomButton onClick={() => setSelected(row)}>
                      <ChecklistIcon />
                    </CustomButton>
                  </CustomTooltip>
                  {isOwner && (
                    <CustomTooltip text="Eliminar distribución">
                      <CustomButton onClick={() => handleDeleteDistribution(row)}>
                        <DeleteIcon />
                      </CustomButton>
                    </CustomTooltip>
                  )}
                </>
              ),
            },
          ]}
        />
      </Grid>

      {selected && (
        <Grid item xs={12} className="card">
          <PageHeader title={`Distribución #${selected.id}`} />

          <CustomButton fullWidth onClick={handleSubmit} disabled={submitting} startIcon={<SendIcon />} sx={{ mb: 2 }}>
            Confirmar distribución
          </CustomButton>

          <DataTable
            noDataComponent="Sin productos"
            data={selected.transfers || []}
            columns={[
              { name: "Código", selector: (row) => row.product_code },
              { name: "Nombre", selector: (row) => row.product_description },
              {
                name: "Cantidad",
                width: 100,
                cell: (row) =>
                  editingRow === row.product_code ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                      sx={{ width: 80 }}
                    />
                  ) : (
                    row.quantity
                  ),
              },
              {
                name: "Acciones",
                cell: (row) =>
                  isOwner ? (
                    editingRow === row.product_code ? (
                      <CustomButton onClick={() => handleSaveClick(row)} startIcon={<SaveIcon />}>
                        Guardar
                      </CustomButton>
                    ) : (
                      <>
                        <CustomTooltip text="Editar cantidad">
                          <CustomButton onClick={() => handleEditClick(row)}>
                            <EditIcon />
                          </CustomButton>
                        </CustomTooltip>
                        <CustomTooltip text="Eliminar producto">
                          <CustomButton onClick={() => handleDeleteTransfer(row)}>
                            <DeleteIcon />
                          </CustomButton>
                        </CustomTooltip>
                      </>
                    )
                  ) : (
                    "Solo el propietario puede editar o eliminar"
                  ),
              },
            ]}
          />
        </Grid>
      )}
    </>
  );
};

export default DistributionList;
