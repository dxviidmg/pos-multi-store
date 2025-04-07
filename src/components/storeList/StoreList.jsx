import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, Row, Col, Alert } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import { getTenantInfo } from "../apis/tenants";
import { chooseIcon, PrinterIcon } from "../commons/icons/Icons";
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
    cash: 0,
    investment: 0,
  });

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const response = await getDepartments();
      setDepartments(response.data);
      setLoading(false);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getTenantInfo();
      console.log(response);
      setTenantInfo(response.data);

      setTotals({
        profit: "Calculando...",
        paymentCash: "Calculando...",
        paymentCard: "Calculando...",
        paymentTransfer: "Calculando...",
        totalPayment: "Calculando...",
        cash: "Calculando...",
      });
      const response2 = await getStores({ ...params, store_type: "T" });
      const response3 = await getStores({ ...params, store_type: "A" });
      setStores(response2.data);
      setStorages(response3.data);

      const {
        profit,
        paymentCash,
        paymentCard,
        paymentTransfer,
        totalPayment,
        cash,
      } = response2.data.reduce(
        (acc, store) => ({
          profit: acc.profit + store.cash_summary[10].amount,
          paymentCash: acc.paymentCash + store.cash_summary[0].amount,
          paymentCard: acc.paymentCard + store.cash_summary[1].amount,
          paymentTransfer: acc.paymentTransfer + store.cash_summary[2].amount,
          totalPayment: acc.totalPayment + store.cash_summary[4].amount,
          cash: acc.paymentCash + store.cash_summary[9].amount,
        }),
        {
          profit: 0,
          paymentCash: 0,
          paymentCard: 0,
          paymentTransfer: 0,
          totalPayment: 0,
          cash: 0,
        }
      );
      setTotals({
        profit,
        paymentCash,
        paymentCard,
        paymentTransfer,
        totalPayment,
        cash,
      });

      const dateRange = getDateDifference(params.start_date, params.end_date);
      setRange(dateRange);
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleSelectStore = async (row) => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.store_type = row.store_type;
    user.store_name = row.full_name;
    user.store_id = row.id;
    user.store_url_printer = row.url_printer;

    const updatedData = JSON.stringify(user);
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

        <Form.Label className="fw-bold">
          Lista de tiendas y almacenes ({tenantInfo.product_count} productos
          registrados)
        </Form.Label>
        <Row>
          <Col>
            {" "}
            <Form>
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                name="start_date"
                type="date"
                value={params.start_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>
          </Col>
          <Col>
            {" "}
            <Form>
              <Form.Label>Fecha de fin</Form.Label>
              <Form.Control
                name="end_date"
                type="date"
                value={params.end_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Label>Rango</Form.Label>
              <Form.Control name="range" type="input" value={range} disabled />
            </Form>
          </Col>

          <Col hidden={departments.length === 0}>
            <Form.Label>Departamento</Form.Label>
            <Form.Select
              value={params.department_id}
              onChange={(e) => handleParams(e)}
              name="department_id"
              //              disabled={isLoading}
            >
              <option value="">Todos</option>
              <option value="0">Sin departamento</option>
              {departments.map((departament) => (
                <option key={departament.id} value={departament.id}>
                  {departament.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col className="d-flex align-items-end">
            <CustomButton fullWidth onClick={handleShowInvestment}>
              Ver inversión
            </CustomButton>
          </Col>
        </Row>

        <Form.Label className="fw-bold">Tiendas</Form.Label>

        <CustomTable
          progressPending={loading}
          data={stores}
          columns={[
            {
              name: "Nombre",
              wrap: true,
              selector: (row) => <>{row.name}</>,
            },
            {
              name: "Ganancia",
              selector: (row) =>
                "$" + row.cash_summary[10]["amount"].toLocaleString(),
            },

            ...(!params.brand_id
              ? [
                  {
                    name: "Efectivo",
                    selector: (row) =>
                      `$${
                        row.cash_summary?.[0]?.amount?.toLocaleString() || "0"
                      }`,
                  },
                  {
                    name: "Tarjeta",
                    selector: (row) =>
                      `$${
                        row.cash_summary?.[1]?.amount?.toLocaleString() || "0"
                      }`,
                  },
                  {
                    name: "Transferencia",
                    selector: (row) =>
                      `$${
                        row.cash_summary?.[2]?.amount?.toLocaleString() || "0"
                      }`,
                  },
                ]
              : []),

            ...(!params.brand_id
              ? [
                  {
                    name: "Caja",
                    selector: (row) =>
                      "$" + row.cash_summary[9]["amount"].toLocaleString(),
                  },
                ]
              : []),

            {
              name: "Total de ventas",
              selector: (row) =>
                "$" + row.cash_summary[4]["amount"].toLocaleString(),
            },
            {
              name: "Número de ventas",
              selector: (row) =>
                row.cash_summary[12]["amount"].toLocaleString(),
            },

            ...(showInvestment
              ? [
                  {
                    name: "Inversión",
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
                    Entrar
                  </CustomButton>
                </>
              ),
            },
            {
              name: "Configuraciones",
              cell: (row) => (
                <>
                  {chooseIcon(row.products_count === tenantInfo.product_count)}
                  {row.url_printer && <PrinterIcon />}
                </>
              ),
            },
          ]}
        />

        {storages.length > 0 && (
          <>
            <Form.Label className="fw-bold">Almacenes</Form.Label>

            <CustomTable
              progressPending={loading}
              data={storages}
              columns={[
                {
                  name: "Nombre",
                  selector: (row) => `${row.name}`,
                },
                ...(showInvestment
                  ? [
                      {
                        name: "Inversión",
                        selector: (row) =>
                          row.investment
                            ? "$" + row.investment.toLocaleString()
                            : "$0",
                      },
                    ]
                  : []),
                {
                  name: "Acciones",
                  cell: (row) => (
                    <>
                      <CustomButton onClick={() => handleSelectStore(row)}>
                        Entrar
                      </CustomButton>
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

        {stores.length + storages.length > 1 && (<>
        
          <Form.Label className="fw-bold mt-3">Totales</Form.Label>

<CustomTable
  progressPending={loading}
  data={[
    {
      profit: "$" + totals.profit,
      paymentCash: "$" + totals.paymentCash,
      paymentCard: "$" + totals.paymentCard,
      paymentTransfer: "$" + totals.paymentTransfer,
      totalPayment: "$" + totals.totalPayment,
      cash: "$" + totals.cash,
      investment: "$" + totals.investment,
    },
  ]}
  columns={[
    {
      name: "Ganancia",
      selector: (row) => `${row.profit.toLocaleString()}`,
    },

    ...(!params.brand_id
      ? [
          {
            name: "Efectivo",
            selector: (row) => `${row.paymentCash.toLocaleString()}`,
          },

          {
            name: "Tarjeta",
            selector: (row) => `${row.paymentCard.toLocaleString()}`,
          },

          {
            name: "Transferencia",
            selector: (row) =>
              `${row.paymentTransfer.toLocaleString()}`,
          },
        ]
      : []),

    {
      name: "Total de ventas",
      selector: (row) => `${row.totalPayment.toLocaleString()}`,
    },
    ...(!params.brand_id
      ? [
          {
            name: "Caja",
            selector: (row) => `${row.cash.toLocaleString()}`,
          },
        ]
      : []),

    ...(showInvestment
      ? [
          {
            name: "Inversión",
            selector: (row) => `${row.investment.toLocaleString()}`,
          },
        ]
      : []),
  ]}
></CustomTable>
        </>)}

      </div>
    </>
  );
};

export default StoreList;
