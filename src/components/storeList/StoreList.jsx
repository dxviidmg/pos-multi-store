import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, Row, Col, Alert } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getFormattedDate } from "../utils/utils";
import { getTenantInfo } from "../apis/tenants";

const storesTypes = [
  { value: "A", label: "Almacen" },
  { value: "T", label: "Tienda" },
];
const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [showInvestment, setShowInvestment] = useState(false);
  const [params, setParams] = useState({
    date: today,
    store_type: "T",
  });

  const [totals, setTotals] = useState({
    Ganancia: 0,
    Efectivo: 0,
    Tarjeta: 0,
    Transferencia: 0,
    "Total de ventas": 0,
    Caja: 0,
  });

  const handleFilters = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getTenantInfo();
      console.log(response);
      setTenantInfo(response.data);

      const response2 = await getStores(params);
      setStores(response2.data);

      const { ganancia, efectivo, tarjeta, transferencia, totalVentas, caja } =
        response2.data.reduce(
          (acc, store) => ({
            ganancia: acc.ganancia + store.cash_summary[10].amount,
            efectivo: acc.efectivo + store.cash_summary[0].amount,
            tarjeta: acc.tarjeta + store.cash_summary[1].amount,
            transferencia: acc.transferencia + store.cash_summary[2].amount,
            totalVentas: acc.totalVentas + store.cash_summary[4].amount,
            caja: acc.efectivo + store.cash_summary[9].amount,
          }),
          {
            ganancia: 0,
            efectivo: 0,
            tarjeta: 0,
            transferencia: 0,
            totalVentas: 0,
            caja: 0,
          }
        );

      setTotals({
        Ganancia: ganancia,
        Efectivo: efectivo,
        Tarjeta: tarjeta,
        Transferencia: transferencia,
        "Total de ventas": totalVentas,
        Caja: caja,
      });

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
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                name="date"
                type="date"
                value={params.date}
                onChange={(e) => handleFilters(e)}
                max={today}
              />
            </Form>
          </Col>

          <Col>
            <Form.Label>Tipo de tienda</Form.Label>
            <Form.Select
              value={params.store_type}
              onChange={handleFilters}
              name="store_type"
              //              disabled={isLoading}
            >
              <option value="">Selecciona todos los tipos</option>
              {storesTypes.map((store_type) => (
                <option key={store_type.value} value={store_type.value}>
                  {store_type.label}
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

        <CustomTable
          progressPending={loading}
          data={stores}
          columns={[
            {
              name: "Nombre",
              selector: (row) => row.name,
            },
            {
              name: "Productos registrados",
              selector: (row) => row.products_count,
            },
            ...(params.store_type === "T"
              ? [
                  {
                    name: "Ganancia del dia",
                    selector: (row) =>
                      "$" + row.cash_summary[10]["amount"].toLocaleString(),
                  },
                  {
                    name: "Efectivo",
                    selector: (row) =>
                      row.cash_summary[0]["amount"].toLocaleString(),
                  },
                  {
                    name: "Tarjeta",
                    selector: (row) =>
                      "$" + row.cash_summary[1]["amount"].toLocaleString(),
                  },
                  {
                    name: "Transferencia",
                    selector: (row) =>
                      "$" + row.cash_summary[2]["amount"].toLocaleString(),
                  },
                  {
                    name: "Total de ventas",
                    selector: (row) =>
                      "$" + row.cash_summary[4]["amount"].toLocaleString(),
                  },
                  {
                    name: "$ en caja",
                    selector: (row) =>
                      "$" + row.cash_summary[9]["amount"].toLocaleString(),
                  },
                ]
              : []),

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
              name: "Accciones",
              cell: (row) => (
                <>
                  <CustomButton onClick={() => handleSelectStore(row)}>
                    Entrar
                  </CustomButton>
                </>
              ),
            },
          ]}
        />
        <Form.Label className="fw-bold mt-3">Totales</Form.Label>
        <Row>
          {Object.entries(totals).map(([key, value]) => (
            <Col>
              <p className="text-center" key={key}>
                <strong>{key}:</strong> ${value}
              </p>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default StoreList;
