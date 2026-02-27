import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/CustomTable";

import { getSales } from "../../api/sales";
import CustomButton from "../commons/customButton/CustomButton";
import {
  getFormattedDate,
  handlePrintTicket,
  getFormattedDateTime,
} from "../../utils/utils";
import { useDispatch } from "react-redux";
import {
  hideSaleModal,
  showSaleModal,
} from "../../redux/saleModal/SaleModalActions";
import SaleModal from "../saleModal/SaleModal";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import UndoIcon from "@mui/icons-material/Undo";
import Alert from "react-bootstrap/Alert";
import { getUserData } from "../../api/utils";
import PaymentModal2 from "../paymentModal2/PaymentModal2";
import {
  hidePaymentReservationModal,
  showPaymentReservationModal,
} from "../../redux/paymentReservationModal/PaymentReservationModalActions";
import CustomTooltip from "../commons/Tooltip";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
      {/* 1. SPINNERS */}
      <CustomSpinner isLoading={loading} />
      
      {/* 2. MODALS */}
      <PaymentModal2 onUpdateSaleList={handleUpdateSaleList} />
      <SaleModal onUpdateSaleList={handleUpdateSaleList} />
      
      {/* 3. CONTENIDO PRINCIPAL */}
      <Grid className="custom-section">
        {/* 3.1 Alerts */}
        {salesDuplicated.length > 0 && (
          <Alert key={"primary"} variant={"primary"}>
            Ids de ventas duplicadas:{" "}
            {salesDuplicated.map((id) => (
              <span key={id}>{id}, </span>
            ))}
          </Alert>
        )}

        {/* 3.2 Header */}
        <h1>Ventas</h1>

        {/* 3.3 Filtros */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={params.reservation_in_progress}
                onChange={handleDataChange}
                name="reservation_in_progress"
                label="Tipo"
              >
                {TYPE_OPTIONS.map((type_option) => (
                  <MenuItem key={type_option.value} value={type_option.value}>
                    {type_option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Busqueda por</InputLabel>
              <Select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                label="Busqueda por"
              >
                {SEARCH_BY_OPTIONS.map((search_option) => (
                  <MenuItem key={search_option.value} value={search_option.value}>
                    {search_option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {searchBy === "date" ? (
            <Grid item xs={3}>
              <TextField
                size="small"
                fullWidth
                label="Fecha"
                type="date"
                value={params.date}
                onChange={handleDataChange}
                max={today}
                name="date"
              />
            </Grid>
          ) : searchBy === "sale_id" ? (
            <Grid item xs={3}>
              <TextField
                size="small"
                fullWidth
                label="#"
                type="number"
                value={params.sale_id}
                onChange={handleDataChange}
                name="sale_id"
              />
            </Grid>
          ) : searchBy === "client" ? (
            <>
              <Grid item xs={3}>
                <TextField
                  size="small"
                  fullWidth
                  label="Nombre"
                  type="text"
                  value={params.first_name}
                  onChange={handleDataChange}
                  name="first_name"
                  placeholder="Nombre"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  size="small"
                  fullWidth
                  label="Apellidos"
                  type="text"
                  value={params.last_name}
                  onChange={handleDataChange}
                  name="last_name"
                  placeholder="Apellidos"
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={3}>
            <CustomButton onClick={() => setShowAllFields((prev) => !prev)} startIcon={<VisibilityIcon />}>
              Ver todos los campos
            </CustomButton>
          </Grid>
        </Grid>

        {/* 3.4 Tabla */}
        <CustomTable
          data={sales}
          pagination={true}
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
                    wrapText: true,
                  },
                ]
              : []),

            {
              name: "Hora",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrapText: true,
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
                        {row.is_canceled
                          ? item.returned_quantity
                          : item.quantity}{" "}
                        x {item.name} - ${item.price} - Código: {item.code}
                        <br />
                      </span>
                    ))}
                  </>
                );
              },
              wrapText: true,
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
              wrapText: true,
              grow: 1.5,
            },

            ...(showAllFields
              ? [
                  {
                    name: "Referencia",
                    selector: (row) => row.reference,
                    wrapText: true,
                    grow: 2,
                  },
                  {
                    name: "Vendedor",
                    wrapText: true,
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
                  {row.is_canceled ? (
                    <>
                      <CancelIcon color="error" /> Razón cancelacion:{" "}
                      {row.reason_cancel ? row.reason_cancel : "Desconocida"}
                    </>
                  ) : (
                    <>
                      {printer && (
                        <CustomButton
                          onClick={() => handlePrintTicket("ticket", row)}
                        >
                          <PrintIcon />
                        </CustomButton>
                      )}

                      {params.reservation_in_progress === "true" && (
                        <CustomButton
                          fullWidth
                          onClick={() => handleOpenModal2(row)}
                        >
                          <AttachMoneyIcon />
                        </CustomButton>
                      )}

                      {(row.is_cancelable || row.is_repeated) && (
                        <CustomTooltip text={"Generar devolución"}>
                          <CustomButton onClick={() => handleOpenModal(row)}>
                            <UndoIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                      {row.is_repeated && <WarningIcon color="warning" />}
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default SaleList;
