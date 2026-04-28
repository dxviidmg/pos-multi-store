import { logger } from "../../../utils/logger";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { showSuccess, showError } from "../../../utils/alerts";
import { addProducts, getStockOtherStores } from "../../../api/products";
import { getUserData } from "../../../api/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { useModal } from "../../../hooks/useModal";
import { Grid, Select, MenuItem } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import SendIcon from "@mui/icons-material/Send";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { MOVEMENT_TYPES, STORE_TYPES } from "../../../constants";
import { getSaleColumns, getTransferColumns, getDistributionColumns, getAddToStockColumns } from "./cartColumns";

const Cart = ({ searchInputRef }) => {
  const store_type = getUserData().store_type;
  const dispatch = useDispatch();
  const stockModal = useModal();
  const paymentModal = useModal();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [confirmedStore, setConfirmedStore] = useState("");
  const [loading, setLoading] = useState(false);
  const lastQtyRef = useRef(null);
  const prevCartLenRef = useRef(0);
  
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

  // Auto-focus cantidad del último producto agregado en distribución
  useEffect(() => {
    if (movementType === "distribucion" && cart.length > prevCartLenRef.current) {
      setTimeout(() => {
        if (lastQtyRef.current) {
          lastQtyRef.current.focus();
          lastQtyRef.current.select();
        }
      }, 50);
    }
    prevCartLenRef.current = cart.length;
  }, [cart.length, movementType]);

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
    const response = await getStockOtherStores(product.id);
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
    if (loading) return;
    setLoading(true);

    const data = { transfers: cart, destination_store: selectedStore };
    try {
      const response = await confirmTransfers(data);
      if (response.status === 200) {
        dispatch(cleanCart());
        setLoading(false);
        showSuccess("Traspaso confirmado");
      } else if (response.status === 404) {
        dispatch(cleanCart());
        setLoading(false);
        showError("Traspaso inexistente", "Checa cantidad y/o destino");
      } else {
        setLoading(false);
        showError("Error desconocido", "Por favor llame a soporte técnico");
      }
    } catch (error) {
      setLoading(false);
      showError("Error en la solicitud", error.message);
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
      setConfirmedStore("");
      setTimeout(() => {
        setLoading(false);
      }, 200);
        showSuccess("Distribución creada");
      } else if (response.status === 404) {
        setLoading(false);
        showError("Distribución no encontrada", "Algunos productos no coinciden con la distribución solicitada, ya sea en cantidad o en código.");
      } else {
        setLoading(false);
        showError("Error desconocido", "Por favor llame a soporte técnico");
      }
    } catch (error) {
      setLoading(false);
      showError("Error en la solicitud", error.message);
    }
  };

  const handleAddToStock = async (cart) => {
    if (loading) return;
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
        showSuccess("Producto añadido al inventario");
      } else {
        setLoading(false);
        showError("Error en el inventario", "No se pudo añadir el producto");
      }
    } catch (error) {
      showError("Error en la solicitud", error.message);
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
      renderCell: (params) => (
        <div className="cell-wrap">
          {params.row.product.name}
        </div>
      ),
    },
    { name: "Stock", field: "stock", selector: (row) => row.available_stock },
  ];

  const saleColumns = useMemo(() => getSaleColumns(handleQuantityChangeToCart, handleRemoveFromCart, handleChangePrice, movementType, getAvailableStock), [movementType]);
  const transferColumns = useMemo(() => getTransferColumns(handleQuantityChangeToCart, handleRemoveFromCart, getAvailableStock), []);
  const distributionColumns = useMemo(() => getDistributionColumns(handleQuantityChangeToCart, handleRemoveFromCart, handleStockOtherStores, getAvailableStock, cart, searchInputRef, lastQtyRef), [cart]);
  const addToStockColumns = useMemo(() => getAddToStockColumns(handleQuantityChangeToCart, handleRemoveFromCart), []);

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
                    displayEmpty
                    renderValue={(value) => {
                      if (!value) return <span style={{ color: "#999" }}>Selecciona un destino</span>;
                      const store = stores.find((s) => s.id === value);
                      return store ? <b>{store.name} ({store.store_type_display})</b> : value;
                    }}
                  >
                    <MenuItem value="" disabled>Selecciona un destino</MenuItem>
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
                    displayEmpty
                    renderValue={(value) => {
                      if (!value) return <span style={{ color: "#999" }}>Confirma el destino</span>;
                      const store = stores.find((s) => s.id === value);
                      return store ? `${store.name} (${store.store_type_display})` : value;
                    }}
                  >
                    <MenuItem value="" disabled>Confirma el destino</MenuItem>
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
        />
      </div>
    </div>
  );
};

export default Cart;
