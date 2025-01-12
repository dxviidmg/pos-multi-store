import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import { cleanCart, removeFromCart, updateMovementType } from "../redux/cart/cartActions";
import CustomButton from "../commons/customButton/CustomButton";
import { Col, Form, Row } from "react-bootstrap";
import PaymentModal from "../paymentModal/PaymentModal";
import { hidePaymentModal, showPaymentModal } from "../redux/paymentModal/PaymentModalActions";
import { getStores } from "../apis/stores";
import { confirmDistribution, confirmTransfers } from "../apis/transfers";
import Swal from "sweetalert2";
import { addProducts } from "../apis/products";
import { getUserData } from "../apis/utils";

const Cart = () => {
  const store_type = getUserData().store_type;
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
      try {
        const response = await getStores();
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchData();

    // Si el tipo de tienda es "A", se establece el movimiento como "distribucion"
    if (store_type === "A" && movementType !== "distribucion") {
      dispatch(updateMovementType('distribucion'));
    }
  }, [store_type,dispatch, movementType]);

  const { total } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );
    return { total };
  }, [cart]);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));

  const showAlert = (icon, title, text = "", timer = 2000) => {
    Swal.fire({ icon, title, text, timer });
  };

  const handleTranserFromCart = async (cart) => {
    const data = { transfers: cart, destination_store: selectedStore };
    try {
      const response = await confirmTransfers(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        showAlert("success", "Traspaso confirmado");
      } else if (response.status === 404) {
        showAlert(
          "error",
          "Transpaso no encontrado",
          "Algunos productos no coinciden con el traspaso solicitado, ya sea en cantidad o en código."
        );
      } else {
        showAlert("error", "Error desconocido", "Por favor llame a soporte técnico");
      }
    } catch (error) {
      showAlert("error", "Error en la solicitud", error.message);
    }
  };

  const handleDistributionFromCart = async (cart) => {
    const data = { products: cart, destination_store: selectedStore };
    try {
      const response = await confirmDistribution(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        showAlert("success", "Distribución confirmada");
      } else if (response.status === 404) {
        showAlert(
          "error",
          "Distribución no encontrada",
          "Algunos productos no coinciden con la distribución solicitada, ya sea en cantidad o en código."
        );
      } else {
        showAlert("error", "Error desconocido", "Por favor llame a soporte técnico");
      }
    } catch (error) {
      showAlert("error", "Error en la solicitud", error.message);
    }
  };

  const handleAddToStock = async (cart) => {
    const data = { products: cart };
    try {
      const response = await addProducts(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        showAlert("success", "Producto añadido al inventario");
      } else {
        showAlert("error", "Error en el inventario", "No se pudo añadir el producto");
      }
    } catch (error) {
      showAlert("error", "Error en la solicitud", error.message);
    }
  };

  const handleOpenModal = () => {
    dispatch(hidePaymentModal());
    setTimeout(() => dispatch(showPaymentModal()), 1);
  };

  const commonColumns = [
    { name: "Código", selector: (row) => row.product_code },
    { name: "Descripción", selector: (row) => row.description, grow: 3, wrap: true },
    { name: "Stock", selector: (row) => row.stock },
  ];

  const commonColumns2 = [
    { name: "Código", selector: (row) => row.product_code },
    { name: "Descripción", selector: (row) => row.description, grow: 3, wrap: true }
  ];

  const saleColumns = [
    ...commonColumns2,
    { name: "Cantidad", selector: (row) => row.quantity },
    { name: "Stock", selector: (row) => row.stock },
    { name: "Precio", selector: (row) => `$${row.product_price.toFixed(2)}` },
    {
      name: "Total por producto",
      selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`,
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>Borrar</CustomButton>
      ),
    },
  ];

  const transferColumns = [
    ...commonColumns,
    { name: "Cantidad", selector: (row) => row.quantity },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>Borrar</CustomButton>
      ),
    },
  ];

  const distributionColumns = [
    ...commonColumns,
    { name: "Cantidad", selector: (row) => row.quantity },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>Borrar</CustomButton>
      ),
    },
  ];

  const addToStockColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => row.quantity,
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>Borrar</CustomButton>
      ),
    },
  ];

  const getColumns = () => {
    if (movementType === "venta") return saleColumns;
    if (movementType === "traspaso") return transferColumns;
    if (movementType === "distribucion") return distributionColumns;
    if (movementType === "agregar") return addToStockColumns;
    return commonColumns;
  };

  return (
    <div>
      <PaymentModal />
      <div>
        {cart.length !== 0 && (
          <Row>
            {movementType === "venta" && (
              <>
                <Col md={6}></Col>
                <Col md={3} className="d-flex gap-3 justify-content-end">
                  <h3>Total: ${total.toFixed(2)}</h3>
                </Col>
                <Col md={3}>
                  <CustomButton fullWidth onClick={handleOpenModal}>
                    Pagar
                  </CustomButton>
                </Col>
              </>
            )}

            {(movementType === "traspaso" || movementType === "distribucion") && (
              <>
                <Col md={6}></Col>
                <Col md={3}>
                  <Form.Select value={selectedStore} onChange={handleSelectChange}>
                    <option value="">Selecciona una tienda</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <CustomButton
                    onClick={() =>
                      movementType === "traspaso"
                        ? handleTranserFromCart(cart)
                        : handleDistributionFromCart(cart)
                    }
                    disabled={!selectedStore}
                    fullWidth
                  >
                    {movementType === "traspaso" ? "Transferir" : "Distribuir"}
                  </CustomButton>
                </Col>
              </>
            )}

            {movementType === "agregar" && (
              <>
                <Col md={9}></Col>
                <Col md={3}>
                  <CustomButton fullWidth onClick={() => handleAddToStock(cart)}>
                    Añadir
                  </CustomButton>
                </Col>
              </>
            )}
          </Row>
        )}
        <CustomTable noDataComponent="Sin productos" data={cart} columns={getColumns()} />
      </div>
    </div>
  );
};

export default Cart;
