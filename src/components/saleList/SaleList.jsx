import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getSales } from "../apis/sales";
import CustomButton from "../commons/customButton/CustomButton";
import {
  getFormattedDate,
  handlePrintTicket,
  getFormattedDateTime,
} from "../utils/utils";
import { useDispatch } from "react-redux";
import {
  hideSaleModal,
  showSaleModal,
} from "../redux/saleModal/SaleModalActions";
import SaleModal from "../saleModal/saleModal";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import {
  CashIcon,
  ErrorIcon,
  PrinterIcon,
  ReturnIcon,
  WarningIcon,
} from "../commons/icons/Icons";
import Alert from "react-bootstrap/Alert";
import { getUserData } from "../apis/utils";
import PaymentModal2 from "../paymentModal2/PaymentModal2";
import {
  hidePaymentReservationModal,
  showPaymentReservationModal,
} from "../redux/paymentReservationModal/PaymentReservationModalActions";
import CustomTooltip from "../commons/Tooltip";

const TYPE_OPTIONS = [
  {
    value: false,
    label: "Ventas",
  },
//  {
//    value: true,
//    label: "Apartados",
//  },
];

const SEARCH_BY_OPTIONS = [
  {
    value: "date",
    label: "Fecha",
  },
  {
    value: "sale_id",
    label: "Id",
  },
  {
    value: "client",
    label: "Cliente",
  },
];

const SaleList = () => {
  const user = getUserData();
  const printer = user.store_printer;
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [params, setParams] = useState({
    date: today,
    reservation_in_progress: false,
  });
  const [loading, setLoading] = useState(false);
  const [salesDuplicated, setSalesDuplicated] = useState([]);
  const [showAllFields, setShowAllFields] = useState(false);
  const [searchBy, setSearchBy] = useState("date");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      const salesResponse = await getSales(params);

      setSales(salesResponse.data);

      salesResponse.data.forEach((sale) => {
        if (sale.is_repeated) {
          setSalesDuplicated((prev) => [...prev, sale.id]);
        }
      });
      setLoading(false);
    };

    fetchSalesData();
  }, [params]);

  const handleDataChange = (e) => {
    var { name, value } = e.target;

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
      setSales((prevSales) => {
        const saleExists = prevSales.some((b) => b.id === updatedSale.id);
        return saleExists
          ? prevSales.map((b) => (b.id === updatedSale.id ? updatedSale : b))
          : [...prevSales, updatedSale];
      });
  };

  const handleOpenModal2 = (row) => {
    dispatch(hidePaymentReservationModal());
    setTimeout(() => dispatch(showPaymentReservationModal(row)), 1);
  };

  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <PaymentModal2 onUpdateSaleList={handleUpdateSaleList} />
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
            <Form.Label>Busqueda por</Form.Label>
            <Form.Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}

              //              disabled={isLoading}
            >
              {SEARCH_BY_OPTIONS.map((search_option) => (
                <option key={search_option.value} value={search_option.value}>
                  {search_option.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {searchBy === "date" ? (
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
          ) : searchBy === "sale_id" ? (
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
          ) : searchBy === "client" ? (
            <>
              <Col>
                <Form>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.first_name}
                    onChange={(e) => handleDataChange(e)}
                    name="first_name"
                    placeholder="Nombre"
                  />
                </Form>
              </Col>
              <Col>
                <Form>
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.last_name}
                    onChange={(e) => handleDataChange(e)}
                    name="last_name"
                    placeholder="Apellidos"
                  />
                </Form>
              </Col>
            </>
          ) : null}

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
                    wrap: true
                  },
                ]
              : []),

            {
              name: "Hora",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrap: true,
            },


            {
              name: "Productos",
              selector: (row) => {
                const productsToShow = row.is_canceled
                  ? row.products_sale.filter((item) => item.quantity === 0)
                  : row.products_sale.filter((item) => item.quantity !== 0);
            
                return (
                  <>
                    {productsToShow.map((item, index) => (
                      <span key={index}>
                        
                        {row.is_canceled ? item.returned_quantity : item.quantity} x {item.name} - ${item.price} - Código: {item.code}
                        <br />
                      </span>
                    ))}
                  </>
                );
              },
              wrap: true,
              grow: 3,
            },
            

            {
              name: "Total",
              selector: (row) => `$${row.total}`,
            },

            ...(params.reservation_in_progress === "true"
              ? [
                  {
                    name: "Pagado",
                    selector: (row) => "$" + row.paid,
                  },
                  {
                    name: "Falta",
                    selector: (row) => "$" + (row.total - row.paid),
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
                  {
                    name: "Vendedor",
                    wrap: true,
                    grow: 1.5,
                    selector: (row) => row.seller_username,
                  },
                ]
              : []),

            {
              name: "Acciones",
              grow: showAllFields ? 3 : 2,
              cell: (row) => (
                <>
                {row.is_canceled ? <>
                  <ErrorIcon/> Razón cancelacion: {row.reason_cancel ? row.reason_cancel: 'Desconocida'} 
                </> : <>
                
                  {printer && (
                    <CustomButton
                      onClick={() => handlePrintTicket("ticket", row)}
                    >
                      <PrinterIcon color="white" size="16" />
                    </CustomButton>
                  )}

                  {params.reservation_in_progress === "true" && (
                    <CustomButton
                      fullWidth
                      onClick={() => handleOpenModal2(row)}
                    >
                      <CashIcon />
                    </CustomButton>
                  )}

                  {(row.is_cancelable || row.is_repeated) && (
                    <CustomTooltip text={"Generar devolución"}>
                      <CustomButton onClick={() => handleOpenModal(row)}>
                        <ReturnIcon></ReturnIcon>
                      </CustomButton>
                    </CustomTooltip>
                  )}
                  {row.is_repeated && <WarningIcon></WarningIcon>}

                </>}

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
