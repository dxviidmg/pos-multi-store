import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getFormattedDateTime } from "../utils/utils";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { CheckIcon, EditIcon, RemoveInCartIcon } from "../commons/icons/Icons";
import CustomTooltip from "../commons/Tooltip";
import {
  confirmDistribution,
  deleteTranfer,
  getDistributions,
  updateTranfer,
} from "../apis/transfers";

import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";


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
      Swal.fire({
        icon: "success",
        title: "Distribición realizada",
        timer: 5000,
      });
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error al distribuir",
        timer: 5000,
      });
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
      <CustomSpinner isLoading={loading} />
      <Grid item xs={12} className="custom-section">
        <h1>Distribuciones</h1>
        <CustomTable
          data={distributions}
          pagination={false}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Creacion",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrap: true,
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
                    <CheckIcon />
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </Grid>

      {Object.keys(distributionSelected).length !== 0 && (
        <Grid item xs={12} className="custom-section">
          <h1>Distribución #{distributionSelected.id}</h1>
          <CustomButton fullWidth onClick={() => handleSubmit()}>
            Confirmar distribución
          </CustomButton>
          <CustomTable
            data={distributionSelected.transfers || []}
            pagination={false}
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
                    <TextField size="small" fullWidth type="number"
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
                      <CustomButton onClick={() => handleSaveClick(row)}>
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
                            <RemoveInCartIcon />
                          </CustomButton>
                        </CustomTooltip>
                      </>
                    )
                  ) : (
                    "Solo el propietario puede editar o eliminar"
                  )
              }
            ]}
          />
        </Grid>
      )}
    </>
  );
};

export default DistributionList;
