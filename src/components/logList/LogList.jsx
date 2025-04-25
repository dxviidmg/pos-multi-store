import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { formatTimeFromDate, getFormattedDate } from "../utils/utils";
import {
  getStoreProductLogs,
  getStoreProductLogsChoices,
} from "../apis/products";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";

const LogList = () => {
  const today = getFormattedDate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [actions, setActions] = useState([]);
  const [params, setParams] = useState({ date: today });

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getStoreProductLogsChoices();
      setActions(response2.data);
      setLoading(false);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getStoreProductLogs(params);
      setSales(salesResponse.data);
      setLoading(false);
    };

    fetchSalesData();
  }, [params]);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <div className="custom-section">
        <h1>Logs</h1>

        <Row>
          <Col>
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={params.date}
              onChange={handleDataChange}
              max={today}
              name="date"
            />
          </Col>

          <Col>
            <Form.Label>Marca</Form.Label>
            <Form.Select
              value={params.brand_id}
              onChange={handleDataChange}
              name="brand_id"
              //              disabled={isLoading}
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col>
            <Form.Label>Movimientos</Form.Label>
            <Form.Select
              value={params.action}
              onChange={handleDataChange}
              name="action"
              //              disabled={isLoading}
            >
              <option value="">Selecciona un movimiento</option>
              {actions.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <CustomTable
          data={sales}
          loading={loading}
          columns={[
            {
              name: "Código",
              selector: (row) => row.product.code,
              grow: 2,
            },
            {
              name: "Marca",
              selector: (row) => row.product.brand_name,
            },

            {
              name: "Nombre",
              selector: (row) => row.product.name,
              wrap: true,
              grow: 2,
            },

            {
              name: "Descripción",
              selector: (row) => row.description,
              grow: 2,
            },

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },

            {
              name: "S. anterior",
              selector: (row) => row.previous_stock,
            },
            {
              name: "Diferencia",
              selector: (row) => row.difference,
            },
            {
              name: "S. actualizado",
              selector: (row) => row.updated_stock,
            },

            {
              name: "Venta",
              selector: (row) => row.sale,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LogList;
