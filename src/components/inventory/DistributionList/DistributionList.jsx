import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { getFormattedDateTime } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { showSuccess, showError } from "../../../utils/alerts";
import { getUserData } from "../../../api/utils";
import {
  confirmDistribution,
  deleteDistribution,
  deleteTranfer,
  getDistributions,
  updateTranfer,
} from "../../../api/transfers";
import CustomTooltip from "../../ui/Tooltip";
import { Grid, TextField} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import PageHeader from "../../ui/PageHeader";

const DistributionList = () => {
  const user = getUserData();
  const [distributions, setDistributions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  useEffect(() => {
    const fetchDistributions = async () => {
      setLoading(true);
      const res = await getDistributions();
      setDistributions(res.data);
      setLoading(false);
    };
    fetchDistributions();
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const response = await confirmDistribution({ id: selected.id });
    setLoading(false);

    if (response.status === 200) {
      setDistributions((prev) => prev.filter((d) => d.id !== selected.id));
      setSelected(null);
      showSuccess("Distribución realizada");
    } else {
      showError("Error al distribuir");
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row.product_code);
    setEditedQuantity(row.quantity);
  };

  const handleSaveClick = async (row) => {
    const response = await updateTranfer({ ...row, quantity: editedQuantity });
    if (response.status === 200) {
      setSelected((prev) => ({
        ...prev,
        transfers: prev.transfers.map((t) =>
          t.id === row.id ? { ...t, quantity: editedQuantity } : t
        ),
      }));
      setEditingRow(null);
    } else {
      showError("Error al actualizar cantidad");
    }
  };

  const handleDeleteTransfer = async (row) => {
    const response = await deleteTranfer(row);
    if (response.status === 204) {
      setSelected((prev) => ({
        ...prev,
        transfers: prev.transfers.filter((t) => t.id !== row.id),
      }));
    } else {
      showError("Error al eliminar producto");
    }
  };

  const handleDeleteDistribution = async (row) => {
    const response = await deleteDistribution(row.id);
    if (response.status === 204) {
      setDistributions((prev) => prev.filter((d) => d.id !== row.id));
      showSuccess("Distribución eliminada");
    } else {
      showError("Error al eliminar distribución");
    }
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />

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
                  {user.role === "owner" && (
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
          <h1>Distribución #{selected.id}</h1>

          <CustomButton fullWidth onClick={handleSubmit} startIcon={<SendIcon />} sx={{ mb: 2 }}>
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
                  user.role === "owner" ? (
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
                        <CustomTooltip text="Borrar producto">
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
