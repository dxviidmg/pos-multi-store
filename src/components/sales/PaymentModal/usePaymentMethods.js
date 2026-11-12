import { useEffect, useRef, useState } from "react";
import { MOVEMENT_TYPES, PAYMENT_METHODS } from "../../../constants";

const { CASH, CARD, TRANSFER } = PAYMENT_METHODS;

export const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };
const EMPTY_METHODS = { [CASH]: 0, [CARD]: 0, [TRANSFER]: 0 };

// "radio" = pago único, "checkbox" = pago mixto
export const PAYMENT_TYPES = { SINGLE: "radio", MIXED: "checkbox" };

const getActiveMethod = (methods) => Object.entries(methods).find(([, amount]) => amount > 0)?.[0];

/**
 * Estado del cobro: tipo de pago (único/mixto), monto por medio de pago, "Pago con"/cambio
 * y referencia. Concentra las reglas de venta y apartado del `PaymentModal`.
 *
 * @param {{ totalDiscount: number, movementType: string, refunded: number, clientId?: number }} params
 */
export const usePaymentMethods = ({ totalDiscount, movementType, refunded, clientId }) => {
  const isReservation = movementType === MOVEMENT_TYPES.RESERVATION;
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethods, setPaymentMethods] = useState({ type: PAYMENT_TYPES.SINGLE, methods: EMPTY_METHODS });

  // Último "Pago con" para el apartado, sin reiniciar los medios de pago cuando cambia
  const paidWithRef = useRef(payment.paidWith);
  paidWithRef.current = payment.paidWith;

  // Al cambiar el total o el tipo de movimiento se vuelve a pago único:
  // venta → todo en efectivo; apartado → el abono capturado (mínimo 1) en efectivo.
  useEffect(() => {
    setPaymentMethods({
      type: PAYMENT_TYPES.SINGLE,
      methods: { ...EMPTY_METHODS, [CASH]: isReservation ? paidWithRef.current || 1 : totalDiscount },
    });
  }, [totalDiscount, movementType, isReservation]);

  const { methods, type } = paymentMethods;

  const handleChangePayments = (e) => {
    const { name, value } = e.target;

    if (name === "paymentType") {
      setPaymentMethods({
        type: value,
        methods: value === PAYMENT_TYPES.SINGLE ? { ...EMPTY_METHODS, [CASH]: totalDiscount } : EMPTY_METHODS,
      });
      setPayment({ paidWith: totalDiscount - refunded, change: 0 });
      return;
    }

    const updatedMethods =
      type === PAYMENT_TYPES.SINGLE
        ? { [value]: totalDiscount }
        : { ...methods, [value]: methods[value] ? 0 : 0.01 };

    if (!(CASH in updatedMethods)) {
      const amount = updatedMethods[CARD] || updatedMethods[TRANSFER];
      setPayment({ paidWith: amount - refunded, change: 0 });
    }
    setPaymentMethods((prev) => ({ ...prev, methods: updatedMethods }));
  };

  const handlePaymentValueChange = (method, value) => {
    setPaymentMethods((prev) => ({
      ...prev,
      methods: { ...prev.methods, [method]: parseFloat(value) || 0 },
    }));
  };

  const handlePaidWithChange = (e) => {
    let value = Number(e.target.value);

    if (isNaN(value)) {
      setPayment(INITIAL_PAYMENT_STATE);
    } else {
      // En apartado, máximo total - 1 (redondeado hacia abajo)
      if (isReservation) {
        value = Math.min(value, Math.floor(totalDiscount) - 1);
      }
      setPayment({ paidWith: value, change: value + refunded - totalDiscount });
    }

    if (isReservation) {
      const currentMethod = getActiveMethod(methods) || CASH;
      setPaymentMethods({
        type: PAYMENT_TYPES.SINGLE,
        methods: { ...EMPTY_METHODS, [currentMethod]: value || 1 },
      });
    }
  };

  const amounts = Object.values(methods);
  const totalPaymentInput = (amounts.reduce((acc, curr) => acc + curr, 0) * 100) / 100;
  const noAmounts = amounts.every((amount) => amount === 0);
  const needsReference = methods[CARD] > 0 || methods[TRANSFER] > 0;

  // Medio seleccionado en el radio de "Medios de pago"
  const selectedMethod = isReservation
    ? getActiveMethod(methods) || CASH
    : Object.entries(methods).find(([, amount]) => amount === totalDiscount)?.[0] || "";

  const isSubmitDisabled = isReservation
    ? payment.paidWith < 1 || noAmounts || !clientId
    : (type === PAYMENT_TYPES.MIXED && totalPaymentInput !== totalDiscount) ||
      noAmounts ||
      (type === PAYMENT_TYPES.SINGLE && methods[CASH] > payment.paidWith + refunded) ||
      (needsReference && referencePayment === "");

  const paymentList = Object.entries(methods)
    .filter(([, amount]) => amount > 0)
    .map(([method, amount]) => ({ payment_method: method, amount }));

  return {
    payment,
    resetPayment: () => setPayment(INITIAL_PAYMENT_STATE),
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
  };
};
