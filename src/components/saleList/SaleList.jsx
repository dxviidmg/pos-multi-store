import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getSales } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import { getFormattedDate, formatTimeFromDate, handlePrintTicket } from "../utils/utils";
import { useDispatch } from "react-redux";
import {
  hideSaleModal,
  showSaleModal,
} from "../redux/saleModal/SaleModalActions";
import SaleModal from "../saleModal/saleModal";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { WarningIcon } from "../commons/icons/Icons";
import Alert from "react-bootstrap/Alert";
import { getUserData } from "../apis/utils";


const SaleList = () => {
  const user = getUserData();
  const urlPrinter = user.store_url_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [salesDuplicated, setSalesDuplicated] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSales(date);
      setSales(salesResponse.data);

      salesResponse.data.forEach((sale) => {
        if (sale.is_duplicate) {
          setSalesDuplicated((prev) => [...prev, sale.id]);
        }
      });
      setLoading(false);
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
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <SaleModal onUpdateSaleList={handleUpdateSaleList}></SaleModal>
      <div className="custom-section">
        {salesDuplicated.length > 0 && (
          <Alert key={"primary"} variant={"primary"}>
            Ids de ventas duplicadas:{" "}
            {salesDuplicated.map((id) => (
              <span key={id}>{id}, </span>
            ))}
          </Alert>
        )}

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
          pagination={false}
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
                      {item.quantity} x {item.name} a ${item.price}{" "}
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
              wrap: true,
              grow: 2
            },

            {
              name: "Referencia",
              selector: (row) => row.reference,
              wrap: true,
              grow: 2
            },
            {
              name: "Vendedor",
              wrap: true,
              selector: (row) => row.seller_username,
            },
            {
              name: "Accciones",
              grow: 5,
              cell: (row) => (
                <>
                  {(
                    urlPrinter) && (
                    <CustomButton onClick={() => handlePrintTicket(row)}>
                      Imprimir ticket
                    </CustomButton>
                  )}
                  {(row.is_cancelable ||
                    user.is_owner ===
                      true ||
                    row.is_duplicate) && (
                    <CustomButton onClick={() => handleOpenModal(row)}>
                      Devolución
                    </CustomButton>
                  )}
                  {row.is_duplicate && <WarningIcon></WarningIcon>}
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default SaleList;
