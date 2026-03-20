import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { getFormattedDateTime } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTooltip from "../../ui/Tooltip";
import {
  confirmDistribution,
  deleteTranfer,
  getDistributions,
  updateTranfer,
} from "../../../api/transfers";

import { showSuccess, showError } from "../../../utils/alerts";
import { getUserData } from "../../../api/utils";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";


const DistributionList = () => {
  const [distributions, setDistributions] = useState([]);
  const [distributionSelected, setDistributionSelected] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      const distributions = await getDistributions();

      setDistributions(distributions.data);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  const handleOpenModal = (distribution) => {
    setDistributionSelected(distribution);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const response = await confirmDistribution({ id: distributionSelected.id });

    if (response.status === 200) {
      const distributions2 = distributions.filter(
        (distribution) => distribution.id !== distributionSelected.id
      );

      setDistributions(distributions2);
      setDistributionSelected({});
      setTimeout(() => {
        setLoading(false);
      }, 200);
      showSuccess("Distribución realizada");
    } else {
      setLoading(false);
      showError("Error al distribuir");
    }
  };

  const [editingRow, setEditingRow] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");

  const handleEditClick = (row) => {
    setEditingRow(row.product_code); // o row.id si lo tienes
    setEditedQuantity(row.quantity);
  };

  const handleSaveClick = async (row) => {
    row.quantity = editedQuantity;
    const response = await updateTranfer(row);
    setEditingRow(null);
  };

  const handleDeleteTransfer = async (row) => {
    const updatedList = distributionSelected.transfers.filter(
      (transfer) => transfer.id !== row.id
    );
    const response = await deleteTranfer(row);

    if (response.status === 204) {
      setDistributionSelected({
        ...distributionSelected, // conserva las demás propiedades
        transfers: updatedList, // actualiza solo la lista de transfers
      });
    }
  };

  return (
    <>
      {/* 1. SPINNERS */}
      <CustomSpinner isLoading={loading} />
      
      {/* 2. CONTENIDO PRINCIPAL - Lista de distribuciones */}
      <Grid item xs={12} className="card" sx={{ marginBottom: '1.5rem' }}>
        <h1>Distribuciones</h1>
        
        <DataTable
          data={distributions}
          pagination={true}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Creacion",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrapText: true,
            },
            {
              name: "Descripción",
              grow: 2,
              selector: (row) => row.description,
            },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Ver productos"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <ChecklistIcon />
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </Grid>

      {/* 3. DETALLE DE DISTRIBUCIÓN SELECCIONADA */}
      {Object.keys(distributionSelected).length !== 0 && (
        <Grid item xs={12} className="card">
          <h1>Distribución #{distributionSelected.id}</h1>
          
          <CustomButton
            fullWidth
            onClick={handleSubmit}
            startIcon={<SendIcon />}
            sx={{ mb: 2 }}
          >
            Confirmar distribución
          </CustomButton>
          
          <DataTable
            data={distributionSelected.transfers || []}
            pagination={true}
            columns={[
              {
                name: "Código",
                selector: (row) => row.product_code,
              },
              {
                name: "Producto",
                selector: (row) => row.product_description,
              },
              {
                name: "Cantidad",
                cell: (row) =>
                  editingRow === row.product_code ? (
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                      style={{ width: "80px", textAlign: "center" }}
                      min={1}
                      max={row.editable_product_max_stock}
                    />
                  ) : (
                    row.quantity
                  ),
              },
              {
                name: "Acciones",
                cell: (row) =>
                  getUserData().role === "owner" ? (
                    editingRow === row.product_code ? (
                      <CustomButton
                        onClick={() => handleSaveClick(row)}
                        startIcon={<SaveIcon />}
                      >
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
