import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import { colors } from "../../../theme/colors";
import { useConversions, useDeleteConversion, useApplyConversion } from "../../../hooks/useConversions";
import { useModal } from "../../../hooks/useModal";
import ConversionModal from "./ConversionModal";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import CustomTooltip from "../../ui/Tooltip";
import { showConfirm } from "../../../utils/alerts";
import { useUser } from "../../../context/UserContext";
import { isOwner as isOwnerUser } from "../../../constants/routeAccess";
import { STORE_TYPES } from "../../../constants";

const ConversionList = () => {
  const { user } = useUser();
  const isOwner = isOwnerUser(user);
  const isStore = user.store_type === STORE_TYPES.STORE;
  const { data: conversions = [], isLoading } = useConversions();
  const { mutate: deleteConversion } = useDeleteConversion();
  const { mutate: applyConversion, isPending: isApplying } = useApplyConversion();
  const modal = useModal();
  const openModal = modal.open;

  const columns = useMemo(() => {
    const handleDelete = async (id) => {
      const confirmed = await showConfirm("¿Eliminar conversión?", "Esta acción no se puede deshacer");
      if (confirmed) deleteConversion(id);
    };

    const handleApply = async (row) => {
      const confirmed = await showConfirm(
        "¿Desempacar producto?",
        `Se restará 1 ${row.source_unit_display} de ${row.source_product_name} y se sumarán ${row.factor} ${row.target_unit_display} a ${row.target_product_name}.`,
        { confirmText: "Sí, desempacar", confirmColor: colors.primary, icon: "question" }
      );
      if (confirmed) applyConversion(row.id);
    };

    return [
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
            onClick={() => handleApply(row)}
            startIcon={<UnarchiveIcon />}
            disabled={isApplying}
          >
            Aplicar
          </CustomButton>
        ),
      }] : []),
      ...(isOwner ? [{
        name: "Acciones",
        width: 120,
        cell: (row) => (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <CustomTooltip text="Editar">
              <CustomButton onClick={() => openModal(row)}>
                <EditIcon />
              </CustomButton>
            </CustomTooltip>
            <CustomTooltip text="Eliminar">
              <CustomButton onClick={() => handleDelete(row.id)}>
                <DeleteIcon />
              </CustomButton>
            </CustomTooltip>
          </Box>
        ),
      }] : []),
    ];
  }, [isStore, isOwner, isApplying, deleteConversion, applyConversion, openModal]);

  return (
    <>
      <Box className="card">
        <PageHeader title="Conversiones de producto">
          {isOwner && (
            <CustomButton
              onClick={() => modal.open()}
              startIcon={<AddIcon />}
            >
              Nueva conversión
            </CustomButton>
          )}
        </PageHeader>

        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Configura equivalencias entre productos. Ejemplo: 1 Costal = 10 Kilogramos.{" "}
          {isStore
            ? "Para desempacar, usa el botón \"Aplicar\" de esta tabla."
            : "Para desempacar, entra a una tienda y usa el botón \"Aplicar\" en esta página."}
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
              {isOwner && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Crea una para poder desempacar productos
                  </Typography>
                  <CustomButton
                    onClick={() => modal.open()}
                    startIcon={<AddIcon />}
                  >
                    Crear primera conversión
                  </CustomButton>
                </>
              )}
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
