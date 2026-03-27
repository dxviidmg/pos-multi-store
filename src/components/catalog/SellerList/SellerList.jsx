import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSellers } from "../../../api/sellers";
import CustomButton from "../../ui/Button/Button";
import SellerModal from "../SellerModal/SellerModal";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import { chooseIcon } from "../../ui/Icons/Icons";
import { useModal } from "../../../hooks/useModal";
import { useUserManagement } from "../../../hooks/useUserManagement";
import EditUserModal from "../../ui/UserModals/EditUserModal";
import ChangePasswordModal from "../../ui/UserModals/ChangePasswordModal";
import PageHeader from "../../ui/PageHeader";
import { Grid, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import { getUserData } from "../../../api/utils";
import CustomTooltip from "../../ui/Tooltip";

const SellerList = () => {
  const today = getFormattedDate();
  const user = getUserData();
  const sellerModal = useModal();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("");

  const {
    editUserModal,
    changePasswordModal,
    passwordData,
    showPasswords,
    handleOpenEditUser,
    handleCloseEditUser,
    handleEditUserChange,
    handleSaveUser,
    handleOpenChangePassword,
    handleCloseChangePassword,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSavePassword,
  } = useUserManagement();

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  useEffect(() => {
    const fetchSellersData = async () => {
      setLoading(true);
      const sellersResponse = await getSellers(params);
      setSellers(sellersResponse.data);
      setRange(getDateDifference(params.start_date, params.end_date));
      setLoading(false);
    };

    fetchSellersData();
  }, [params]);

  const handleUpdateSellerList = (updated) => {
    setSellers((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const handleParams = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SellerModal 
        isOpen={sellerModal.isOpen}
        seller={sellerModal.data}
        onClose={sellerModal.close}
        onUpdate={handleUpdateSellerList}
      />

      <EditUserModal
        open={editUserModal.open}
        onClose={handleCloseEditUser}
        userData={editUserModal.data}
        onChange={handleEditUserChange}
        onSave={handleSaveUser}
      />

      <ChangePasswordModal
        open={changePasswordModal.open}
        onClose={handleCloseChangePassword}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSave={handleSavePassword}
        showPasswords={showPasswords}
        onToggleVisibility={togglePasswordVisibility}
      />
      
      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Vendedores">
            <CustomButton onClick={() => sellerModal.open()} startIcon={<AddIcon />}>
              Nuevo Vendedor
            </CustomButton>
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de inicio"
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={handleParams}
                inputProps={{ max: today }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Fecha de fin"
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={handleParams}
                inputProps={{ max: today }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                fullWidth
                label="Rango"
                name="range"
                type="text"
                value={range}
                disabled
              />
            </Grid>
          </Grid>

          <DataTable
            progressPending={loading}
            noDataComponent="Sin vendedores"
            searcher={true}
            data={sellers}
            columns={[
              {
                name: "Tienda",
                selector: (row) => row.store_detail?.name,
              },
              {
                name: "Usuario",
                selector: (row) => row.worker.username,
              },
              {
                name: "Nombre",
                selector: (row) =>
                  `${row.worker.first_name} ${row.worker.last_name}`,
              },
              {
                name: "Activo",
                selector: (row) => chooseIcon(row.worker.is_active),
              },
              {
                name: "Vendido",
                selector: (row) => `$${row.total_sales}`,
              },
              ...(user?.role === "owner" ? [{
                name: "Acciones",
                cell: (row) => (
                  <>
                    <CustomTooltip text="Editar usuario">
                      <CustomButton size="small" onClick={() => handleOpenEditUser(row.worker.id)}>
                        <EditIcon />
                      </CustomButton>
                    </CustomTooltip>
                    <CustomTooltip text="Cambiar contraseña">
                      <CustomButton size="small" onClick={() => handleOpenChangePassword(row.worker.id)}>
                        <LockResetIcon />
                      </CustomButton>
                    </CustomTooltip>
                  </>
                ),
              }] : []),
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SellerList;
