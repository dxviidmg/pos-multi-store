import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import {
  exportToExcel,
  formatTimeFromDate,
  getFormattedDate,
} from "../utils/utils";
import {
  getStoreProductLogs,
  getStoreProductLogsChoices,
} from "../apis/products";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";
import CustomButton from "../commons/customButton/CustomButton";
import { chooseIcon } from "../commons/icons/Icons";
import { getStores } from "../apis/stores";

const LogList = () => {
  const today = getFormattedDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [actions, setActions] = useState([]);
  const [params, setParams] = useState({ date: today });

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getStoreProductLogsChoices();
      setActions(response2.data);
      const response3 = await getStores();
      setStores(response3.data);
      setLoading(false);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getStoreProductLogs(params);
      setLogs(salesResponse.data);
      setLoading(false);
    };

    fetchSalesData();
  }, [params]);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDownload = async () => {
    const logsForReport = logs.map(
      ({
        product: { code: Código, brand_name: Marca, name: Nombre },
        description: Descripcíon,
        previous_stock,
        difference: diferencia,
        updated_stock

      }) => ({
        Código,
        Marca,
        Nombre,
        Descripcíon,
        'Stock anterior': previous_stock,
        diferencia,
        'Stock actualizado': updated_stock
      })
    );

    const prefixName = "Logs " + params.date;
    exportToExcel(logsForReport, prefixName, false);
  };

  return (
    <>
      <CustomSpinner isLoading={loading}></CustomSpinner>
      <div className="custom-section">
        <h1>Logs</h1>

        <CustomButton onClick={handleDownload} disabled={logs.length === 0}>
          Descargar logs
        </CustomButton>

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
            <Form.Label>Tiendas o almacenes</Form.Label>
            <Form.Select
              value={params.store_related}
              onChange={handleDataChange}
              name="store_related"
              //              disabled={isLoading}
            >
              <option value="">Selecciona un movimiento</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.full_name}
                </option>
              ))}
            </Form.Select>
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
          data={logs}
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
              wrap: true
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
              name: "S. nuevo",
              selector: (row) => row.updated_stock,
            },
            {
              name: "OK",
              selector: (row) => chooseIcon(row.is_consistent),
            }
          ]}
        />
      </div>
    </>
  );
};

export default LogList;
