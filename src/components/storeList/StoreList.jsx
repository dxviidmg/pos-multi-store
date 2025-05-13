import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, Row, Col, Alert } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import { getTenantInfo } from "../apis/tenants";
import { chooseIcon, HomeIcon, PrinterIcon } from "../commons/icons/Icons";
import { getDepartments } from "../apis/departments";

const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [storages, setStorages] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [showInvestment, setShowInvestment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
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
      });
      const response2 = await getStores({ ...params, store_type: "T" });
      const response3 = await getStores({ ...params, store_type: "A" });

      console.log("a");
      setStores(response2.data);
      setStorages(response3.data);
      console.log("b");
      const {
        profit,
        paymentCash,
        paymentCard,
        paymentTransfer,
        totalPayment,
        totalSales,
        cash,
        investment,
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
      });

      const dateRange = getDateDifference(params.start_date, params.end_date);
      setRange(dateRange);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleSelectStore = async ({
    store_type,
    full_name,
    id,
    url_printer,
  }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const updatedData = JSON.stringify({
      ...user,
      store_type,
      store_name: full_name,
      store_id: id,
      store_url_printer: url_printer,
    });
    localStorage.setItem("user", updatedData);

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

    setStorages((prevData) =>
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

  const columnsStore = [
    {
      name: "Nombre",
      wrap: true,
      selector: ({ name }) => <>{name}</>,
    },
    {
      name: "Ganancia",
      style: alignTdStyles,
      selector: ({ cash_summary }) =>
        `$ ${cash_summary[8]["amount"].toLocaleString()}`,
    },

    ...(!params.department_id
      ? [
          {
            name: "Efectivo",
            style: alignTdStyles,
            selector: (row) =>
              `$${row.cash_summary?.[0]?.amount?.toLocaleString() || "0"}`,
          },
          {
            name: "Tarjeta",
            style: alignTdStyles,
            selector: (row) =>
              `$${row.cash_summary?.[1]?.amount?.toLocaleString() || "0"}`,
          },
          {
            name: "Transferencia",
            style: alignTdStyles,
            selector: (row) =>
              `$${row.cash_summary?.[2]?.amount?.toLocaleString() || "0"}`,
          },
        ]
      : []),

    ...(!params.department_id
      ? [
          {
            name: "Caja",
            style: alignTdStyles,
            selector: (row) =>
              "$" + row.cash_summary[7]["amount"].toLocaleString(),
          },
        ]
      : []),

    {
      name: "Total de ventas",
      style: alignTdStyles,
      selector: (row) => "$" + row.cash_summary[4]["amount"].toLocaleString(),
    },
    {
      name: "Número de ventas",
      style: alignTdStyles,
      selector: (row) => row.cash_summary[10]["amount"].toLocaleString(),
    },

    ...(showInvestment
      ? [
          {
            style: alignTdStyles,
            name: "Inversión",
            selector: (row) =>
              row.investment ? "$" + row.investment.toLocaleString() : "$0",
          },
        ]
      : []),

    {
      name: "Entrar",
      cell: (row) => (
        <>
          <CustomButton onClick={() => handleSelectStore(row)}>
            <HomeIcon />
          </CustomButton>
        </>
      ),
    },
    {
      name: "Opciones",
      cell: (row) => (
        <>
          {chooseIcon(row.products_count === tenantInfo.product_count)}
          {row.url_printer && <PrinterIcon />}
        </>
      ),
    },
  ];

  return (
    <>
      {tenantInfo.notices && tenantInfo.notices.length > 0 && (
        <div>
          {tenantInfo.notices.map((variant) => (
            <Alert key={"success"} variant={"success"}>
              {variant}
            </Alert>
          ))}
        </div>
      )}

      <div className="custom-section">
        <CustomSpinner2 isLoading={loading}></CustomSpinner2>

        <h1>
          Lista de tiendas y almacenes ({tenantInfo.product_count} productos
          registrados)
        </h1>

        <Form>
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
                <Form.Control name="range" type="text" value={range} disabled />
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

            <Col className="d-flex align-items-end">
              <CustomButton fullWidth onClick={handleShowInvestment}>
                Ver inversión
              </CustomButton>
            </Col>
          </Row>
        </Form>

        <h2>Tiendas</h2>

        <CustomTable
          progressPending={loading}
          data={memoStores}
          columns={columnsStore}
        />

        {storages.length > 0 && (
          <>
            <h2>Almacenes</h2>

            <CustomTable
              progressPending={loading}
              data={storages}
              columns={[
                {
                  name: "Nombre",
                  selector: (row) => `${row.name}`,
                },
                { grow: 10 },
                ...(showInvestment
                  ? [
                      {
                        name: "Inversión",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) =>
                          row.investment
                            ? "$" + row.investment.toLocaleString()
                            : "$0",
                      },
                    ]
                  : []),

                {
                  name: "Entrar",
                  cell: (row) => (
                    <>
                      <CustomButton onClick={() => handleSelectStore(row)}>
                        <HomeIcon />
                      </CustomButton>
                    </>
                  ),
                },
                {
                  name: "Opciónes",
                  cell: (row) => (
                    <>
                      {chooseIcon(
                        row.products_count === tenantInfo.product_count
                      )}
                    </>
                  ),
                },
              ]}
            />
          </>
        )}

        {stores.length + storages.length > 1 && (
          <>
            <h2>Totales</h2>

            <CustomTable
              progressPending={loading}
              data={[
                {
                  profit: "$" + totals.profit.toLocaleString(),
                  paymentCash: "$" + totals.paymentCash.toLocaleString(),
                  paymentCard: "$" + totals.paymentCard.toLocaleString(),
                  paymentTransfer:
                    "$" + totals.paymentTransfer.toLocaleString(),
                  totalPayment: "$" + totals.totalPayment.toLocaleString(),
                  cash: "$" + totals.cash.toLocaleString(),
                  investment: "$" + totals.investment.toLocaleString(),
                  totalSales: totals.totalSales.toLocaleString(),
                },
              ]}
              columns={[
                {},
                {
                  name: "Ganancia",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => `${row.profit}`,
                },

                ...(!params.department_id
                  ? [
                      {
                        name: "Efectivo",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) => `${row.paymentCash}`,
                      },

                      {
                        name: "Tarjeta",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) => `${row.paymentCard}`,
                      },

                      {
                        name: "Transferencia",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) => `${row.paymentTransfer}`,
                      },
                    ]
                  : []),

                ...(!params.department_id
                  ? [
                      {
                        name: "Caja",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) => `${row.cash}`,
                      },
                    ]
                  : []),

                {
                  name: "Total de ventas",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => `${row.totalPayment}`,
                },

                {
                  name: "Numero de ventas",
                  style: {
                    justifyContent: "flex-end", // para alinear dentro del td con flexbox
                    textAlign: "right",
                  },
                  selector: (row) => `${row.totalSales}`,
                },

                ...(showInvestment
                  ? [
                      {
                        name: "Inversión",
                        style: {
                          justifyContent: "flex-end", // para alinear dentro del td con flexbox
                          textAlign: "right",
                        },
                        selector: (row) => `${row.investment}`,
                      },
                    ]
                  : []),

                {
                  grow: 2.4,
                },
              ]}
            ></CustomTable>
          </>
        )}
      </div>
    </>
  );
};

export default StoreList;
