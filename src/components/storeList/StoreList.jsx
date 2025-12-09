import { useEffect, useMemo, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Alert, Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import { getTenantInfo } from "../apis/tenants";
import { BankIcon, CardIcon, CashIcon, chooseIcon, HomeIcon, PrinterIcon } from "../commons/icons/Icons";
import { getDepartments } from "../apis/departments";
import { getStorage, setStorage } from "../utils/storage";
import CustomTooltip from "../commons/Tooltip";

const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [showInvestment, setShowInvestment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
    store_type: "T",
  });
  const [range, setRange] = useState("");

  const [totals, setTotals] = useState({
    profit: 0,
    paymentCash: 0,
    paymentCard: 0,
    paymentTransfer: 0,
    totalPayment: 0,
    totalSales: 0,
    cash: 0,
    investment: 0,
    canceledSales: 0,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await getDepartments();
      setDepartments(response.data);
    };

    fetchDepartments();
  }, []); // Solo se ejecuta una vez al montar

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStoreType = (e) => {
    setParams((prev) => ({ ...prev, store_type: e.target.value }));
    setShowInvestment(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getTenantInfo();
      setTenantInfo(response.data);

      setTotals({
        profit: "Calculando...",
        paymentCash: "Calculando...",
        paymentCard: "Calculando...",
        paymentTransfer: "Calculando...",
        totalPayment: "Calculando...",
        totalSales: "Calculando...",
        cash: "Calculando...",
        investment: "Calculando...",
        canceledSales: "Calculando...",
      });

      const response2 = await getStores({ ...params });

      setStores(response2.data);

      const {
        profit,
        paymentCash,
        paymentCard,
        paymentTransfer,
        totalPayment,
        totalSales,
        cash,
        investment,
        canceledSales,
      } = response2.data.reduce(
        (acc, store) => ({
          profit: acc.profit + store.cash_summary[8].amount,
          paymentCash: acc.paymentCash + store.cash_summary[0].amount,
          paymentCard: acc.paymentCard + store.cash_summary[1].amount,
          paymentTransfer: acc.paymentTransfer + store.cash_summary[2].amount,
          totalPayment: acc.totalPayment + store.cash_summary[3].amount,
          totalSales: acc.totalSales + store.cash_summary[10].amount,
          cash: acc.cash + store.cash_summary[7].amount,
          investment: 0,
          canceledSales: acc.canceledSales + store.cash_summary[11].amount,
        }),
        {
          profit: 0,
          paymentCash: 0,
          paymentCard: 0,
          paymentTransfer: 0,
          totalPayment: 0,
          totalSales: 0,
          cash: 0,
          investment: 0,
          canceledSales: 0,
        }
      );

      setTotals({
        profit,
        paymentCash,
        paymentCard,
        paymentTransfer,
        totalPayment,
        cash,
        totalSales,
        investment,
        canceledSales,
      });

      const dateRange = getDateDifference(params.start_date, params.end_date);
      setRange(dateRange);
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleSelectStore = async ({ store_type, full_name, id, printer }) => {
    const user = getStorage("user");
    setStorage("user", {
      ...user,
      store_type,
      store_name: full_name,
      store_id: id,
      store_printer: printer,
    });

    navigate("/vender/");
    window.location.reload();
  };

  const handleShowInvestment = async () => {
    setLoading(true);
    const response = await getInvestment();
    setStores((prevData) =>
      prevData.map((store) => {
        const matchingInvestment = response.data.find(
          (investment) => investment.id === store.id
        );
        return matchingInvestment
          ? { ...store, investment: matchingInvestment.investment }
          : store;
      })
    );

    const { investment } = response.data.reduce(
      (acc, store) => ({
        investment: acc.investment + store.investment,
      }),
      { investment: 0 }
    );

    setTotals((prevData) => ({ ...prevData, investment }));
    setLoading(false);
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
      selector: ({ cash_summary }) => {
        return (
          <>
            <div className="d-flex justify-content-between align-items-center w-100">
              <CashIcon />
              <span>{getCashValue(cash_summary, 0)}</span>
            </div>
    
            <div className="d-flex justify-content-between align-items-center w-100">
              <CardIcon />
              <span>{getCashValue(cash_summary, 1)}</span>
            </div>
    
            <div className="d-flex justify-content-between align-items-center w-100">
              <BankIcon />
              <span>{getCashValue(cash_summary, 2)}</span>
            </div>
          </>
        );
      },
    },
    
          {
            name: "Ventas ($)",
            style: alignTdStyles,
            selector: ({ cash_summary }) => {
              const vendido = cash_summary?.[3]?.amount || 0;
              const realizadas = cash_summary?.[10]?.amount || 0;
              const promedio = realizadas === 0 ? 0 : vendido / realizadas;

              return (
                <>
                  <div>Vendido: {getCashValue(cash_summary, 3)}</div>
                  <div>Promedio: {getCashValueTotal(promedio)}</div>
                </>
              );
            },
          },

          {
            name: "Ventas (#)",
            style: alignTdStyles,
            selector: ({ cash_summary }) => {
              const realizadas =
                cash_summary?.[10]?.amount?.toLocaleString() || "0";
              const canceladas =
                cash_summary?.[11]?.amount?.toLocaleString() || "0";

              return (
                <>
                  <div>Realizadas: {realizadas}</div>
                  <div>Canceladas: {canceladas}</div>
                </>
              );
            },
          },

          {
            name: "Pendientes",
            style: alignTdStyles,
            selector: ({ cash_summary }) => {
              const distributions =
                cash_summary?.[12]?.amount?.toLocaleString() || "0";
              const transfers =
                cash_summary?.[13]?.amount?.toLocaleString() || "0";

              return (
                <>
                  <div>Distribuciones: {distributions}</div>
                  <div>Traspasos: {transfers}</div>
                </>
              );
            },
          },
          {
            name: "Otros",
            style: alignTdStyles,
            selector: ({ cash_summary }) => {
              return (
                <>
                  <div>Ganancia: {getCashValue(cash_summary, 8)}</div>
                  <div>Caja: {getCashValue(cash_summary, 7)}</div>
                </>
              );
            },
          },
        

    // Mostrar inversión (si aplica)
    ...(showInvestment
      ? [
          {
            style: alignTdStyles,
            name: "Inversión",
            selector: ({ investment }) =>
              getCashValueTotal(investment),
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
      selector: ({ cash_summary }) => {
        const distributions =
          cash_summary?.[12]?.amount?.toLocaleString() || "0";
        const transfers =
          cash_summary?.[13]?.amount?.toLocaleString() || "0";

        return (
          <>
            <div>Distribuciones: {distributions}</div>
            <div>Traspasos: {transfers}</div>
          </>
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
            selector: ({ totalPayment, totalSales }) => getCashValueTotal(totalPayment/totalSales),
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
      : [])  ];

  return (
    <>
      <div className="custom-section">
        <CustomSpinner2 isLoading={loading}></CustomSpinner2>

        {tenantInfo.notices && tenantInfo.notices.length > 0 && (
          <div>
            {tenantInfo.notices.map((variant) => (
              <Alert key={"success"} variant={"success"}>
                {variant}
              </Alert>
            ))}
          </div>
        )}

        <h1>{params.store_type === "T" ? "Tiendas" : "Almacenes"}</h1>

        <Row>
          <Col>
            {" "}
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
              id="tiendas"
              label="Almacenes"
              type="radio"
              onChange={handleStoreType}
              value="A"
              checked={params.store_type === "A"}
            />
          </Col>

          <Col className="text-center">
            <b> {tenantInfo.product_count} productos registrados</b>
          </Col>

          <Col>
            <CustomButton fullWidth onClick={handleShowInvestment}>
              Ver inversión
            </CustomButton>
          </Col>
        </Row>

        {params.store_type === "T" ? (
          <Form className="pb-2">
            <Row>
              <Col>
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
              </Col>

              <Col>
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
              </Col>

              <Col>
                <Form.Group controlId="range">
                  <Form.Label>Rango</Form.Label>
                  <Form.Control
                    name="range"
                    type="text"
                    value={range}
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col hidden={departments.length === 0}>
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
              </Col>
            </Row>
          </Form>
        ) : (
          ""
        )}

        <CustomTable
          progressPending={loading}
          data={memoStores}
          columns={params.store_type === "T" ? columnsStore : columnsStorages}
        />
        {params.store_type === "T" && stores.length > 1 && (
          <>
            <h2 className="pt-2">Totales</h2>

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
            ></CustomTable>
          </>
        )}
      </div>
    </>
  );
};

export default StoreList;
