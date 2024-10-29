import React from 'react';
import CustomModal from '../commons/customModal/customModal';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const PaymentModal = () => {
  const { showPaymentModal } = useSelector((state) => state.PaymentModalReducer);

  console.log('showPaymentModal', showPaymentModal)
  return (
    <CustomModal showOut={showPaymentModal} title="Finalizar pago">
      <div className="text-center">
        hola
      </div>

 
    </CustomModal>
  );
};

export default PaymentModal;
