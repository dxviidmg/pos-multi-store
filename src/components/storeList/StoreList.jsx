import { useMemo, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Alert, Form } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import {
  BankIcon,
  CardIcon,
  CashIcon,
  chooseIcon,
  HomeIcon,
  PrinterIcon,
} from "../commons/icons/Icons";
import { getStorage, setStorage } from "../utils/storage";
import CustomTooltip from "../commons/Tooltip";
import { useStores } from "../../hooks/useStores";
import { useTenantInfo } from "../../hooks/useTenantInfo";
import { useDepartments } from "../../hooks/useDepartments";
import { useInvestment } from "../../hooks/useInvestment";
import { Grid } from "@mui/material";

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
  const totals = {
    ...(storesData?.totals || {}),
    investment: investmentData?.total || 0,
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
      wrap: true,
      selector: ({ name }) => <>{name}</>,
    },
    // Mostrar detalles de pagos y ventas

    {
      name: "Pagos",
      style: alignTdStyles,
      cell: ({ cash_summary }) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CashIcon />
              <span>{getCashValue(cash_summary, 0)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CardIcon />
              <span>{getCashValue(cash_summary, 1)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <BankIcon />
              <span>{getCashValue(cash_summary, 2)}</span>
            </div>
          </div>
        );
      },
    },

    {
      name: "Ventas ($)",
      style: alignTdStyles,
      grow: 1.1,
      cell: ({ cash_summary }) => {
        const vendido = cash_summary?.[3]?.amount || 0;
        const realizadas = cash_summary?.[10]?.amount || 0;
        const promedio = realizadas === 0 ? 0 : vendido / realizadas;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Vendido: {getCashValue(cash_summary, 3)}</div>
            <div>Promedio: {getCashValueTotal(promedio)}</div>
          </div>
        );
      },
    },

    {
      name: "Ventas (#)",
      style: alignTdStyles,
      cell: ({ cash_summary }) => {
        const realizadas = cash_summary?.[10]?.amount?.toLocaleString() || "0";
        const canceladas = cash_summary?.[11]?.amount?.toLocaleString() || "0";

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Realizadas: {realizadas}</div>
            <div>Canceladas: {canceladas}</div>
          </div>
        );
      },
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
    {
      name: "Otros",
      style: alignTdStyles,
      cell: ({ cash_summary }) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div>Ganancia: {getCashValue(cash_summary, 8)}</div>
            <div>Caja: {getCashValue(cash_summary, 7)}</div>
          </div>
        );
      },
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
          {row.printer && <PrinterIcon />}
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
    // Pagos y caja
    ...(!params.department_id && !showInvestment
      ? [
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
            name: "T. Bancaria",
            style: alignTdStyles,
            selector: ({ paymentTransfer }) =>
              getCashValueTotal(paymentTransfer),
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
            name: "Ventas",
            style: alignTdStyles,
            selector: ({ totalSales }) => totalSales,
          },
          {
            name: "V. Canceladas",
            style: alignTdStyles,
            selector: ({ canceledSales }) => canceledSales,
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
        ]
      : [
          {
            name: "Vendido",
            style: alignTdStyles,
            selector: ({ totalPayment }) => getCashValueTotal(totalPayment),
          },
          {
            name: "Ventas",
            style: alignTdStyles,
            selector: ({ totalSales }) => totalSales,
          },
          {
            name: "V. Canceladas",
            style: alignTdStyles,
            selector: ({ canceledSales }) => canceledSales,
          },
        ]),

    // Inversión (si aplica)
    ...(showInvestment
      ? [
          {
            name: "Inversión",
            style: alignTdStyles,
            selector: ({ investment }) => investment,
          },
        ]
      : []),
  ];

  return (
    <>
      <Grid container>
      <Grid item xs={12} className="custom-section">
        <CustomSpinner isLoading={loading} />

        {tenantInfo.notices && tenantInfo.notices.length > 0 && (
          <Grid container spacing={1}>
            {tenantInfo.notices.map((variant, index) => (
              <Grid item xs={12} key={index}>
                <Alert variant={"success"}>{variant}</Alert>
              </Grid>
            ))}
          </Grid>
        )}

        <h1>{params.store_type === "T" ? "Tiendas" : "Almacenes"}</h1>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Form.Label className="me-3">Ver</Form.Label>
            <Form.Check
              inline
              id="tiendas"
              label="Tiendas"
              type="radio"
              onChange={handleStoreType}
              value="T"
              checked={params.store_type === "T"}
            />
            <Form.Check
              inline
              id="almacenes"
              label="Almacenes"
              type="radio"
              onChange={handleStoreType}
              value="A"
              checked={params.store_type === "A"}
            />
          </Grid>

          <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
            <b>{tenantInfo.product_count} productos registrados</b>
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomButton fullWidth onClick={handleShowInvestment}>
              Ver inversión
            </CustomButton>
          </Grid>
        </Grid>

        {params.store_type === "T" && (
          <Form className="pb-2">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Form.Group controlId="start_date">
                  <Form.Label>Fecha de inicio</Form.Label>
                  <Form.Control
                    name="start_date"
                    type="date"
                    value={params.start_date}
                    onChange={handleParams}
                    max={today}
                  />
                </Form.Group>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Form.Group controlId="end_date">
                  <Form.Label>Fecha de fin</Form.Label>
                  <Form.Control
                    name="end_date"
                    type="date"
                    value={params.end_date}
                    onChange={handleParams}
                    max={today}
                  />
                </Form.Group>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Form.Group controlId="range">
                  <Form.Label>Rango</Form.Label>
                  <Form.Control
                    name="range"
                    type="text"
                    value={range}
                    disabled
                  />
                </Form.Group>
              </Grid>

              {departments.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Form.Group controlId="department_id">
                    <Form.Label>Departamento</Form.Label>
                    <Form.Select
                      value={params.department_id}
                      onChange={handleParams}
                      name="department_id"
                    >
                      <option value="">Todos</option>
                      <option value="0">Sin departamento</option>
                      {departments.map((departament) => (
                        <option key={departament.id} value={departament.id}>
                          {departament.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Grid>
              )}
            </Grid>
          </Form>
        )}

        <Grid container>
          <Grid item xs={12}>
            <CustomTable
              progressPending={loading}
              data={memoStores}
              columns={
                params.store_type === "T" ? columnsStore : columnsStorages
              }
            />
          </Grid>
        </Grid>

        {params.store_type === "T" && stores.length > 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2 className="pt-2">Totales</h2>
            </Grid>
            <Grid item xs={12}>
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
                  },
                ]}
                columns={columnsTotals}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  </>
  );
};

export default StoreList;
