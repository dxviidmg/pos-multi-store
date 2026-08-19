import React from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { useConversions, useDeleteConversion, useApplyConversion } from "../../../hooks/useConversions";
import { useModal } from "../../../hooks/useModal";
import ConversionModal from "./ConversionModal";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import CustomTooltip from "../../ui/Tooltip";
import Swal from "sweetalert2";
import { useUser } from "../../../context/UserContext";

const ConversionList = () => {
  const { user } = useUser();
  const isStore = user.store_type === "T";
  const { data: conversions = [], isLoading } = useConversions();
  const deleteMutation = useDeleteConversion();
  const applyMutation = useApplyConversion();
  const modal = useModal();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar conversión?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleApply = async (row) => {
    const result = await Swal.fire({
      title: "¿Desempacar producto?",
      html: `<p>Se restará <strong>1 ${row.source_unit_display}</strong> de <strong>${row.source_product_name}</strong></p>
             <p>Se sumarán <strong>${row.factor} ${row.target_unit_display}</strong> a <strong>${row.target_product_name}</strong></p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, desempacar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#04346b",
    });

    if (result.isConfirmed) {
      applyMutation.mutate(row.id);
    }
  };

  const columns = [
    {
      name: "Producto origen",
      selector: (row) => row.source_product_name,
      sortable: true,
      minWidth: 180,
    },
    {
      name: "Unidad origen",
      selector: (row) => row.source_unit_display,
      width: 120,
    },
    {
      name: "Factor",
      width: 200,
      cell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          1 {row.source_unit_display} → {row.factor} {row.target_unit_display}
        </Typography>
      ),
    },
    {
      name: "Producto destino",
      selector: (row) => row.target_product_name,
      sortable: true,
      minWidth: 180,
    },
    {
      name: "Unidad destino",
      selector: (row) => row.target_unit_display,
      width: 120,
    },
    ...(isStore ? [{
      name: "Desempacar",
      width: 130,
      cell: (row) => (
        <CustomButton
          size="small"
          variant="contained"
          onClick={() => handleApply(row)}
          startIcon={<UnarchiveIcon />}
          disabled={applyMutation.isPending}
        >
          Aplicar
        </CustomButton>
      ),
    }] : []),
    {
      name: "Acciones",
      width: 120,
      cell: (row) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <CustomTooltip text="Editar">
            <CustomButton size="small" onClick={() => modal.open(row)}>
              <EditIcon />
            </CustomButton>
          </CustomTooltip>
          <CustomTooltip text="Eliminar">
            <CustomButton size="small" onClick={() => handleDelete(row.id)}>
              <DeleteIcon />
            </CustomButton>
          </CustomTooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <CustomSpinner isLoading={isLoading} />
      <Box className="card">
        <PageHeader title="Conversiones de Producto">
          <CustomButton
            size="small"
            variant="contained"
            onClick={() => modal.open()}
            startIcon={<AddIcon />}
          >
            Nueva conversión
          </CustomButton>
        </PageHeader>

        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Configura equivalencias entre productos. Ejemplo: 1 Costal = 10 Kilogramos.
          Después podrás desempacar directamente desde el inventario.
        </Typography>

        <DataTable
          data={conversions}
          columns={columns}
          progressPending={isLoading}
          noDataComponent={
            <Box sx={{ py: 4, textAlign: "center" }}>
              <SwapHorizIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                No hay conversiones configuradas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Crea una para poder desempacar productos
              </Typography>
              <CustomButton
                onClick={() => modal.open()}
                startIcon={<AddIcon />}
              >
                Crear primera conversión
              </CustomButton>
            </Box>
          }
        />
      </Box>

      <ConversionModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        conversion={modal.data}
      />
    </>
  );
};

export default ConversionList;
