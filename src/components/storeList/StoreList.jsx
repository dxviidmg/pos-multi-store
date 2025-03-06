import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { getStores } from "../apis/stores";
import { useNavigate } from "react-router-dom";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getFormattedDate } from "../utils/utils";


const defaultValue = "Sin calcular"
const StoreList = () => {
  const navigate = useNavigate();
  const today = getFormattedDate();

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);

  const [params, setParams] = useState({
    date: today,
  });


  const handleFilters = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getStores(params);
      setStores(response.data);
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

  return (
    <div className="custom-section">
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <Form.Label className="fw-bold">Lista de tiendas</Form.Label>
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
              row.cash_summary && row.cash_summary[10]
                ? "$" + row.cash_summary[10]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Efectivo",
            selector: (row) =>
              row.cash_summary && row.cash_summary[0]
                ? "$" + row.cash_summary[0]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Tarjeta",
            selector: (row) =>
              row.cash_summary && row.cash_summary[1]
                ? "$" + row.cash_summary[1]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Transferencia",
            selector: (row) =>
              row.cash_summary && row.cash_summary[2]
                ? "$" + row.cash_summary[2]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "Total de ventas",
            selector: (row) =>
              row.cash_summary && row.cash_summary[4]
                ? "$" + row.cash_summary[4]["amount"].toLocaleString()
                : defaultValue,
          },
          {
            name: "$ en caja",
            selector: (row) =>
              row.cash_summary && row.cash_summary[9]
                ? "$" + row.cash_summary[9]["amount"].toLocaleString()
                : defaultValue,
          },
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
