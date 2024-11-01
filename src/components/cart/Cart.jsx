import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { cleanCart, removeFromCart } from "../redux/cart/cartActions";
import CustomButton from "../commons/customButton/CustomButton";
import { Col, Row } from "react-bootstrap";
import { createSale } from "../apis/sales";
import CustomAlert from "../commons/customAlert";
import { removeClient } from "../redux/clientSelected/clientSelectedActions";
import PaymentModal from "../paymentModal/PaymentModal";
import {
  hidePaymentModal,
  showPaymentModal,
} from "../redux/paymentModal/PaymentModalActions";

const Cart = () => {
  const cart = useSelector((state) => state.cartReducer.cart);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const clientSelected = useSelector(
    (state) => state.clientSelectedReducer.client
  );
  const dispatch = useDispatch();

  const { total } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );


    return { total };
  }, [cart, clientSelected]);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));

  const handleCreateSale = async () => {
    console.log('data', cart);
    const data = {
      client: clientSelected.id,
//      total: total ? total : totalDiscount,
      total: total,
      store_products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.product_price,
      })),
    };

    console.log("data", data);

    const response = await createSale(data);
    //    return

    setShowAlert(true);

    if (response.status === 201) {
      dispatch(removeClient());
      dispatch(cleanCart());
      setMessageAlert("Compra exitosa");
    } else {
      setMessageAlert(
        "No se pudo concretar la venta. Intente de nuevo o llame a soporte"
      );
    }
  };

  setTimeout(function () {
    setShowAlert(false);
  }, 5000);

  const handleOpenModal = () => {
    dispatch(hidePaymentModal());
    setTimeout(() => dispatch(showPaymentModal()), 1);
  };

  return (
    <div>
      <PaymentModal />

      <CustomAlert
        messageAlert={messageAlert}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />

      {cart.length > 0 ? (
        <div>
          <Row>
            <Col md={3}>
              <h2>Compra actual</h2>
            </Col>
            <Col md={7}>
              <div className="d-flex gap-3 justify-content-end">
                <h3>Total: ${total.toFixed(2)}</h3>
              </div>
            </Col>

            <Col md={2}>
              <CustomButton fullWidth={true} onClick={() => handleOpenModal()}>
                Pagar
              </CustomButton>
            </Col>
          </Row>

          <CustomTable
            data={cart}
            columns={[
              {
                name: "Código",
                selector: (row) => row.product_code,
  
              },
              {
                name: "Descripción",
                selector: (row) => row.description,
   grow: 3,  wrap: true
              },
              {
                name: "Stock",
                selector: (row) => row.available_stock,
  
              },
              {
                name: "Precio",
                selector: (row) => `$${row.product_price.toFixed(2)}`,
  
              },
              {
                name: "Vender",
                selector: (row) => row.quantity,
  
              },
              {
                name: "Total por producto",
                selector: (row) =>
                  `$${(row.product_price * row.quantity).toFixed(2)}`,
  
              },
              {
                name: "Borrar",
                selector: (row) => (
                  <CustomButton onClick={() => handleRemoveFromCart(row)}>
                    Borrar
                  </CustomButton>
                ),
              },
              {
                name: "Transderir",
                selector: (row) => (
                  <CustomButton onClick="">
                    Transferir
                  </CustomButton>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <>
          <h2>Compra actual</h2>
          <p>Sin productos</p>
        </>
      )}
    </div>
  );
};

export default Cart;
