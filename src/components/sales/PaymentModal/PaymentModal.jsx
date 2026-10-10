import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Alert, useMediaQuery, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { selectCart, selectMovementType, selectClient } from "../../../redux/cart/selectors";
import { cleanCart, removeClientFromCart } from "../../../redux/cart/cartActions";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { createSale, getSale } from "../../../api/sales";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { handlePrintTicket } from "../../../utils/print";
import { roundUpCustom } from "../../../utils/currency";
import { useUser } from "../../../context/UserContext";
import { useCtrlShortcut } from "../../../hooks/useCtrlShortcut";
import { MOVEMENT_TYPES } from "../../../constants";
import PaymentSubmitPanel from "../shared/PaymentSubmitPanel";
import { usePaymentMethods } from "./usePaymentMethods";
import PaymentCard from "./PaymentCard";
import PaymentClientSection from "./PaymentClientSection";
import SaleExchangeSection from "./SaleExchangeSection";
import PaymentTotals from "./PaymentTotals";
import PaymentMethodsSection from "./PaymentMethodsSection";

const INITIAL_SALE_EXCHANGE_STATE = { refunded: 0, payment: 0 };

const PaymentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const inputPaymentRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const cart = useSelector(selectCart);
  const movementType = useSelector(selectMovementType);
  const client = useSelector(selectClient);
  const { user } = useUser();
  const printer = user?.store_printer;
  const isReservation = movementType === MOVEMENT_TYPES.RESERVATION;
  const canCharge = movementType === MOVEMENT_TYPES.SALE || isReservation;

  const [hideClient, setHideClient] = useState(true);
  const [hideExchange, setHideExchange] = useState(true);
  const [saleExchange, setSaleExchange] = useState(INITIAL_SALE_EXCHANGE_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const { total, totalDiscount } = useMemo(() => {
    const total = roundUpCustom(cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0));
    const totalDiscount = client?.discount_percentage_complement
      ? roundUpCustom(total * (client.discount_percentage_complement / 100))
      : total;
    return { total, totalDiscount };
  }, [cart, client]);

  const {
    payment,
    resetPayment,
    paymentMethods,
    referencePayment,
    setReferencePayment,
    needsReference,
    selectedMethod,
    isSubmitDisabled,
    paymentList,
    handleChangePayments,
    handlePaymentValueChange,
    handlePaidWithChange,
  } = usePaymentMethods({ totalDiscount, movementType, refunded: saleExchange.refunded, clientId: client?.id });

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = setTimeout(() => inputPaymentRef.current?.focus(), 100);
    if (isReservation) setHideClient(false);
    return () => clearTimeout(timer);
  }, [isOpen, movementType, isReservation]);

  const handleCreateSale = async (printTicket = false) => {
    if (isSubmittingRef.current) return;

    if (movementType === MOVEMENT_TYPES.SALE && (payment.paidWith === 0 || payment.change < 0)) {
      setErrorMessage("Pago debe ser igual o mayor a la cantidad a cobrar");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const data = {
        client: client?.id,
        total: totalDiscount,
        store_products: cart.map((storeProduct) => ({
          id: storeProduct.id,
          quantity: storeProduct.quantity,
          name: storeProduct.product.name,
          code: storeProduct.product.code,
          price: storeProduct.product_price * ((client?.discount_percentage_complement ?? 100) * 0.01),
        })),
        payments: paymentList,
        reference_payment: referencePayment,
        sale_exchange: saleExchange,
        reservation_in_progress: isReservation,
      };

      const response = await createSale(data);

      if (printer && printTicket) {
        handlePrintTicket("ticket", { ...data, id: response.data.id, payment });
      }

      dispatch(removeClientFromCart());
      dispatch(cleanCart());
      onClose();
      resetPayment();
      setHideClient(true);
      setSaleExchange(INITIAL_SALE_EXCHANGE_STATE);

      showSuccess(`${isReservation ? "Apartado registrado" : "Venta exitosa"}. Folio ${response.data.id}`);
    } catch (error) {
      showRequestError("finalizar la venta", error);
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSearchSaleForChange = async () => {
    setIsLoading(true);
    try {
      const response = await getSale(saleExchange.id);
      setSaleExchange({ ...response.data, payment: totalDiscount - response.data.refunded });
    } catch (error) {
      showRequestError("buscar la venta", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleClient = () => {
    // Si la sección está abierta, se cierra y se quita el cliente
    if (!hideClient) dispatch(removeClientFromCart());
    setHideClient((prev) => !prev);
  };

  // Ctrl+G cobra con las mismas validaciones que el botón; la tecla se bloquea siempre en la pantalla de venta
  useCtrlShortcut("g", () => {
    if (isOpen && canCharge && !isSubmitDisabled) handleCreateSale(!!printer);
  });

  // Ctrl+O quita el cliente solo con el cobro abierto
  useCtrlShortcut("o", () => {
    if (isOpen) dispatch(removeClientFromCart());
  });

  return (
    <>
      <CustomSpinner isLoading={isLoading} />
      <CustomModal showOut={isOpen} onClose={onClose} title={isReservation ? "Registrar apartado" : "Finalizar venta"}>
        <ModalBody>
          <Grid container>
            {isReservation && (
              <Grid item xs={12} sx={{ marginBottom: "1rem" }}>
                <Alert severity="info" variant="filled">
                  El cliente deja un abono. El resto se liquida después.
                </Alert>
              </Grid>
            )}
            {errorMessage && (
              <Grid item xs={12} sx={{ marginBottom: "1rem" }}>
                <Alert severity="error" variant="filled" onClose={() => setErrorMessage("")}>
                  {errorMessage}
                </Alert>
              </Grid>
            )}
            {!isReservation && (
              <PaymentCard>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      fullWidth
                      onClick={handleToggleClient}
                      startIcon={<PersonAddIcon />}
                      color={!hideClient ? "error" : "primary"}
                    >
                      {!hideClient ? "Quitar cliente" : "Agregar cliente"}
                    </CustomButton>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomButton fullWidth onClick={() => setHideExchange((prev) => !prev)} startIcon={<SwapHorizIcon />}>
                      Intercambio de mercancia
                    </CustomButton>
                  </Grid>
                </Grid>
              </PaymentCard>
            )}

            <PaymentClientSection hidden={isReservation ? false : hideClient} client={client} />

            <SaleExchangeSection
              hidden={hideExchange}
              saleExchange={saleExchange}
              onSaleIdChange={(id) => setSaleExchange((prev) => ({ ...prev, id }))}
              onSearch={handleSearchSaleForChange}
            />

            <PaymentTotals
              total={total}
              totalDiscount={totalDiscount}
              hasClient={Boolean(client?.id)}
              payment={payment}
              onPaidWithChange={handlePaidWithChange}
              paidWithRef={inputPaymentRef}
              needsReference={needsReference}
              referencePayment={referencePayment}
              onReferenceChange={setReferencePayment}
              isMobile={isMobile}
            />

            <PaymentMethodsSection
              paymentMethods={paymentMethods}
              selectedMethod={selectedMethod}
              isReservation={isReservation}
              isMobile={isMobile}
              onPaymentsChange={handleChangePayments}
              onAmountChange={handlePaymentValueChange}
            >
              {/* En móvil no se imprime ticket */}
              <PaymentSubmitPanel
                printer={printer}
                compact={isMobile}
                disabled={isSubmitDisabled}
                onSubmit={() => handleCreateSale(!isMobile && !!printer)}
              >
                {isReservation ? "Apartar" : "Cobrar"}<br />(Ctrl + G)
              </PaymentSubmitPanel>
            </PaymentMethodsSection>
          </Grid>
        </ModalBody>
      </CustomModal>
    </>
  );
};

export default PaymentModal;
