import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { removeFromCart } from "../redux/cart/cartActions";
import CustomButton from "../commons/customButton/CustomButton";
import { Col, Form, Row } from "react-bootstrap";
import PaymentModal from "../paymentModal/PaymentModal";
import {
  hidePaymentModal,
  showPaymentModal,
} from "../redux/paymentModal/PaymentModalActions";
import { getStores } from "../apis/stores";
import { confirmTransfer } from "../apis/transfers";
import Swal from "sweetalert2";

const Cart = () => {
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);

  const [selectedStore, setSelectedStore] = useState("");

  const handleSelectChange = (event) => {
    setSelectedStore(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStores();
      setStores(response.data);
    };

    fetchData();
  }, []);

  const { total } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );

    return { total };
  }, [cart]);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));

  const handleTranserFromCart = async (cart) => {
    alert('Cambiar de product a products (cart). api, if tipo tienda solo vea tiendas')
    return
    const data = {
//      product: product.product_id,
//      quantity: product.quantity,
//      destination_store: selectedStore,
    };

    const response = await confirmTransfer(data);

    if (response.status === 200) {
  //    dispatch(removeFromCart(product));

      Swal.fire({
        icon: "success",
        title: "Traspaso confirmado",
        timer: 2000,
      });
    } else if (response.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Transpaso no encontrado",
        text: "No se puede completar el traspaso de producto",
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error desconocido",
        text: "Por favor llame a soporte tecnico",
        timer: 2000,
      });
    }

//    removeFromCart(product);
  };


  const handleAddToStock = async (cart) => {
    alert('crear api')
    return
    const data = {
//      product: product.product_id,
//      quantity: product.quantity,
//      destination_store: selectedStore,
    };

    const response = await confirmTransfer(data);

    if (response.status === 200) {
//      dispatch(removeFromCart(product));

      Swal.fire({
        icon: "success",
        title: "Traspaso confirmado",
        timer: 2000,
      });
    } else if (response.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Transpaso no encontrado",
        text: "No se puede completar el traspaso de producto",
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error desconocido",
        text: "Por favor llame a soporte tecnico",
        timer: 2000,
      });
    }

//    removeFromCart(product);
  };

  const handleOpenModal = () => {
    dispatch(hidePaymentModal());
    setTimeout(() => dispatch(showPaymentModal()), 1);
  };

  return (
    <div>
      <PaymentModal />
      <div>
        {cart.length !== 0 && (
          <Row>
            {movementType === "venta" && (
              <>
                {" "}
                <Col md={6}></Col>
                <Col md={3}>
                  <div className="d-flex gap-3 justify-content-end">
                    <h3>Total: ${total.toFixed(2)}</h3>
                  </div>
                </Col>
                <Col md={3}>
                  <CustomButton
                    fullWidth={true}
                    onClick={() => handleOpenModal()}
                  >
                    Pagar
                  </CustomButton>
                </Col>
              </>
            )}

            {movementType === "traspaso" && (
              <>
                {" "}
                <Col md={6}></Col>
                <Col md={3}>
                  <Form.Select
                    aria-label="Default select example"
                    value={selectedStore}
                    onChange={handleSelectChange}
                  >
                    <option value="">Selecciona una tienda</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.full_name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <CustomButton
                    onClick={() => handleTranserFromCart(cart)}
                    disabled={selectedStore === ""}
                    fullWidth={true}
                  >
                    Transferir
                  </CustomButton>
                </Col>
              </>
            )}


{movementType === "agregar" && (
              <>
                {" "}
                <Col md={9}></Col>

                <Col md={3}>
                  <CustomButton
                  //pendiente
                    onClick={() => handleAddToStock(cart)}
                    fullWidth={true}
                  >
                    Añadir
                  </CustomButton>
                </Col>
              </>
            )}

          </Row>
        )}
        <CustomTable
          noDataComponent="Sin productos"
          data={cart}
          columns={[
            {
              name: "Código",
              selector: (row) => row.product_code,
            },
            {
              name: "Descripción",
              selector: (row) => row.description,
              grow: 3,
              wrap: true,
            },
            {
              name: "Stock",
              selector: (row) => row.stock,
            },

            ...(movementType === "venta"
              ? [
                  {
                    name: "Precio",
                    selector: (row) => `$${row.product_price.toFixed(2)}`,
                  },
                ]
              : []),

            {
              name:
                movementType === "traspaso"
                  ? "Traspasar"
                  : movementType === "agregar"
                  ? "Agregar"
                  : "Vender",
              selector: (row) => row.quantity,
            },

            ...(movementType === "venta"
              ? [
                  {
                    name: "Total por producto",
                    selector: (row) =>
                      `$${(row.product_price * row.quantity).toFixed(2)}`,
                  },
                ]
              : []),

            {
              name: "Borrar",
              selector: (row) => (
                <CustomButton onClick={() => handleRemoveFromCart(row)}>
                  Borrar
                </CustomButton>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Cart;
