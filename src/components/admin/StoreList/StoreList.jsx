import { useMemo, useState } from "react";
import CustomTable from "../../ui/Table/Table";
import { Alert } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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


const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [showInvestment, setShowInvestment] = useState(false);
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

  const memoStores = useMemo(() => stores, [stores]);

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

  const columnsStore = [
    {
      name: "Nombre",
      wrapText: true,
      selector: ({ name }) => <>{name}</>,
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
      name: "Promedio",
      style: alignTdStyles,
      selector: ({ cash_summary }) => {
        const vendido = cash_summary?.[3]?.amount || 0;
        const realizadas = cash_summary?.[10]?.amount || 0;
        const promedio = realizadas === 0 ? 0 : vendido / realizadas;
        return getCashValueTotal(promedio);
      },
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

    // Mostrar inversión (si aplica)
    ...(showInvestment
      ? [
          {
            style: alignTdStyles,
            name: "Inversión",
            selector: ({ investment }) => getCashValueTotal(investment),
          },
        ]
      : []),

    // Entrar
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

    // Opciones
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

  const columnsTotals = [
    {
      name: "Nombre",
      selector: () => "TOTAL",
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
      name: "Promedio",
      style: alignTdStyles,
      selector: ({ totalPayment, totalSales }) =>
        getCashValueTotal(totalPayment / totalSales),
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

    // Inversión (si aplica)
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

  return (
    <>
      <Grid container>
        <Grid item xs={12} className="custom-section">
          {tenantInfo.notices && tenantInfo.notices.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {tenantInfo.notices.map((variant, index) => (
                  <Grid item xs={12} key={index}>
                    <Alert severity="success">{variant}</Alert>
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
                <b>{tenantInfo.product_count} productos registrados</b>
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

          <Box sx={{ mb: 2 }}>
            <CustomTable
              progressPending={loading}
              data={memoStores}
              columns={
                params.store_type === "T" ? columnsStore : columnsStorages
              }
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
