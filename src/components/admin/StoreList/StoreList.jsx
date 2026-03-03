import { useMemo, useState } from "react";
import CustomTable from "../../ui/Table/Table";
import { Alert } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { chooseIcon } from "../../ui/icons/Icons";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import { getStorage, setStorage } from "../../../utils/storage";
import CustomTooltip from "../../ui/Tooltip";
import { useStores } from "../../../hooks/useStores";
import { useTenantInfo } from "../../../hooks/useTenantInfo";
import { useDepartments } from "../../../hooks/useDepartments";
import { useInvestment } from "../../../hooks/useInvestment";
import { Grid, FormLabel, FormControlLabel, Checkbox, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { CustomSpinner } from "../../ui/Spinner/Spinner";


const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const user = getStorage("user");

  const [showInvestment, setShowInvestment] = useState(false);
  const [quickFilter, setQuickFilter] = useState("all"); // all, sales, pending, synced
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
    store_type: "T",
  });

  const { data: storesData, isLoading: loadingStores } = useStores(params);
  const { data: tenantInfo = {}, isLoading: loadingTenant } = useTenantInfo();
  const { data: departments = [] } = useDepartments();
  const { data: investmentData, isLoading: loadingInvestment } =
    useInvestment(showInvestment);

  // Merge investment data with stores if available
  const storesWithInvestment = useMemo(() => {
    if (!showInvestment || !investmentData) return storesData?.stores || [];

    return (storesData?.stores || []).map((store) => {
      const matchingInvestment = investmentData.investments.find(
        (inv) => inv.id === store.id
      );
      return matchingInvestment
        ? { ...store, investment: matchingInvestment.investment }
        : store;
    });
  }, [storesData, investmentData, showInvestment]);

  const stores = storesWithInvestment;
  
  // Calcular totales de distribuciones y traspasos
  const totalDistributions = stores.reduce((sum, store) => 
    sum + (store.cash_summary?.[12]?.amount || 0), 0
  );
  const totalTransfers = stores.reduce((sum, store) => 
    sum + (store.cash_summary?.[13]?.amount || 0), 0
  );
  
  const totals = {
    ...(storesData?.totals || {}),
    investment: investmentData?.total || 0,
    distributions: totalDistributions,
    transfers: totalTransfers,
  };
  const loading = loadingStores || loadingTenant || loadingInvestment;
  const range = getDateDifference(params.start_date, params.end_date);

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStoreType = (e) => {
    setParams((prev) => ({ ...prev, store_type: e.target.value }));
    setShowInvestment(false);
  };

  const handleSelectStore = async ({ store_type, full_name, id, printer }) => {
    const user = getStorage("user");
    setStorage("user", {
      ...user,
      store_type,
      store_name: full_name,
      store_id: id,
      store_printer: printer,
    });

    navigate("/vender/", { replace: true });
  };

  const handleShowInvestment = () => {
    setShowInvestment(true);
  };

  // Calcular promedio de ventas para indicadores
  const averageSales = useMemo(() => {
    if (stores.length === 0) return 0;
    const totalSales = stores.reduce((sum, store) => 
      sum + (store.cash_summary?.[3]?.amount || 0), 0
    );
    return totalSales / stores.length;
  }, [stores]);

  // Filtrar tiendas según filtro rápido
  const filteredStores = useMemo(() => {
    if (quickFilter === "all") return stores;
    if (quickFilter === "pending") {
      return stores.filter(store => 
        (store.cash_summary?.[12]?.amount || 0) > 0 || 
        (store.cash_summary?.[13]?.amount || 0) > 0
      );
    }
    if (quickFilter === "synced") {
      return stores.filter(store => 
        store.products_count !== tenantInfo.product_count
      );
    }
    if (quickFilter === "printer") {
      return stores.filter(store => store.printer);
    }
    return stores;
  }, [stores, quickFilter, tenantInfo.product_count]);

  const memoStores = useMemo(() => filteredStores, [filteredStores]);

  const alignTdStyles = {
    justifyContent: "flex-end", // para alinear dentro del td con flexbox
    textAlign: "right",
  };

  const getCashValue = (cash_summary, index) =>
    `$${(cash_summary?.[index]?.amount || 0).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getCashValueTotal = (value) =>
    `$${(value || 0).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const columnsStore = useMemo(() => {
    const allColumns = [
      {
        name: "Nombre",
        wrapText: true,
        cell: ({ name, id, cash_summary }) => {
          const vendido = cash_summary?.[3]?.amount || 0;
          const isAboveAverage = vendido > averageSales;
          const isBelowAverage = vendido < averageSales * 0.8;
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAboveAverage && <span style={{ color: '#10b981', fontSize: '20px' }}>●</span>}
              {isBelowAverage && <span style={{ color: '#ef4444', fontSize: '20px' }}>●</span>}
              {!isAboveAverage && !isBelowAverage && <span style={{ color: '#f59e0b', fontSize: '20px' }}>●</span>}
              <span style={{ fontWeight: id === user?.store_id ? 'bold' : 'normal' }}>
                {name}
              </span>
            </Box>
          );
        },
      },
      {
        name: "Administrador",
        selector: ({ manager_username }) => manager_username || "-",
      },
      {
        name: "Impresora",
        cell: ({ printer }) => printer ? <PrintIcon /> : "-",
      },
      {
        name: "Efectivo",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 0),
      },
      {
        name: "Tarjeta",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 1),
      },
      {
        name: "Transferencia",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 2),
      },
      {
        name: "Vendido",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 3),
      },
      {
        name: "Realizadas",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.[10]?.amount?.toLocaleString() || "0",
      },
      {
        name: "Canceladas",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.[11]?.amount?.toLocaleString() || "0",
      },
      {
        name: "Distribuciones",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.[12]?.amount?.toLocaleString() || "0",
      },
      {
        name: "Traspasos",
        style: alignTdStyles,
        selector: ({ cash_summary }) => cash_summary?.[13]?.amount?.toLocaleString() || "0",
      },
      {
        name: "Ganancia",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 8),
      },
      {
        name: "Caja",
        style: alignTdStyles,
        selector: ({ cash_summary }) => getCashValue(cash_summary, 7),
      },
      ...(showInvestment
        ? [
            {
              style: alignTdStyles,
              name: "Inversión",
              selector: ({ investment }) => getCashValueTotal(investment),
            },
          ]
        : []),
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
        name: "Opciones",
        cell: (row) => (
          <>
            {chooseIcon(row.products_count === tenantInfo.product_count)}
            {row.printer && <PrintIcon />}
          </>
        ),
      },
    ];

    // Filtrar columnas según quickFilter
    let filtered;
    if (quickFilter === "all") {
      filtered = allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Entrar"].includes(col.name));
    } else if (quickFilter === "sales") {
      filtered = allColumns.filter(col => ["Nombre", "Vendido", "Realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
    } else if (quickFilter === "pending") {
      filtered = allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
    } else if (quickFilter === "cash") {
      filtered = allColumns.filter(col => ["Nombre", "Caja", "Entrar"].includes(col.name));
    } else if (quickFilter === "managers") {
      filtered = allColumns.filter(col => ["Nombre", "Administrador", "Entrar"].includes(col.name));
    } else if (quickFilter === "printer") {
      filtered = allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
    } else if (quickFilter === "synced") {
      filtered = [
        allColumns.find(col => col.name === "Nombre"),
        {
          name: "Catálogo",
          cell: ({ products_count }) => (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Debe ser: <strong>{tenantInfo.product_count}</strong>
              </span>
              <span style={{ fontSize: '13px', color: '#dc2626' }}>
                Faltan: <strong>{tenantInfo.product_count - products_count}</strong>
              </span>
            </Box>
          ),
        },
        allColumns.find(col => col.name === "Entrar"),
      ];
    } else {
      filtered = allColumns;
    }
    
    console.log('quickFilter:', quickFilter, 'columns count:', filtered.length);
    return filtered;
  }, [quickFilter, showInvestment, averageSales, user?.store_id, tenantInfo.product_count]);

  const columnsStorages = [
    {
      name: "Nombre",
      selector: ({ name }) => `${name}`,
    },

    {
      name: "Pendientes",
      style: alignTdStyles,
      cell: ({ cash_summary }) => {
        const distributions =
          cash_summary?.[12]?.amount?.toLocaleString() || "0";
        const transfers = cash_summary?.[13]?.amount?.toLocaleString() || "0";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Distribuciones: {distributions}</div>
            <div>Traspasos: {transfers}</div>
          </div>
        );
      },
    },

    ...(showInvestment
      ? [
          {
            name: "Inversión",
            style: alignTdStyles,
            selector: ({ investment }) =>
              investment ? `$${investment.toLocaleString()}` : "$0",
          },
        ]
      : []),

    {
      name: "Entrar",
      cell: (row) => (
        <>
          <CustomTooltip text={"Ingresar al almacen"}>
            <CustomButton onClick={() => handleSelectStore(row)}>
              <HomeIcon />
            </CustomButton>
          </CustomTooltip>
        </>
      ),
    },
    {
      name: "Opciónes",
      cell: ({ products_count }) => (
        <>{chooseIcon(products_count === tenantInfo.product_count)}</>
      ),
    },
  ];

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
        name: "Realizadas",
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
      ...(showInvestment
        ? [
            {
              name: "Inversión",
              style: alignTdStyles,
              selector: ({ investment }) => getCashValueTotal(investment),
            },
          ]
        : []),
      {
        name: "Entrar",
        selector: () => "",
      },
      {
        name: "Opciones",
        selector: () => "",
      },
    ];

    // Filtrar columnas según quickFilter
    let filtered;
    if (quickFilter === "all") {
      filtered = allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Entrar"].includes(col.name));
    } else if (quickFilter === "sales") {
      filtered = allColumns.filter(col => ["Nombre", "Vendido", "Realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
    } else if (quickFilter === "pending") {
      filtered = allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
    } else if (quickFilter === "cash") {
      filtered = allColumns.filter(col => ["Nombre", "Caja", "Entrar"].includes(col.name));
    } else if (quickFilter === "managers") {
      filtered = allColumns.filter(col => ["Nombre", "Administrador", "Entrar"].includes(col.name));
    } else if (quickFilter === "printer") {
      filtered = allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
    } else {
      filtered = allColumns;
    }
    
    return filtered;
  }, [quickFilter, showInvestment]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <Grid container>
        <Grid item xs={12} className="custom-section">
          {tenantInfo.notices && tenantInfo.notices.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {tenantInfo.notices.map((notice, index) => (
                  <Grid item xs={12} key={index}>
                    <Alert 
                      variant="filled" 
                      severity={notice.includes('demo') ? 'success' : 'error'}
                      sx={{ fontWeight: 600, fontSize: '1rem' }}
                    >
                      {notice}
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <h1>{params.store_type === "T" ? "Tiendas" : "Almacenes"}</h1>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormLabel className="me-3">Ver</FormLabel>
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
                <Box>
                  <b>{tenantInfo.product_count} productos registrados</b>
                </Box>
                {params.store_type === "T" && (
                  <Box sx={{ mt: 1, fontSize: '0.75rem', color: '#666' }}>
                    <span style={{ color: '#10b981' }}>● Arriba del promedio</span>
                    {' | '}
                    <span style={{ color: '#f59e0b' }}>● Promedio</span>
                    {' | '}
                    <span style={{ color: '#ef4444' }}>● Debajo del promedio</span>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomButton
                  fullWidth
                  onClick={handleShowInvestment}
                  startIcon={<AttachMoneyIcon />}
                >
                  Ver inversión
                </CustomButton>
              </Grid>
            </Grid>
          </Box>

          {params.store_type === "T" && (
            <Box component="form" sx={{ mb: 3 }}>
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
                        <MenuItem value="">Todos</MenuItem>
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
                variant={quickFilter === "cash" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("cash")}
                size="small"
              >
                Caja ({stores.length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "pending" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("pending")}
                size="small"
              >
                Pendientes ({stores.filter(s => 
                  (s.cash_summary?.[12]?.amount || 0) > 0 || 
                  (s.cash_summary?.[13]?.amount || 0) > 0
                ).length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "managers" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("managers")}
                size="small"
              >
                Administradores ({stores.length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "printer" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("printer")}
                size="small"
              >
                Impresoras ({stores.filter(s => s.printer).length})
              </CustomButton>
              <CustomButton 
                variant={quickFilter === "synced" ? "contained" : "outlined"}
                onClick={() => setQuickFilter("synced")}
                size="small"
              >
                Catálogo Incompleto ({stores.filter(s => 
                  s.products_count !== tenantInfo.product_count
                ).length})
              </CustomButton>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            <CustomTable
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
              <CustomTable
                progressPending={loading}
                data={[
                  {
                    profit: totals.profit,
                    paymentCash: totals.paymentCash,
                    paymentCard: totals.paymentCard,
                    paymentTransfer: totals.paymentTransfer,
                    totalPayment: totals.totalPayment,
                    cash: totals.cash,
                    investment: totals.investment,
                    totalSales: `${totals.totalSales}`,
                    canceledSales: totals.canceledSales,
                    distributions: totals.distributions,
                    transfers: totals.transfers,
                  },
                ]}
                columns={columnsTotals}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StoreList;
