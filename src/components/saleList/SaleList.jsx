import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getSales } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import {
  getFormattedDate,
  formatTimeFromDate,
} from "../utils/utils";
import { useDispatch } from "react-redux";
import {
  hideSaleModal,
  showSaleModal,
} from "../redux/saleModal/SaleModalActions";
import SaleModal from "../saleModal/saleModal";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);


  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getSales(date);
      setSales(salesResponse.data);

    };

    fetchSalesData();
  }, [date]);




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
      <div className="custom-section">
        <Form.Label className="fw-bold">Lista de ventas</Form.Label>
            <Form>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today}
              />
            </Form>
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
              grow: 2,
              cell: (row) =>
                (row.is_cancelable ||JSON.parse(localStorage.getItem("user")).is_owner === true) && (
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    Devolución
                  </CustomButton>
                ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default SaleList;
