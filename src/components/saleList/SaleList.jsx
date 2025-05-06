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
import { PrinterIcon, ReturnIcon, WarningIcon } from "../commons/icons/Icons";
import Alert from "react-bootstrap/Alert";
import { getUserData } from "../apis/utils";
import { hidePaymentModal, showPaymentModal } from "../redux/paymentModal/PaymentModalActions";
import PaymentModal from "../paymentModal/PaymentModal";


const TYPE_OPTIONS = [
  {
    value: false,
    label: "Ventas",
  },
  {
    value: true,
    label: "Apartados",
  },
];


const SaleList = () => {
  const user = getUserData();
  const urlPrinter = user.store_url_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [params, setParams] = useState({ date: today, is_canceled: 0, reservation_in_progress: false });
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

  const handleOpenModal2 = () => {
    dispatch(hidePaymentModal());
    setTimeout(() => dispatch(showPaymentModal()), 1);
  };


  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <PaymentModal/>
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
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={params.reservation_in_progress}
              onChange={handleDataChange}
              name="reservation_in_progress"
              //              disabled={isLoading}
            >
              {TYPE_OPTIONS.map((type_option) => (
                <option key={type_option.value} value={type_option.value}>
                  {type_option.label}
                </option>
              ))}
            </Form.Select>
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

            ...(params.reservation_in_progress === 'true'
              ? [
                  {
                    name: "Pagado",
                    selector: (row) => "$"+row.paid,
                  },
                  {
                    name: "Falta",
                    selector: (row) => "$"+(row.total - row.paid),
                  },
                ]
              : []),

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
              grow: showAllFields ? 3 : 2,
              cell: (row) => (
                <>
                  {urlPrinter && (
                    <CustomButton onClick={() => handlePrintTicket(row)}>
                      <PrinterIcon color="white" size="16"/>
                    </CustomButton>
                  )}

                  <CustomButton fullWidth onClick={handleOpenModal2}>
                    Pagar (En desarrollo)
                  </CustomButton>

                  {((row.is_cancelable) ||
                    row.is_duplicate) && (
                    <CustomButton onClick={() => handleOpenModal(row)}>
                      <ReturnIcon></ReturnIcon>
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
