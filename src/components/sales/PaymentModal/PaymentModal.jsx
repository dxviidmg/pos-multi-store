import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Alert, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { selectCart, selectMovementType, selectClient } from "../../../redux/cart/selectors";
import { cleanCart, removeClientFromCart } from "../../../redux/cart/cartActions";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { createSale, getSale } from "../../../api/sales";
import { showAlert, showRequestError } from "../../../utils/alerts";
import { PRINT_STATUS, getPrintStatusText, printTicketQuietly } from "../../../utils/print";
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

const SALE_ALERT_MS = 2000;
const SALE_ALERT_ERROR_MS = 5000;

const INITIAL_SALE_EXCHANGE_STATE = { refunded: 0, payment: 0 };

// Las secciones del cobro van planas, separadas por una línea, dentro del cuadro
const INLINE_SECTION_SX = {
  border: 0,
  borderRadius: 0,
  boxShadow: "none",
  bgcolor: "transparent",
  padding: "12px 0 !important",
  marginBottom: "0 !important",
  borderBottom: "1px solid",
  borderColor: "divider",
};
const INLINE_SX = {
  mt: 3, p: 1.5, bgcolor: "background.paper", borderRadius: 2, border: "1px solid", borderColor: "divider", scrollMarginTop: 8,
  "& .card": INLINE_SECTION_SX,
  "& .card:last-child": { borderBottom: 0, paddingBottom: "0 !important" },
};
const INLINE_HEADER_SX = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minHeight: 40, mt: 1, mb: 1 };

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
  const inlineRef = useRef(null);

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
    if (isMobile) inlineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    return () => clearTimeout(timer);
  }, [isOpen, movementType, isReservation, isMobile]);

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

      const printRequest = printer && printTicket
        ? printTicketQuietly("ticket", { ...data, id: response.data.id, payment })
        : null;

      dispatch(removeClientFromCart());
      dispatch(cleanCart());
      onClose();
      resetPayment();
      setHideClient(true);
      setSaleExchange(INITIAL_SALE_EXCHANGE_STATE);

      // Un solo aviso: venta registrada con el estado de la impresión
      const printStatus = printRequest ? await printRequest : null;
      const failedPrint = printStatus === PRINT_STATUS.ERROR;
      showAlert(
        failedPrint ? "warning" : "success",
        `${isReservation ? "Apartado registrado" : "Venta exitosa"}. Folio ${response.data.id}`,
        getPrintStatusText(printStatus),
        failedPrint ? SALE_ALERT_ERROR_MS : SALE_ALERT_MS,
      );
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

  const title = isReservation ? "Registrar apartado" : "Finalizar venta";

  // En móvil no se imprime ticket
  const submitPanel = (
    <PaymentSubmitPanel
      printer={printer}
      compact={isMobile}
      disabled={isSubmitDisabled}
      onSubmit={() => handleCreateSale(!isMobile && !!printer)}
    >
      {isReservation ? "Apartar" : "Cobrar"}<br />(Ctrl+G)
    </PaymentSubmitPanel>
  );

  const content = (
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
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <CustomButton fullWidth onClick={() => setHideExchange((prev) => !prev)} startIcon={<SwapHorizIcon />}>
                  Intercambio de mercancia
                </CustomButton>
              </Grid>
            )}
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
        {!isMobile && submitPanel}
      </PaymentMethodsSection>
    </Grid>
  );

  // En móvil el cobro se muestra debajo del carrito en vez de en un modal
  if (isMobile) {
    return (
      <>
        <CustomSpinner isLoading={isLoading} />
        {isOpen && (
          <>
            <Box ref={inlineRef} sx={INLINE_SX}>
              <Box sx={INLINE_HEADER_SX}>
                <Typography variant="h5" sx={{ fontSize: "1.375rem", fontWeight: 700 }}>{title}</Typography>
                <CustomTooltip text="Cerrar" position="left">
                  <IconButton onClick={onClose} size="small" aria-label="Cerrar">
                    <CloseIcon />
                  </IconButton>
                </CustomTooltip>
              </Box>
              {content}
            </Box>
            <Box sx={{ mt: 1.5, mb: 3 }}>{submitPanel}</Box>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <CustomSpinner isLoading={isLoading} />
      <CustomModal showOut={isOpen} onClose={onClose} title={title}>
        <ModalBody>{content}</ModalBody>
      </CustomModal>
    </>
  );
};

export default PaymentModal;
