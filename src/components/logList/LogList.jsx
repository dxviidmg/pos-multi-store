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
import { getStoreProductLogs } from "../apis/products";

const LogList = () => {
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();
  const [date, setDate] = useState(today);


  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getStoreProductLogs();
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
        <Form.Label className="fw-bold">Lista de logs</Form.Label>
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
              name: "Marca",
              selector: (row) => row.product_brand,
            },

            {
              name: "Nombre",
              selector: (row) => row.product_name,
            },



            {
              name: "Descripción",
              selector: (row) => row.description,
            },

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },

            {
              name: "Stock anterior",
              selector: (row) => row.previous_stock,
            },
            {
              name: "Stock actualizado",
              selector: (row) => row.updated_stock,
            },
            {
              name: "Diferencia de stock",
              selector: (row) => row.difference,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LogList;
