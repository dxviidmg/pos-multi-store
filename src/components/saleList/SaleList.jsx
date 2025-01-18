import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Container, Form, Row } from "react-bootstrap";
import { getDailyEarnings, getSales } from "../apis/sales";
import DataTable from "react-data-table-component";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import { exportToExcel } from "../utils/utils";

const getToday = () =>
{
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD
}
const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [dailyEarningsSummary, setDailyEarningsSummary] = useState([]);
  const today = getToday()
  const [date, setDate] = useState(today);


  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getSales(date);
      setSalesList(salesResponse.data);

      const earningsResponse = await getDailyEarnings(date);
      console.log(earningsResponse.data);
      setDailyEarningsSummary(earningsResponse.data);
    };

    fetchSalesData();
  }, [date]);

  const formatTimeFromDate = (dateString) => {
    let date = ''
    if (dateString){
      date = new Date(dateString);
    }else{
      date = new Date();
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };


  const handleExport = () => {
    // Definir valores iniciales
    const isPartial = date === today;
    const dateFile = `${date}${isPartial ? ' ' + formatTimeFromDate() : ''}`;
    const type = isPartial ? 'parcial ' : 'total ';
    
    // Generar el prefijo del nombre del archivo
    const prefixName = `Corte de caja ${type}${getUserData().store_name} ${dateFile}`;
    
    // Exportar a Excel
    exportToExcel(dailyEarningsSummary, prefixName, false);
  };
  

  return (
    <>
      <Row className="section">
        <Col md={3}>
        <Form.Label className="fw-bold">Resumen de ventas</Form.Label>
          <Form>
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
/>
          </Form>
        </Col>

        <Col md={3}>
          <CustomTable
            data={dailyEarningsSummary}
            columns={[
              {
                name: "Metodo de pago",
                selector: (row) => row.payment_method,
              },

              {
                name: "Cantidad",
                selector: (row) => row.total_amount,
              },
            ]}
          />
        </Col>



        <Col md={4}>
            <CustomButton onClick={handleExport}>Descargar corte del dia</CustomButton>
        </Col>
      </Row>

      <Row className="section">
        <Form.Label className="fw-bold">Lista de ventas</Form.Label>

        <CustomTable
          data={salesList}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },

            {
              name: "Cliente",
              selector: (row) => row.client?.full_name,
            },

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            {
              name: "Productos",
              selector: (row) => (
                <ul>
                  {/* Map over the array and render each item */}
                  {row.products.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.description} a ${item.price}{" "}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              name: "Total",
              selector: (row) => `$${row.total}`,
            },
          ]}
        />
      </Row>
    </>
  );
};

export default SaleList;
