import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getSales } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import {
  getFormattedDate,
  formatTimeFromDate,
  handlePrintTicket,
} from "../utils/utils";
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
  const [params, setParams] = useState({ date: today, is_canceled: 0 });
  const [loading, setLoading] = useState(false);
  const [salesDuplicated, setSalesDuplicated] = useState([]);
  const [showAllFields, setShowAllFields] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSales(params);
      setSales(salesResponse.data);

      salesResponse.data.forEach((sale) => {
        if (sale.is_duplicate) {
          setSalesDuplicated((prev) => [...prev, sale.id]);
        }
      });
      setLoading(false);
    };

    fetchSalesData();
  }, [params]);

  const handleDataChange = (e) => {
    var { name, value } = e.target;
    console.log("*", name, value);

    setParams((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

        <h1>Ventas</h1>
        <Row>
          <Col>
            <Form>
              <Form.Label>#</Form.Label>
              <Form.Control
                type="number"
                value={params.sale_id}
                onChange={(e) => handleDataChange(e)}
                name="sale_id"
              />
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={params.date}
                onChange={(e) => handleDataChange(e)}
                max={today}
                name="date"
              />
            </Form>
          </Col>
          <Col className="d-flex flex-column justify-content-end">
            <CustomButton onClick={() => setShowAllFields((prev) => !prev)}>
              Ver todos los campos
            </CustomButton>
          </Col>
        </Row>
        <CustomTable
          data={sales}
          pagination={false}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },

            ...(showAllFields
              ? [
                  {
                    name: "Cliente",
                    selector: (row) => row.client?.full_name,
                    grow: 1.5,
                  },
                ]
              : []),

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            {
              name: "Productos",
              selector: (row) => (
                <>
                  {/* Map over the array and render each item */}
                  {row.products_sale
                    .filter((item) => item.quantity !== 0)
                    .map((item, index) => (
                      <span key={index}>
                        <b>{item.quantity}</b> x {item.name} a ${item.price}
                        <br />{" "}
                      </span>
                    ))}
                </>
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
              grow: 1.5,
            },

            ...(showAllFields
              ? [
                  {
                    name: "Referencia",
                    selector: (row) => row.reference,
                    wrap: true,
                    grow: 2,
                  },
                ]
              : []),
            {
              name: "Vendedor",
              wrap: true,
              grow: 1.5,
              selector: (row) => row.seller_username,
            },

            {
              name: "Acciones",
              grow: showAllFields ? 6.1 : 3.2,
              cell: (row) => (
                <>
                  {urlPrinter && (
                    <CustomButton onClick={() => handlePrintTicket(row)}>
                      Imprimir ticket
                    </CustomButton>
                  )}
                  {((row.is_cancelable && user.role === "owner") ||
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
