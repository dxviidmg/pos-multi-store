import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import {
  cleanCart,
  removeFromCart,
  updateMovementType,
  updateQuantityInCart,
  changePrice,
  countStockOtherStores,
} from "../redux/cart/cartActions";
import CustomButton from "../commons/customButton/CustomButton";
import { Col, Form, Row } from "react-bootstrap";
import PaymentModal from "../paymentModal/PaymentModal";
import {
  hidePaymentModal,
  showPaymentModal,
} from "../redux/paymentModal/PaymentModalActions";
import { getStores } from "../apis/stores";
import { confirmTransfers, createDistribution } from "../apis/transfers";
import Swal from "sweetalert2";
import { addProducts, getStockOtherStores } from "../apis/products";
import { getUserData } from "../apis/utils";
import { RemoveInCartIcon } from "../commons/icons/Icons";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { hideStockModal, showStockModal } from "../redux/stockModal/StockModalActions";

const Cart = () => {
  const store_type = getUserData().store_type;
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector((state) => state.cartReducer.movementType);
  const dispatch = useDispatch();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [confirmedStore, setConfirmedStore] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getUserData();

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        dispatch(hidePaymentModal());
        setTimeout(() => dispatch(showPaymentModal()), 1);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [dispatch]);

  const handleSelectChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const handleSelectChange2 = (event) => {
    setConfirmedStore(event.target.value);
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
    if (store_type === "A" && movementType === "venta") {
      dispatch(updateMovementType("distribucion"));
    }
  }, [store_type, dispatch, movementType]);

  const { total } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );
    return { total };
  }, [cart]);

  const { totalProducts } = useMemo(() => {
    const totalProducts = cart.reduce((acc, item) => acc + item.quantity, 0);
    return { totalProducts };
  }, [cart]);

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product));

  const handleStockOtherStores = async (product) => {
    console.log("hola", product.product.code);

    const response = await getStockOtherStores(product.product.code);
    console.log(response);
    dispatch(countStockOtherStores(product, response.data));
  };

  const handleChangePrice = (product) => {
    dispatch(changePrice(product));
  };

  const handleQuantityChangeToCart = (e, product) => {
    const newQuantity = parseInt(e.target.value, 10); // Usar base 10 para parsear

    // Validaciones
    if (newQuantity <= 0) {
      return;
    }

    const validQuantity =
      movementType === "venta"
        ? Math.min(newQuantity, product.available_stock)
        : newQuantity;
      if (movementType !== "agregar"){
        if (newQuantity > product.available_stock){
          dispatch(hideStockModal());
          setTimeout(() => dispatch(showStockModal(product)), 1);
        }
      }


    // Despachar acción para actualizar la cantidad en el carrito
    dispatch(updateQuantityInCart(product, validQuantity));
  };

  const showAlert = (icon, title, text = "", timer = 5000) => {
    Swal.fire({ icon, title, text, timer });
  };

  const handleTranserFromCart = async (cart) => {
    if (loading) return; // Previene reenvío
    setLoading(true)

    const data = { transfers: cart, destination_store: selectedStore };
    try {
      const response = await confirmTransfers(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        setLoading(false)
        showAlert("success", "Traspaso confirmado");
      } else if (response.status === 404) {
        dispatch(cleanCart());
        setLoading(false)
        showAlert("error", "Traspaso inexistente. Checa cantidad y/o destino");
      } else {
        setLoading(false)
        showAlert(
          "error",
          "Error desconocido",
          "Por favor llame a soporte técnico"
        );
      }
    } catch (error) {
      setLoading(false)
      showAlert("error", "Error en la solicitud", error.message);
    }
  };

  const handleDistributionFromCart = async (cart) => {
    if (loading) return; // Previene reenvío
    setLoading(true)
    const data = { products: cart, destination_store: selectedStore };
    try {
      const response = await createDistribution(data);
      if (response.status === 201) {
        dispatch(cleanCart());
      setSelectedStore("")
      setConfirmedStore("")
      setTimeout(() => {
        setLoading(false)
      }, 164);
        showAlert("success", "Distribución creada");
      } else if (response.status === 404) {
        setLoading(false)
        showAlert(
          "error",
          "Distribución no encontrada",
          "Algunos productos no coinciden con la distribución solicitada, ya sea en cantidad o en código."
        );
      } else {
        setLoading(false)
        showAlert(
          "error",
          "Error desconocido",
          "Por favor llame a soporte técnico"
        );
      }
    } catch (error) {
      setLoading(false)
      showAlert("error", "Error en la solicitud", error.message);
    }
  };

  const handleAddToStock = async (cart) => {
    if (loading) return; // Previene reenvío
    setLoading(true);

    const products_to_add = cart.map(item => ({
      id: item.id,
      stock: item.stock,
      quantity: item.quantity
    }));

    const data = { store_products: products_to_add };
    try {
      const response = await addProducts(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        setLoading(false);
        showAlert("success", "Producto añadido al inventario");
      } else {
        setLoading(false);
        showAlert(
          "error",
          "Error en el inventario",
          "No se pudo añadir el producto"
        );
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
    { name: "Código", selector: (row) => row.product.code },
    {
      name: "Marca",
      selector: (row) => row.product.brand_name,
    },
    {
      name: "Nombre",
      selector: (row) => row.product.name,
      grow: 3,
      wrap: true,
    },
    { name: "Stock", selector: (row) => row.available_stock },
  ];

  const commonColumns2 = [
    { name: "Código", selector: (row) => row.product.code },
    {
      name: "Marca",
      selector: (row) => row.product.brand_name,
    },
    {
      name: "Nombre",
      selector: (row) => row.product.name,
      grow: 3,
      wrap: true,
    },
  ];

  const saleColumns = [
    ...commonColumns2,
    {
      name: "Cantidad",
      selector: (row) => (
        <Form.Control
          type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)} // Implementa esta función para manejar el cambio
          min="1" // Opcional, para establecer un valor mínimo
          max={row.stock}
        />
      ),
    },
    { name: "Stock", selector: (row) => row.available_stock },
    { name: "Precio", selector: (row) => `$${row.product_price.toFixed(2)}` },
    {
      name: "Total por producto",
      selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`,
    },
    {
      name: "Precio mayorista",
      selector: (row) => (
        <Form.Check
          type="switch"
          id="custom-switch"
          checked={row.product_price === row.product.prices.wholesale_price}
          onClick={() => handleChangePrice(row)}
          disabled={!row.product.prices.wholesale_price}
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <RemoveInCartIcon />
        </CustomButton>
      ),
    },
  ];

  const saleColumns2 = [
    ...commonColumns2,
    {
      name: "Cantidad",
      selector: (row) => (
        <Form.Control
          type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)} // Implementa esta función para manejar el cambio
          min="1" // Opcional, para establecer un valor mínimo
          max={row.available_stock}
        />
      ),
    },
    { name: "Stock", selector: (row) => row.available_stock },
    { name: "Precio", selector: (row) => `$${row.product_price.toFixed(2)}` },
    {
      name: "Total por producto",
      selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`,
    },
    {
      name: "Precio mayorista",
      selector: (row) => (
        <Form.Check
          type="switch"
          id="custom-switch"
          checked={row.product_price === row.product.prices.wholesale_price}
          onClick={() => handleChangePrice(row)}
          disabled={!row.product.prices.wholesale_price}
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <RemoveInCartIcon />
        </CustomButton>
      ),
    },
  ];

  const transferColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => (
        <Form.Control
          type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)} // Implementa esta función para manejar el cambio
          min="1" // Opcional, para establecer un valor mínimo
          max={row.available_stock}
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <RemoveInCartIcon />
        </CustomButton>
      ),
    },
  ];

  const distributionColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => (
        <Form.Control
          type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)} // Implementa esta función para manejar el cambio
          min="1" // Opcional, para establecer un valor mínimo
          max={row.available_stock}
        />
      ),
    },

    {
      name: "Stock General",
      wrap: true,
      grow: 1.5,
      cell: (row) => (
        <div>
          {row.stockOtherStores && row.stockOtherStores.length > 0 ? (
            <ul style={{ paddingLeft: "1rem", margin: "0.5rem 0 0 0" }}>
              {row.stockOtherStores.map((s) => (
                <li key={s.store_id}>
                  {s.store_name}: {s.available_stock}
                </li>
              ))}
            </ul>
          ) : (
            <CustomButton onClick={() => handleStockOtherStores(row)}>
              Contar
            </CustomButton>
          )}
        </div>
      ),
    },

    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <RemoveInCartIcon />
        </CustomButton>
      ),
    },
  ];

  const addToStockColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => (
        <Form.Control
          type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)} // Implementa esta función para manejar el cambio
          min="1" // Opcional, para establecer un valor mínimo
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <RemoveInCartIcon />
        </CustomButton>
      ),
    },
  ];

  const getColumns = () => {
    switch (movementType) {
      case "venta":
      case "apartado":
        // Si es multi-store, usamos saleColumns2
        return user.is_multi_store === true ? saleColumns2 : saleColumns;

      case "traspaso":
        return transferColumns;

      case "distribucion":
        return distributionColumns;

      case "agregar":
        return addToStockColumns;

      default:
        return commonColumns;
    }
  };

  return (
    <div>
      <CustomSpinner2 isLoading={loading} />
      <PaymentModal />
      <div>
        {cart.length !== 0 && (
          <Row>
            {(movementType === "venta" || movementType === "apartado") && (
              <>
                <Col md={4}>
                  {" "}
                  <h1>Productos: {totalProducts}</h1>
                </Col>

                <Col md={4} className="text-center">
                  <h1>Total: ${total.toFixed(2)}</h1>
                </Col>
                <Col md={4}>
                  <CustomButton fullWidth onClick={handleOpenModal}>
                    Cobrar (Ctrl + D)
                  </CustomButton>
                </Col>
              </>
            )}

            {(movementType === "traspaso" ||
              movementType === "distribucion") && (
              <>
                <Col md={3}><h1>Productos: {totalProducts}</h1></Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedStore}
                    onChange={handleSelectChange}
                  >
                    <option value="">Selecciona un destino</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        <b>{store.name} ({store.store_type_display})</b>
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={confirmedStore}
                    onChange={handleSelectChange2}
                  >
                    <option value="">Confirma el destino</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.store_type_display})
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
                    disabled={!selectedStore || selectedStore !== confirmedStore}
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
                  <CustomButton
                    fullWidth
                    onClick={() => handleAddToStock(cart)}
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
          columns={getColumns()}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Cart;
