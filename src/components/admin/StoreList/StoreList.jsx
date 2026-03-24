import { useMemo, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { Alert, Typography, Chip } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/utils";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { chooseIcon } from "../../ui/Icons/Icons";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import { getStorage, setStorage } from "../../../utils/storage";
import CustomTooltip from "../../ui/Tooltip";
import { useStores } from "../../../hooks/useStores";
import { useTenantInfo } from "../../../hooks/useTenantInfo";
import { useDepartments } from "../../../hooks/useDepartments";
import { useInvestment } from "../../../hooks/useInvestment";
import { getInvestment, resetStoreStock } from "../../../api/stores";
import { useUserManagement } from "../../../hooks/useUserManagement";
import EditUserModal from "../../ui/UserModals/EditUserModal";
import ChangePasswordModal from "../../ui/UserModals/ChangePasswordModal";
import { Grid, FormLabel, FormControlLabel, Checkbox, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { UI_TEXT } from "../../../constants";
import Swal from "sweetalert2";


const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const user = getStorage("user");

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

  const stores = storesData?.stores || [];
  
  const totals = storesData?.totals || {};
  const loading = loadingStores || loadingTenant;
  const range = getDateDifference(params.start_date, params.end_date);

  const handleParams = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreType = (e) => {
    setParams((prev) => ({ ...prev, store_type: e.target.value }));
  };

  const handleSelectStore = async ({ store_type, full_name, name, id, printer }) => {
    const user = getStorage("user");
    setStorage("user", {
      ...user,
      store_type,
      store_name: full_name || name,
      store_id: id,
      store_printer: printer,
    });

    window.dispatchEvent(new Event("store-changed"));
    navigate("/vender/", { replace: true });
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

  const alignTdStyles = {
    justifyContent: "flex-end", // para alinear dentro del td con flexbox
    textAlign: "right",
  };

  const getCashValue = (cash_summary, key) =>
    formatCurrency(cash_summary?.[key] || 0);

  const getCashValueTotal = (value) =>
    formatCurrency(value || 0);

  const columnsStore = useMemo(() => {
    const allColumns = [
      {
        name: "Nombre",
        cell: ({ name, id, cash_summary }) => {
          const vendido = cash_summary?.total_payment || 0;
          const isAboveAverage = vendido > averageSales;
          const isBelowAverage = vendido < averageSales * 0.8;
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAboveAverage && <span className="status-dot status-dot--success">●</span>}
              {isBelowAverage && <span className="status-dot status-dot--danger">●</span>}
              {!isAboveAverage && !isBelowAverage && <span className="status-dot status-dot--warning">●</span>}
              <span style={{ fontWeight: id === user?.store_id ? 'bold' : 'normal' }}>
                {name}
              </span>
            </Box>
          );
        },
      },
      {
        name: "Administrador",
        selector: ({ manager }) => manager?.username || "-",
      },
      {
        name: "Editar usuario",
        omit: user?.role !== "owner",
        cell: (row) => row.manager?.username ? (
          <CustomButton size="small" startIcon={<EditIcon />} onClick={() => handleOpenEditUser(row.manager.id)}>
            Editar
          </CustomButton>
        ) : "-",
      },
      {
        name: "Cambiar contraseña",
        omit: user?.role !== "owner",
        cell: (row) => row.manager?.username ? (
          <CustomButton size="small" startIcon={<LockResetIcon />} onClick={() => handleOpenChangePassword(row.manager.id)}>
            Cambiar
          </CustomButton>
        ) : "-",
      },
      {
        name: "Impresora",
        cell: ({ printer }) => printer ? <PrintIcon /> : "-",
      },
      {
        name: "Efectivo",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "EF"),
      },
      {
        name: "Tarjeta",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "TA"),
      },
      {
        name: "Transferencia",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "TR"),
      },
      {
        name: "Vendido",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "total_payment"),
      },
      {
        name: "Ventas realizadas",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.total_sales?.toLocaleString() || "0",
      },
      {
        name: "Canceladas",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.canceled_sales?.toLocaleString() || "0",
      },
      {
        name: "Distribuciones",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.pending_distributions?.toLocaleString() || "0",
      },
      {
        name: "Traspasos",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.pending_transfers?.toLocaleString() || "0",
      },
      {
        name: "Ganancia",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "profit"),
      },
      {
        name: "Caja",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, "cash"),
      },
      {
        name: "Obtener (Inversión)",
        cell: (row) => (
          <CustomButton 
            size="small"
            onClick={() => handleShowInvestmentForStore(row.id)}
            startIcon={<AttachMoneyIcon />}
            disabled={storeInvestments[row.id] !== undefined}
          >
            Ver
          </CustomButton>
        ),
      },
      {
        name: "Inversión",
        cell: (row) => (
          storeInvestments[row.id] !== undefined ? (
            <span>{getCashValueTotal(storeInvestments[row.id])}</span>
          ) : (
            <span className="text-muted">Pendiente</span>
          )
        ),
      },
      {
        name: "Vaciar stock",
        cell: (row) => (
          <CustomTooltip text="Vaciar stock de la tienda">
            <CustomButton 
              onClick={() => handleResetStore(row.id, row.name)}
              size="small"
            >
              <RestartAltIcon />
            </CustomButton>
          </CustomTooltip>
        ),
      },
      {
        name: "Entrar",
        cell: (row) => (
          <CustomTooltip text="Ingresar a la tienda">
            <CustomButton onClick={() => handleSelectStore(row)}>
              <HomeIcon />
            </CustomButton>
          </CustomTooltip>
        ),
      },
      {
        name: "Acciones",
        cell: (row) => (
          <>
            {chooseIcon(row.has_all_products)}
            {row.printer && <PrintIcon />}
          </>
        ),
      },
    ];

    // Filtrar columnas según quickFilter
    let filtered;
    if (quickFilter === "all") {
      filtered = hasDepartment
        ? allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name))
        : allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Caja", "Entrar"].includes(col.name));
    } else if (quickFilter === "sales") {
      filtered = allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
    } else if (quickFilter === "investment") {
      filtered = allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
    } else if (quickFilter === "pending") {
      filtered = allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
    } else if (quickFilter === "managers") {
      filtered = allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
    } else if (quickFilter === "printer") {
      filtered = allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
    } else if (quickFilter === "synced") {
      filtered = [
        allColumns.find(col => col.name === "Nombre"),
        {
          name: "Catálogo",
          cell: ({ has_all_products }) => (
            <span style={{ fontSize: '13px', color: has_all_products ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {has_all_products ? "Completo" : "Incompleto"}
            </span>
          ),
        },
        allColumns.find(col => col.name === "Entrar"),
      ];
    } else if (quickFilter === "actions") {
      filtered = allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
    } else {
      filtered = allColumns;
    }
    
    return filtered;
  }, [quickFilter, averageSales, user?.store_id, storeInvestments, hasDepartment]);

  const columnsStorages = useMemo(() => {
    const allColumns = [
      {
        name: "Nombre",
        selector: ({ name }) => `${name}`,
      },
      {
        name: "Administrador",
        selector: ({ manager }) => manager?.username || "-",
      },
      {
        name: "Editar usuario",
        omit: user?.role !== "owner",
        cell: (row) => row.manager?.username ? (
          <CustomButton size="small" startIcon={<EditIcon />} onClick={() => handleOpenEditUser(row.manager.id)}>
            Editar
          </CustomButton>
        ) : "-",
      },
      {
        name: "Cambiar contraseña",
        omit: user?.role !== "owner",
        cell: (row) => row.manager?.username ? (
          <CustomButton size="small" startIcon={<LockResetIcon />} onClick={() => handleOpenChangePassword(row.manager.id)}>
            Cambiar
          </CustomButton>
        ) : "-",
      },
      {
        name: "Pendientes",
        style: alignTdStyles,
        cell: ({ cash_summary }) => {
          const distributions =
            cash_summary?.pending_distributions?.toLocaleString() || "0";
          const transfers = cash_summary?.pending_transfers?.toLocaleString() || "0";

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div>Distribuciones: {distributions}</div>
              <div>Traspasos: {transfers}</div>
            </div>
          );
        },
      },
      {
        name: "Obtener (Inversión)",
        cell: (row) => (
          <CustomButton 
            size="small"
            onClick={() => handleShowInvestmentForStore(row.id)}
            startIcon={<AttachMoneyIcon />}
            disabled={storeInvestments[row.id] !== undefined}
          >
            Ver
          </CustomButton>
        ),
      },
      {
        name: "Inversión",
        cell: (row) => (
          storeInvestments[row.id] !== undefined ? (
            <span>{getCashValueTotal(storeInvestments[row.id])}</span>
          ) : (
            <span className="text-muted">Pendiente</span>
          )
        ),
      },
      {
        name: "Vaciar stock",
        cell: (row) => (
          <CustomTooltip text="Vaciar stock de la tienda">
            <CustomButton 
              onClick={() => handleResetStore(row.id, row.name)}
              size="small"
            >
              <RestartAltIcon />
            </CustomButton>
          </CustomTooltip>
        ),
      },
      {
        name: "Entrar",
        cell: (row) => (
          <CustomTooltip text="Ingresar al almacen">
            <CustomButton onClick={() => handleSelectStore(row)}>
              <HomeIcon />
            </CustomButton>
          </CustomTooltip>
        ),
      },
      {
        name: "Acciones",
        cell: ({ has_all_products }) => (
          <>{chooseIcon(has_all_products)}</>
        ),
      },
    ];

    // Filtrar columnas según quickFilter
    let filtered;
    if (quickFilter === "all") {
      filtered = allColumns.filter(col => ["Nombre", "Entrar"].includes(col.name));
    } else if (quickFilter === "pending") {
      filtered = allColumns.filter(col => ["Nombre", "Pendientes", "Entrar"].includes(col.name));
    } else if (quickFilter === "managers") {
      filtered = allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
    } else if (quickFilter === "investment") {
      filtered = allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
    } else if (quickFilter === "synced") {
      filtered = [
        allColumns.find(col => col.name === "Nombre"),
        {
          name: "Catálogo",
          cell: ({ has_all_products }) => (
            <span style={{ fontSize: '13px', color: has_all_products ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {has_all_products ? "Completo" : "Incompleto"}
            </span>
          ),
        },
        allColumns.find(col => col.name === "Entrar"),
      ];
    } else if (quickFilter === "actions") {
      filtered = allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
    } else {
      filtered = allColumns;
    }
    
    return filtered;
  }, [quickFilter, storeInvestments]);

  const columnsTotals = useMemo(() => {
    const allColumns = [
      {
        name: "Nombre",
        selector: () => "TOTAL",
      },
      {
        name: "Administrador",
        selector: () => "",
      },
      {
        name: "Editar usuario",
        omit: user?.role !== "owner",
        selector: () => "",
      },
      {
        name: "Cambiar contraseña",
        omit: user?.role !== "owner",
        selector: () => "",
      },
      {
        name: "Impresora",
        selector: () => "",
      },
      {
        name: "Efectivo",
        style: alignTdStyles,
        selector: ({ paymentCash }) => getCashValueTotal(paymentCash),
      },
      {
        name: "Tarjeta",
        style: alignTdStyles,
        selector: ({ paymentCard }) => getCashValueTotal(paymentCard),
      },
      {
        name: "Transferencia",
        style: alignTdStyles,
        selector: ({ paymentTransfer }) => getCashValueTotal(paymentTransfer),
      },
      {
        name: "Vendido",
        style: alignTdStyles,
        selector: ({ totalPayment }) => getCashValueTotal(totalPayment),
      },
      {
        name: "Ventas realizadas",
        style: alignTdStyles,
        selector: ({ totalSales }) => totalSales,
      },
      {
        name: "Canceladas",
        style: alignTdStyles,
        selector: ({ canceledSales }) => canceledSales,
      },
      {
        name: "Distribuciones",
        style: alignTdStyles,
        selector: ({ distributions }) => distributions?.toLocaleString() || "0",
      },
      {
        name: "Traspasos",
        style: alignTdStyles,
        selector: ({ transfers }) => transfers?.toLocaleString() || "0",
      },
      {
        name: "Ganancia",
        style: alignTdStyles,
        selector: ({ profit }) => getCashValueTotal(profit),
      },
      {
        name: "Caja",
        style: alignTdStyles,
        selector: ({ cash }) => getCashValueTotal(cash),
      },
      {
        name: "Vaciar stock",
        selector: () => "",
      },
      {
        name: "Entrar",
        selector: () => "",
      },
      {
        name: "Acciones",
        selector: () => "",
      },
    ];

    // Filtrar columnas según quickFilter
    let filtered;
    if (quickFilter === "all") {
      filtered = hasDepartment
        ? allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name))
        : allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Caja", "Entrar"].includes(col.name));
    } else if (quickFilter === "sales") {
      filtered = allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
    } else if (quickFilter === "investment") {
      filtered = allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
    } else if (quickFilter === "pending") {
      filtered = allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
    } else if (quickFilter === "managers") {
      filtered = allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
    } else if (quickFilter === "printer") {
      filtered = allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
    } else if (quickFilter === "synced") {
      filtered = [
        allColumns.find(col => col.name === "Nombre"),
        {
          name: "Catálogo",
          selector: () => "",
        },
        allColumns.find(col => col.name === "Entrar"),
      ];
    } else if (quickFilter === "actions") {
      filtered = allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
    } else {
      filtered = allColumns;
    }
    
    return filtered;
  }, [quickFilter, storeInvestments, hasDepartment]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <Grid container>
        <Grid item xs={12} className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h1>{params.store_type === "T" ? "Tiendas" : "Almacenes"}</h1>
            {tenantInfo.notices && tenantInfo.notices.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {tenantInfo.notices.map((notice, index) => (
                  <Chip 
                    key={index}
                    label={notice.notice}
                    color={notice.variant === 'error' ? 'error' : notice.variant === 'warning' ? 'warning' : 'success'}
                    size="small"
                  />
                ))}
              </div>
            )}
          </div>

          {params.store_type === "T" && (
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
          )}

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
              <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
                {params.store_type === "T" && (
                  <Box sx={{ mt: 1, fontSize: '0.75rem', color: '#666' }}>
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

          {params.store_type === "T" && (
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
                    disabled
                  />
                </Grid>

                {departments.length > 0 && (
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
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
                            {departament.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {params.store_type === "T" && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <CustomButton 
                variant={quickFilter === "all" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("all")}
                size="small"
              >
                Pagos ({stores.length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "sales" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("sales")}
                size="small"
              >
                Ventas ({stores.length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "pending" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("pending")}
                size="small"
              >
                Pendientes ({stores.filter(s => 
                  (s.cash_summary?.pending_distributions || 0) > 0 || 
                  (s.cash_summary?.pending_transfers || 0) > 0
                ).length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "printer" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("printer")}
                size="small"
              >
                Impresoras ({stores.filter(s => s.printer).length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "investment" ? "contained" : "outlined"}
                onClick={handleShowInvestment}
                size="small"
                startIcon={<AttachMoneyIcon />}
              >
                Inversión
              </CustomButton>
              {stores.filter(s => !s.has_all_products).length > 0 && (
                <CustomButton 
                  variant={quickFilter === "synced" ? "contained" : "outlined"}
                  onClick={() => setQuickFilter("synced")}
                  size="small"
                >
                  Catálogo Incompleto ({stores.filter(s => 
                    !s.has_all_products
                  ).length})
                </CustomButton>
              )}
              <CustomButton 
                variant={quickFilter === "actions" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("actions")}
                size="small"
              >
                Acciones
              </CustomButton>
            </Box>
          )}

          {params.store_type === "A" && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <CustomButton 
                variant={quickFilter === "all" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("all")}
                size="small"
              >
                Todos
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "pending" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("pending")}
                size="small"
              >
                Pendientes ({stores.filter(s => 
                  (s.cash_summary?.pending_distributions || 0) > 0 || 
                  (s.cash_summary?.pending_transfers || 0) > 0
                ).length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "investment" ? "contained" : "outlined"}
                onClick={handleShowInvestment}
                size="small"
                startIcon={<AttachMoneyIcon />}
              >
                Inversión
              </CustomButton>
              {stores.filter(s => !s.has_all_products).length > 0 && (
                <CustomButton 
                  variant={quickFilter === "synced" ? "contained" : "outlined"}
                  onClick={() => setQuickFilter("synced")}
                  size="small"
                >
                  Catálogo Incompleto ({stores.filter(s => 
                    !s.has_all_products
                  ).length})
                </CustomButton>
              )}
              <CustomButton 
                variant={quickFilter === "actions" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("actions")}
                size="small"
              >
                Acciones
              </CustomButton>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <DataTable
              progressPending={loading}
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

          {params.store_type === "T" && stores.length > 1 && (
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
    </>
  );
};

export default StoreList;
