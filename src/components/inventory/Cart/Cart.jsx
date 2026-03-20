import { logger } from "../../../utils/logger";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import {
  cleanCart,
  removeFromCart,
  updateMovementType,
  updateQuantityInCart,
  changePrice,
  countStockOtherStores,
} from "../../../redux/cart/cartActions";
import CustomButton from "../../ui/Button/Button";
import PaymentModal from "../../sales/PaymentModal/PaymentModal";
import StockModal from "../StockModal/StockModal";
import { getStores } from "../../../api/stores";
import { confirmTransfers, createDistribution } from "../../../api/transfers";
import { showAlert } from "../../../utils/alerts";
import { addProducts, getStockOtherStores } from "../../../api/products";
import { getUserData } from "../../../api/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { useModal } from "../../../hooks/useModal";
import { Grid, TextField, Checkbox, Select, MenuItem } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CalculateIcon from "@mui/icons-material/Calculate";
import { MOVEMENT_TYPES, STORE_TYPES } from "../../../constants";

const Cart = ({ searchInputRef }) => {
  const store_type = getUserData().store_type;
  const dispatch = useDispatch();
  const stockModal = useModal();
  const paymentModal = useModal();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [confirmedStore, setConfirmedStore] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getUserData();
  
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);
  
  // Usar multiCartReducer en lugar de cartReducer
  const cart = useSelector((state) => {
    const { carts, activeCartId } = state.multiCartReducer;
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.cart || [];
  });
  
  const movementType = useSelector((state) => {
    const { carts, activeCartId } = state.multiCartReducer;
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.movementType || "venta";
  });
  
  // Calcular stock disponible considerando todos los carritos
  const getAvailableStock = (productId, productStock) => {
    const reservedInOtherCarts = carts.reduce((total, cart) => {
      if (cart.id === activeCartId) return total;
      const item = cart.cart.find(item => item.id === productId);
      return total + (item ? item.quantity : 0);
    }, 0);
    return productStock - reservedInOtherCarts;
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && (event.key === "p" || event.key === "P")) {
        event.preventDefault();
        paymentModal.open();
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
        logger.error("Error fetching stores:", error);
      }
    };
    fetchData();

    // Si el tipo de tienda es "A", se establece el movimiento como "distribucion"
    if (store_type === STORE_TYPES.WAREHOUSE && movementType === MOVEMENT_TYPES.SALE) {
      dispatch(updateMovementType(MOVEMENT_TYPES.DISTRIBUTION));
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

  const handleRemoveFromCart = (product) => dispatch(removeFromCart(product.id));

  const handleStockOtherStores = async (product) => {
    const response = await getStockOtherStores(product.product.code);
    dispatch(countStockOtherStores(product, response.data));
    stockModal.open(product);
  };

  const handleChangePrice = (product) => {
    dispatch(changePrice(product));
  };

  const handleQuantityChangeToCart = (e, product) => {
    const newQuantity = Number(e.target.value);
  
    // Permitir campo vacío mientras el usuario escribe
    if (e.target.value === "" || newQuantity <= 0) return;
  
    // --- Control de límites según movimiento ---
    const stockLimit =
      movementType === "traspaso"
        ? product.stock
        : movementType === "venta"
        ? product.available_stock
        : Infinity;
  
    // Verificar stock disponible considerando otros carritos
    const availableStock = movementType === "agregar" ? Infinity : getAvailableStock(product.id, stockLimit);
    
    if (newQuantity > availableStock) {
      stockModal.open(product);
      return;
    }
    
    const quantity = Math.min(newQuantity, availableStock);
  
    // --- Mostrar modal si se excede el stock (excepto agregar) ---
    if (movementType !== "agregar" && newQuantity > product.available_stock) {
      stockModal.open(product);
    }
  
    dispatch(updateQuantityInCart(product, quantity));
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
      }, 200);
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


  const commonColumns = [
    { name: "Código", field: "code", selector: (row) => row.product.code },
    {
      name: "Marca",
      field: "brand",
      selector: (row) => row.product.brand_name,
    },
    {
      name: "Nombre",
      field: "name",
      selector: (row) => row.product.name,
      grow: 5,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          lineHeight: '1.3',
          padding: '4px 0'
        }}>
          {params.row.product.name}
        </div>
      ),
    },
    { name: "Stock", field: "stock", selector: (row) => row.available_stock },
  ];

  const commonColumns2 = [
    { name: "Código", field: "code", selector: (row) => row.product.code, width: 100 },
    {
      name: "Marca",
      field: "brand",
      selector: (row) => row.product.brand_name,
      width: 100,
    },
    {
      name: "Nombre",
      field: "name",
      selector: (row) => row.product.name,
      grow: 2,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          lineHeight: '1.3',
          padding: '4px 0'
        }}>
          {params.row.product.name}
        </div>
      ),
    },
  ];

  const saleColumns = [
    ...commonColumns2,
    {
      name: "Cantidad",
      selector: (row) => (
        <TextField size="small" fullWidth type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const newValue = row.quantity + 1;
              const availableStock = movementType === "agregar" ? Infinity : getAvailableStock(row.id, row.available_stock);
              if (newValue <= availableStock) {
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const newValue = Math.max(1, row.quantity - 1);
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          }}
          min="1"
          max={row.available_stock}
        />
      ),
    },
    { name: "Stock", selector: (row) => row.available_stock },
    { name: "Precio", selector: (row) => `$${row.product_price.toFixed(2)}` },
    {
      name: "Subtotal",
      selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`,
    },
    {
      name: "Aplicar mayoreo",
      selector: (row) => (
        <Checkbox size="small"
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
          <DeleteIcon />
        </CustomButton>
      ),
    },
  ];

  const transferColumns = [
    { name: "Código", selector: (row) => row.product.code },
    {
      name: "Marca",
      selector: (row) => row.product.brand_name,
    },
    {
      name: "Nombre",
      selector: (row) => row.product.name,
      grow: 3,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          lineHeight: '1.3',
          padding: '4px 0'
        }}>
          {params.row.product.name}
        </div>
      ),
    },
    { name: "Stock disponible", selector: (row) => row.available_stock },
    { name: "Stock apartado", selector: (row) => row.reserved_stock },
    { name: "Stock total", selector: (row) => row.available_stock + row.reserved_stock },
    {
      name: "Cantidad",
      selector: (row) => (
        <TextField size="small" fullWidth type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const newValue = row.quantity + 1;
              const availableStock = getAvailableStock(row.id, row.available_stock);
              if (newValue <= availableStock) {
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const newValue = Math.max(1, row.quantity - 1);
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          }}
          min="1"
          max={row.available_stock}
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <DeleteIcon />
        </CustomButton>
      ),
    },
  ];

  const distributionColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => (
        <TextField size="small" fullWidth type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const newValue = row.quantity + 1;
              const availableStock = getAvailableStock(row.id, row.available_stock);
              if (newValue <= availableStock) {
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const newValue = Math.max(1, row.quantity - 1);
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          }}
          min="1"
          max={row.available_stock}
        />
      ),
    },

    {
      name: "Stock General",
      wrapText: true,
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
            <CustomButton onClick={() => handleStockOtherStores(row)} startIcon={<CalculateIcon />}>
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
          <DeleteIcon />
        </CustomButton>
      ),
    },
  ];

  const addToStockColumns = [
    ...commonColumns,
    {
      name: "Cantidad",
      selector: (row) => (
        <TextField size="small" fullWidth type="number"
          value={row.quantity}
          onChange={(e) => handleQuantityChangeToCart(e, row)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const newValue = row.quantity + 1;
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const newValue = Math.max(1, row.quantity - 1);
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          }}
          min="1"
        />
      ),
    },
    {
      name: "Borrar",
      selector: (row) => (
        <CustomButton onClick={() => handleRemoveFromCart(row)}>
          <DeleteIcon />
        </CustomButton>
      ),
    },
  ];

  const getColumns = () => {
    switch (movementType) {
      case MOVEMENT_TYPES.SALE:
      case MOVEMENT_TYPES.RESERVATION:
        return saleColumns;

      case MOVEMENT_TYPES.TRANSFER:
        return transferColumns;

      case MOVEMENT_TYPES.DISTRIBUTION:
        return distributionColumns;

      case MOVEMENT_TYPES.ADD_STOCK:
        return addToStockColumns;

      default:
        return commonColumns;
    }
  };

  return (
    <div>
      <CustomSpinner isLoading={loading} />
      <PaymentModal isOpen={paymentModal.isOpen} onClose={() => { paymentModal.close(); setTimeout(() => searchInputRef?.current?.focus(), 100); }} />
      <StockModal isOpen={stockModal.isOpen} product={stockModal.data} onClose={stockModal.close} />
      <div>
        {cart.length !== 0 && (
          <Grid container spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
            {(movementType === "venta" || movementType === "apartado") && (
              <>
                <Grid item xs={12} md={4}>
                  <h3>Productos: {totalProducts}</h3>
                </Grid>

                <Grid item xs={12} md={4}>
                  <h3>Total: ${total.toFixed(2)}</h3>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomButton fullWidth onClick={() => paymentModal.open()} startIcon={<PaymentIcon />}>
                    Cobrar (Ctrl+P)
                  </CustomButton>
                </Grid>
              </>
            )}

            {(movementType === "traspaso" ||
              movementType === "distribucion") && (
              <>
                <Grid item xs={12} md={3}><h3>Productos: {totalProducts}</h3></Grid>
                <Grid item xs={12} md={3}>
                  <Select fullWidth size="small" value={selectedStore}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">Selecciona un destino</MenuItem>
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        <b>{store.name} ({store.store_type_display})</b>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Select fullWidth size="small" value={confirmedStore}
                    onChange={handleSelectChange2}
                  >
                    <MenuItem value="">Confirma el destino</MenuItem>
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name} ({store.store_type_display})
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <CustomButton
                    onClick={() =>
                      movementType === "traspaso"
                        ? handleTranserFromCart(cart)
                        : handleDistributionFromCart(cart)
                    }
                    disabled={!selectedStore || selectedStore !== confirmedStore}
                    fullWidth
                    startIcon={<SendIcon />}
                  >
                    {movementType === "traspaso" ? "Transferir" : "Distribuir"}
                  </CustomButton>
                </Grid>
              </>
            )}

            {movementType === "agregar" && (
              <>
                <Grid item xs={12} md={9}></Grid>
                <Grid item xs={12} md={3}>
                  <CustomButton
                    fullWidth
                    onClick={() => handleAddToStock(cart)}
                    startIcon={<AddCircleIcon />}
                  >
                    Añadir
                  </CustomButton>
                </Grid>
              </>
            )}
          </Grid>
        )}
        <SimpleTable
          noDataComponent="Sin productos"
          data={cart}
          columns={getColumns()}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default Cart;
