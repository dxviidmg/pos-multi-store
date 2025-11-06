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
  CheckIcon,
  EditIcon,
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
import { getDistributions } from "../apis/transfers";
import { hideDistributionModal, showDistributionModal } from "../redux/distributionModal/DistributionModalActions";
import DistributionModal from "../distributionModal/DistributionModal";

const DistributionList = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      const distributions = await getDistributions();

      console.log(distributions.data);

      setDistributions(distributions.data);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  const handleOpenModal = (distribution) => {
    console.log('effe')
    dispatch(hideDistributionModal());
    setTimeout(() => dispatch(showDistributionModal(distribution)));
  };

  const handleUpdateSaleList = (updatedSale) => {
    setDistributions((prevSales) => {
      const saleExists = prevSales.some((b) => b.id === updatedSale.id);
      return saleExists
        ? prevSales.map((b) => (b.id === updatedSale.id ? updatedSale : b))
        : [...prevSales, updatedSale];
    });
  };


  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <DistributionModal onUpdateSaleList={handleUpdateSaleList}></DistributionModal>
      <div className="custom-section">
        <h1>Distribuciones</h1>
        <CustomTable
          data={distributions}
          pagination={false}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Creacion",
              selector: (row) => getFormattedDateTime(row.created_at),
              wrap: true,
            },
            {
              name: "Descripción",
              grow: 2,
              selector: (row) => row.description,
            },

            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Ver productos"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <CheckIcon></CheckIcon>
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default DistributionList;
