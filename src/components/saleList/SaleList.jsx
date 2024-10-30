import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import { getClients } from "../apis/clients";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { selectClient } from "../redux/clientSelected/clientSelectedActions";
import { Form } from "react-bootstrap";
import { getDailyEarnings, getSales } from "../apis/sales";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [dailyEarnings, setDailyEarnings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSales();
      setSales(response.data);
      const response2 = await getDailyEarnings();
      console.log(response2);
      setDailyEarnings(response2.data);
    };

    fetchData();
  }, []);

  const getTimeFromDateString = function (dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0"); // Formato de 2 dígitos
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Formato de 2 dígitos
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <div className="section">
        <h1>Ganacias al dia</h1>
        Total de ventas: {dailyEarnings.total_sales_sum}
        {dailyEarnings.payments_by_method &&
          dailyEarnings.payments_by_method.map((e, index) => (
            <p key={index}>
              {e.payment_method}: {e.total_amount}
            </p>
          ))}
        {dailyEarnings.is_balance_matched && "las cuentas cuadran"}
      </div>

      <div className="section">
        <h1>Ventas del dia</h1>
        <CustomTable
          data={sales}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
              sortable: true,
            },

            {
              name: "Cliente",
              selector: (row) => row.client?.full_name,
              sortable: true,
            },

            {
              name: "Hora",
              selector: (row) => getTimeFromDateString(row.created_at),
              sortable: true,
            },

            {
              name: "Total",
              selector: (row) => "$" + row.total,
              sortable: true,
            },
          ]}
        ></CustomTable>
      </div>
    </>
  );
};

export default SaleList;
