import { useEffect, useMemo, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { Typography, Chip } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/utils";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { setStorage } from "../../../utils/storage";
import { getUserData } from "../../../api/utils";
import { useStores } from "../../../hooks/useStores";
import { useTenantInfo } from "../../../hooks/useTenantInfo";
import { useDepartments } from "../../../hooks/useDepartments";
import { getInvestment, resetStoreStock } from "../../../api/stores";
import { useUserManagement } from "../../../hooks/useUserManagement";
import EditUserModal from "../../ui/UserModals/EditUserModal";
import ChangePasswordModal from "../../ui/UserModals/ChangePasswordModal";
import { Grid, FormControlLabel, Checkbox, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { UI_TEXT } from "../../../constants";
import Swal from "sweetalert2";
import { getStoreColumns, getStorageColumns, getTotalColumns, filterColumns, filterStorageColumns, filterTotalColumns } from "./StoreList.columns";
import CustomModal from "../../ui/Modal/Modal";
import { useModal } from "../../../hooks/useModal";
import { createMercadoPagoPreference } from "../../../api/mercadopago";
import { showError } from "../../../utils/alerts";
import mercadoPagoLogo from "../../../assets/mercadopago-logo.svg";

const getCashValueTotal = (value) => formatCurrency(value || 0);


const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const user = getUserData();

  const [storeInvestments, setStoreInvestments] = useState({});
  const [quickFilter, setQuickFilter] = useState("all");
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
    store_type: "T",
  });
  const hasDepartment = Boolean(params.department_id);

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

  const { data: storesData, isLoading: loadingStores } = useStores(params);
  const { data: tenantInfo = {}, isLoading: loadingTenant } = useTenantInfo();
  const { data: departments = [] } = useDepartments();

  const mpModal = useModal();
  const [mpLoading, setMpLoading] = useState(false);

  useEffect(() => {
    if (tenantInfo.show_mp_modal) mpModal.open();
  }, [tenantInfo.show_mp_modal]);

  const handleMpPayment = async () => {
    setMpLoading(true);
    try {
      const res = await createMercadoPagoPreference();
      if (res.data?.init_point) {
        window.open(res.data.init_point, "_blank");
        mpModal.close();
      }
    } catch {
      showError("Error", "No se pudo crear el enlace de pago");
    } finally {
      setMpLoading(false);
    }
  };

  const stores = storesData?.stores || [];
  
  const totals = storesData?.totals || {};
  const loading = loadingStores || loadingTenant;
  const range = getDateDifference(params.start_date, params.end_date);

  const handleParams = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreType = (e) => {
    setQuickFilter("all");
    setParams((prev) => ({ ...prev, store_type: e.target.value }));
  };

  const handleSelectStore = async ({ store_type, full_name, name, id, printer }) => {
    const currentUser = getUserData();
    setStorage("user", {
      ...currentUser,
      store_type,
      store_name: full_name || name,
      store_id: id,
      store_printer: printer?.id,
    });

    window.dispatchEvent(new Event("store-changed"));
    const route = store_type === "A" ? "/distribuir/" : "/vender/";
    navigate(route, { replace: true });
  };

  const handleShowInvestment = () => {
    setQuickFilter("investment");
  };

  const handleShowInvestmentForStore = async (storeId) => {
    // Si ya tiene la inversión cargada, no hacer nada
    if (storeInvestments[storeId] !== undefined) return;
    
    try {
      const response = await getInvestment(storeId);
      setStoreInvestments(prev => ({
        ...prev,
        [storeId]: response.data // response.data es directamente el número
      }));
    } catch (error) {
      // Error loading investment
    }
  };

  const handleResetStore = async (storeId, storeName) => {
    const result = await Swal.fire({
      title: '¿Vaciar stock de la tienda?',
      html: `
        <p>¿Estás seguro de vaciar el stock de <strong>${storeName}</strong>?</p>
        <p style="color: #dc2626; font-weight: 600;">Esta acción no se puede deshacer.</p>
        <p style="margin-top: 16px;">Escribe el nombre de la tienda para confirmar:</p>
      `,
      input: 'text',
      inputPlaceholder: storeName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      inputValidator: (value) => {
        if (value !== storeName) {
          return 'El nombre de la tienda no coincide';
        }
      },
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const input = Swal.getInput();
        confirmButton.disabled = true;
        
        input.addEventListener('input', (e) => {
          confirmButton.disabled = e.target.value !== storeName;
        });
      }
    });

    if (result.isConfirmed) {
      try {
        await resetStoreStock(storeId);
        Swal.fire('Stock vaciado', 'El stock de la tienda ha sido vaciado exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo vaciar el stock de la tienda', 'error');
      }
    }
  };

  // Calcular promedio de ventas para indicadores
  const averageSales = useMemo(() => {
    if (stores.length === 0) return 0;
    const totalSales = stores.reduce((sum, store) => 
      sum + (store.cash_summary?.total_payment || 0), 0
    );
    return totalSales / stores.length;
  }, [stores]);

  // Filtrar tiendas según filtro rápido
  const filteredStores = useMemo(() => {
    if (quickFilter === "all") return stores;
    if (quickFilter === "pending") {
      return stores.filter(store => 
        (store.cash_summary?.pending_distributions || 0) > 0 || 
        (store.cash_summary?.pending_transfers || 0) > 0
      );
    }
    if (quickFilter === "synced") {
      return stores.filter(store => 
        !store.has_all_products
      );
    }
    if (quickFilter === "printer") {
      return stores.filter(store => store.printer);
    }
    return stores;
  }, [stores, quickFilter]);

  const memoStores = useMemo(() => filteredStores, [filteredStores]);

  const columnsStore = useMemo(() => {
    const allColumns = getStoreColumns({ user, averageSales, storeInvestments, handleSelectStore, handleOpenEditUser, handleOpenChangePassword, handleShowInvestmentForStore, handleResetStore });
    return filterColumns(allColumns, quickFilter, hasDepartment);
  }, [quickFilter, averageSales, user?.store_id, storeInvestments, hasDepartment]);

  const columnsStorages = useMemo(() => {
    const allColumns = getStorageColumns({ user, storeInvestments, handleSelectStore, handleOpenEditUser, handleOpenChangePassword, handleShowInvestmentForStore, handleResetStore });
    return filterStorageColumns(allColumns, quickFilter);
  }, [quickFilter, storeInvestments]);

  const columnsTotals = useMemo(() => {
    const allColumns = getTotalColumns({ user, hasDepartment });
    return filterTotalColumns(allColumns, quickFilter, hasDepartment);
  }, [quickFilter, storeInvestments, hasDepartment]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title={params.store_type === "T" ? "Tiendas" : "Almacenes"}>
            {tenantInfo.notices && tenantInfo.notices.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {tenantInfo.notices.map((notice, index) => (
                  <Chip 
                    key={index}
                    label={notice.notice}
                    color={notice.variant === 'error' ? 'error' : notice.variant === 'warning' ? 'warning' : 'success'}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'var(--color-primary)', p: 1, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}># Productos</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{tenantInfo.product_count || 0}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'var(--color-primary)', p: 1, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>Ventas Totales</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{totals.total_sales || 0}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'var(--color-primary)', p: 1, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>Monto Total</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{getCashValueTotal(totals.total_payment)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ bgcolor: 'var(--color-primary)', p: 1, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>Ganancia Total</Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>{getCashValueTotal(totals.profit)}</Typography>
                </Box>
              </Grid>
            </Grid>

          <Box sx={{ mb: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleStoreType}
                      value="T"
                      checked={params.store_type === "T"}
                    />
                  }
                  label="Tiendas"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleStoreType}
                      value="A"
                      checked={params.store_type === "A"}
                    />
                  }
                  label="Almacenes"
                />
              </Grid>
              <Grid item xs={12} md={8} style={{ textAlign: "center" }}>
                {params.store_type === "T" && (
                  <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
                    <span className="text-success">● Arriba del promedio</span>
                    {' | '}
                    <span className="status-dot--warning">● Promedio</span>
                    {' | '}
                    <span className="text-danger">● Debajo del promedio</span>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>

          <Box component="form" sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Fecha de inicio"
                    name="start_date"
                    type="date"
                    value={params.start_date}
                    onChange={handleParams}
                    inputProps={{ max: today }}
                    InputLabelProps={{ shrink: true }}
                    disabled={params.store_type === "A"}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Fecha de fin"
                    name="end_date"
                    type="date"
                    value={params.end_date}
                    onChange={handleParams}
                    inputProps={{ max: today }}
                    InputLabelProps={{ shrink: true }}
                    disabled={params.store_type === "A"}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Rango"
                    name="range"
                    type="text"
                    value={range}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                {departments.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small" disabled={params.store_type === "A"}>
                      <InputLabel>Departamento</InputLabel>
                      <Select
                        value={params.department_id || ""}
                        onChange={handleParams}
                        name="department_id"
                        label="Departamento"
                      >
                        <MenuItem value="">{UI_TEXT.ALL}</MenuItem>
                        <MenuItem value="0">Sin departamento</MenuItem>
                        {departments.map((departament) => (
                          <MenuItem key={departament.id} value={departament.id}>
                            {departament.name} ({departament.product_count})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>

          {params.store_type === "T" && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "all" ? "contained" : "outlined"} onClick={() => setQuickFilter("all")} size="small">
                  Pagos ({stores.length})
                </CustomButton>
              </Grid>
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "sales" ? "contained" : "outlined"} onClick={() => setQuickFilter("sales")} size="small">
                  Ventas ({stores.length})
                </CustomButton>
              </Grid>
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "managers" ? "contained" : "outlined"} onClick={() => setQuickFilter("managers")} size="small">
                  Administradores
                </CustomButton>
              </Grid>
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "investment" ? "contained" : "outlined"} onClick={handleShowInvestment} size="small" startIcon={<AttachMoneyIcon />}>
                  Inversión
                </CustomButton>
              </Grid>
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "printer" ? "contained" : "outlined"} onClick={() => setQuickFilter("printer")} size="small">
                  Impresoras ({stores.filter(s => s.printer).length})
                </CustomButton>
              </Grid>
              {stores.filter(s => !s.has_all_products).length > 0 && (
                <Grid item md={2} xs={6}>
                  <CustomButton fullWidth variant={quickFilter === "synced" ? "contained" : "outlined"} onClick={() => setQuickFilter("synced")} size="small">
                    Catálogo Incompleto ({stores.filter(s => !s.has_all_products).length})
                  </CustomButton>
                </Grid>
              )}
              <Grid item md={2} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "actions" ? "contained" : "outlined"} onClick={() => setQuickFilter("actions")} size="small">
                  Acciones
                </CustomButton>
              </Grid>
            </Grid>
          )}

          {params.store_type === "A" && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item md={3} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "all" ? "contained" : "outlined"} onClick={() => setQuickFilter("all")} size="small">
                  Todos
                </CustomButton>
              </Grid>
              <Grid item md={3} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "managers" ? "contained" : "outlined"} onClick={() => setQuickFilter("managers")} size="small">
                  Administradores
                </CustomButton>
              </Grid>
              <Grid item md={3} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "investment" ? "contained" : "outlined"} onClick={handleShowInvestment} size="small" startIcon={<AttachMoneyIcon />}>
                  Inversión
                </CustomButton>
              </Grid>
              {stores.filter(s => !s.has_all_products).length > 0 && (
                <Grid item md={3} xs={6}>
                  <CustomButton fullWidth variant={quickFilter === "synced" ? "contained" : "outlined"} onClick={() => setQuickFilter("synced")} size="small">
                    Catálogo Incompleto ({stores.filter(s => !s.has_all_products).length})
                  </CustomButton>
                </Grid>
              )}
              <Grid item md={3} xs={6}>
                <CustomButton fullWidth variant={quickFilter === "actions" ? "contained" : "outlined"} onClick={() => setQuickFilter("actions")} size="small">
                  Acciones
                </CustomButton>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mb: 2 }}>
            <DataTable
              progressPending={loading}
              noDataComponent="Sin tiendas"
              data={memoStores}
              columns={
                params.store_type === "T" ? columnsStore : columnsStorages
              }
              conditionalRowStyles={[
                {
                  when: row => row.id === user?.store_id,
                  style: {
                    backgroundColor: '#e3f2fd',
                    fontWeight: 500,
                  },
                },
              ]}
            />
          </Box>

          {params.store_type === "T" && stores.length > 1 && !["managers", "printer", "actions"].includes(quickFilter) && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{ mb: 2 }}>
                <h2>Totales</h2>
              </Box>
              <DataTable
                progressPending={loading}
                data={[
                  {
                    profit: totals.profit,
                    paymentCash: totals.EF,
                    paymentCard: totals.TA,
                    paymentTransfer: totals.TR,
                    totalPayment: totals.total_payment,
                    cash: totals.cash,
                    totalSales: `${totals.total_sales || 0}`,
                    canceledSales: totals.canceled_sales,
                  },
                ]}
                columns={columnsTotals}
              />
            </Box>
          )}
        </Grid>
      </Grid>

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

      <CustomModal showOut={mpModal.isOpen} onClose={mpModal.close} title="Pago de servicio">
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box component="img" src={mercadoPagoLogo} alt="Mercado Pago" sx={{ height: 40, mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 3 }}>
            Tu suscripción está próxima a vencer o ya venció. Realiza tu pago para continuar usando el sistema.
          </Typography>
          <CustomButton onClick={handleMpPayment} disabled={mpLoading}>
            {mpLoading ? "Generando enlace..." : "Pagar con Mercado Pago"}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default StoreList;
