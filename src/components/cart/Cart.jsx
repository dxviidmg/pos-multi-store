import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable";
import { cleanCart, removeFromCart } from "../redux/cart/cartActions";
import CustomButton from "../commons/customButton/CustomButton";
import { Col, Row } from "react-bootstrap";
import { createSale } from "../apis/sales";
import CustomAlert from "../commons/customAlert";
import { removeClient } from "../redux/clientSelected/clientSelectedActions";
import CustomModal from "../commons/customModal/customModal";
import PaymentModal from "../paymentModal/PaymentModal";
import { hidePaymentModal, showPaymentModal } from "../redux/paymentModal/PaymentModalActions";

const Cart = () => {
  const cart = useSelector((state) => state.cartReducer.cart);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const clientSelected = useSelector(
    (state) => state.clientSelectedReducer.client
  );
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  // Memorizar los totales para evitar recálculo innecesario
  const { total, totalDiscount } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );
    const totalDiscount = clientSelected?.discount
      ?.discount_percentage_complement
      ? total * (clientSelected.discount.discount_percentage_complement / 100)
      : null;

    return { total, totalDiscount };
  }, [cart, clientSelected]);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));

  const handleCreateSale = async () => {

    console.log(cart)
    const data = {
      client: clientSelected.id,
      total: total ? total : totalDiscount,
      store_products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.product_price
      })),
    };

    console.log('p', data)
    

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
    console.log('xxx')
//    dispatch(hidePaymentModal())
//    setTimeout(() => dispatch(showPaymentModal()), 1);
  };


  return (
    <div>

<PaymentModal/>



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
                {totalDiscount && (
                  <h3>Total con descuento: ${totalDiscount.toFixed(2)}</h3>
                )}
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
                sortable: true,
              },
              {
                name: "Descripción",
                selector: (row) => row.description,
                sortable: true,
              },
              {
                name: "Stock",
                selector: (row) => row.stock,
                sortable: true,
              },
              {
                name: "Precio",
                selector: (row) => `$${row.product_price.toFixed(2)}`,
                sortable: true,
              },
              {
                name: "Cantidad a vender",
                selector: (row) => row.quantity,
                sortable: true,
              },
              {
                name: "Total por producto",
                selector: (row) =>
                  `$${(row.product_price * row.quantity).toFixed(2)}`,
                sortable: true,
              },
              {
                name: "Acciones",
                selector: (row) => (
                  <CustomButton onClick={() => handleRemoveFromCart(row)}>
                    Borrar
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
