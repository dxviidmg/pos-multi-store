import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getDailyEarnings, getSales } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import { getUserData } from "../apis/utils";
import { exportToExcel, getFormattedDate } from "../utils/utils";
import { useDispatch } from "react-redux";
import {
  hideSaleModal,
  showSaleModal,
} from "../redux/saleModal/SaleModalActions";
import SaleModal from "../saleModal/saleModal";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [dailyEarningsSummary, setDailyEarningsSummary] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getSales(date);
      setSales(salesResponse.data);

      const earningsResponse = await getDailyEarnings(date);
      console.log(earningsResponse.data);
      setDailyEarningsSummary(earningsResponse.data);
    };

    fetchSalesData();
  }, [date]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const earningsResponse = await getDailyEarnings(date);
      console.log(earningsResponse.data);
      setDailyEarningsSummary(earningsResponse.data);
    };

    fetchSalesData();
  }, [date, sales]);

  const formatTimeFromDate = (dateString) => {
    let date = "";
    if (dateString) {
      date = new Date(dateString);
    } else {
      date = new Date();
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleExport = () => {
    // Definir valores iniciales
    const isPartial = date === today;
    const dateFile = `${date}${isPartial ? " " + formatTimeFromDate() : ""}`;
    const type = isPartial ? "parcial " : "total ";

    // Generar el prefijo del nombre del archivo
    const prefixName = `Corte de caja ${type}${
      getUserData().store_name
    } ${dateFile}`;

    // Exportar a Excel
    exportToExcel(dailyEarningsSummary, prefixName, false);
  };

  const handleOpenModal = (sale) => {
    dispatch(hideSaleModal());
    setTimeout(() => dispatch(showSaleModal(sale)));
  };

  const handleUpdateSaleList = (updatedSale) => {
    if ("delete" in updatedSale) {
      setSales((prevSales) => {
        const updatedList = prevSales.filter(
          (item) => item.id !== updatedSale.id
        );
        return updatedList;
      });
    } else {
      setSales((prevSales) => {
        const saleExists = prevSales.some((b) => b.id === updatedSale.id);
        return saleExists
          ? prevSales.map((b) => (b.id === updatedSale.id ? updatedSale : b))
          : [...prevSales, updatedSale];
      });
    }
  };

  return (
    <>
      <SaleModal onUpdateSaleList={handleUpdateSaleList}></SaleModal>
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
          <CustomButton onClick={handleExport}>
            Descargar corte del dia
          </CustomButton>
        </Col>
      </Row>

      <Row className="section">
        <Form.Label className="fw-bold">Lista de ventas</Form.Label>

        <CustomTable
          data={sales}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },

            {
              name: "Cliente",
              selector: (row) => row.client?.full_name,
              grow: 2,
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
                  {row.products_sale.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.description} a ${item.price}{" "}
                    </li>
                  ))}
                </ul>
              ),
              wrap: true,
              grow: 3,
            },
            {
              name: "Total",
              selector: (row) => `$${row.total}`,
            },
            {
              name: "Metodos de pago",
              selector: (row) => row.payments_methods.join(", "),
            },

            {
              name: "Vendedor",
              selector: (row) => row.saler_username,
            },
            {
              name: "Accciones",
              cell: (row) =>
                row.is_cancelable && (
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    Devolución
                  </CustomButton>
                ),
            },
          ]}
        />
      </Row>
    </>
  );
};

export default SaleList;
