import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, Row, Col, Alert } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getInvestment, getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getFormattedDate } from "../utils/utils";
import { getTenantNotices } from "../apis/tenants";

const defaultValue = "N/A";

const storesTypes = [
  { value: "A", label: "Almacen" },
  { value: "T", label: "Tienda" },
];
const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showInvestment, setShowInvestment] = useState(false);
  const [params, setParams] = useState({
    date: today,
  });

  const handleFilters = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStores(params);
      setStores(response.data);
      const response2 = await getTenantNotices();
      console.log(response2);
      setNotices(response2.data);
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
    setLoading(true)
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
    setLoading(false)
    setShowInvestment(true);
  };
  

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>

      {notices.map((variant) => (
        <Alert key={"success"} variant={"success"}>
          {variant}
        </Alert>
      ))}

      <Form.Label className="fw-bold">Lista de tiendas y almacenes</Form.Label>
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
            value={params.action}
            onChange={handleFilters}
            name="store_type"
            //              disabled={isLoading}
          >
            <option value="">Selecciona un tipo de tienda</option>
            {storesTypes.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col className="d-flex align-items-end">
          <CustomButton fullWidth onClick={handleShowInvestment}>Ver inversión</CustomButton>
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
            name: "Tipo",
            selector: (row) => row.store_type_display,
          },
          {
            name: "Ganancia del dia",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[10]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Efectivo",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[0]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Tarjeta",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[1]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Transferencia",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[2]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Total de ventas",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[4]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "$ en caja",
            selector: (row) =>
              row.store_type === "T"
                ? "$" + row.cash_summary[9]["amount"].toLocaleString()
                : defaultValue,
          },
          ...(showInvestment
            ? [
                {
                  name: "Inversión",
                  selector: (row) =>
                    row.investment
                      ? "$" + row.investment.toLocaleString()
                      : "Pendiente calcular",
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
    </div>
  );
};

export default StoreList;
