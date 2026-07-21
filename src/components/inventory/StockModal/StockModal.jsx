import { logger } from "../../../utils/logger";
import { showSuccess } from "../../../utils/alerts";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCarts, selectActiveCartId } from "../../../redux/cart/selectors";
import CustomModal from "../../ui/Modal/Modal";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import { createTransfer } from "../../../api/transfers";
import { addProducts } from "../../../api/products";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getStockOtherStores } from "../../../api/products";
import { addToCart, updateMovementType, updateQuantityInCart } from "../../../redux/cart/cartActions";
import { Grid, TextField, Box, Alert, Chip, Tabs, Tab } from "@mui/material";


const StockModal = ({ isOpen, product, onClose }) => {
  const storeProduct = product || {};
  const carts = useSelector(selectCarts);
  const activeCartId = useSelector(selectActiveCartId);
  const dispatch = useDispatch();

  const [requestedQuantities, setRequestedQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [stockOtherStores, setStockOtherStores] = useState([])
  const [initialStock, setInitialStock] = useState("1")
  const [tabValue, setTabValue] = useState(0);

  // Calcular stock reservado en otros carritos
  const getReservedInOtherCarts = () => {
    if (carts.length <= 1) return 0;
    
    return carts.reduce((total, cart) => {
      if (cart.id === activeCartId) return total;
      const item = cart.cart.find(item => item.id === storeProduct.id);
      return total + (item ? item.quantity : 0);
    }, 0);
  };
  
  const reservedInOtherCarts = getReservedInOtherCarts();

  const storesWithStock = stockOtherStores.filter(s => (s.available_stock || 0) > 0).length;

  useEffect(() => {
    if (storesWithStock > 0) {
      setTabValue(0);
    } else if (stockOtherStores.length > 0) {
      setTabValue(0);
    } else {
      setTabValue(1);
    }
  }, [storesWithStock, stockOtherStores.length]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getStockOtherStores(storeProduct.id);
        setStockOtherStores(response.data);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isOpen && storeProduct?.product?.code) {
      fetchData();
    }
  }, [isOpen, storeProduct?.product?.code]);


  const handleQuantityChange = (rowId, max, value) => {
    const quantity = Math.min(parseInt(value) || 0, max);
    setRequestedQuantities((prev) => ({ ...prev, [rowId]: quantity }));
  };

  const handleAddStock = async () => {
    if (!initialStock || parseInt(initialStock) <= 0) return;
    setIsLoading(true);
    try {
      const quantity = parseInt(initialStock);
      await addProducts({
        store_products: [{ id: storeProduct.id, quantity }],
      });
      showSuccess(`Stock agregado: ${quantity} unidades`);
      dispatch(updateMovementType("venta"));
      
      const activeCart = carts.find(c => c.id === activeCartId);
      const existingItem = activeCart?.cart.find(item => item.id === storeProduct.id);
      
      if (existingItem) {
        // Si ya existe, actualizar cantidad y stock
        const newQuantity = existingItem.quantity + quantity;
        const updatedProduct = {
          ...existingItem.product,
          available_stock: (existingItem.available_stock || 0) + quantity
        };
        dispatch(updateQuantityInCart({ ...updatedProduct, id: storeProduct.id }, newQuantity));
      } else {
        // Si no existe, agregar al carrito
        dispatch(addToCart({ 
          ...storeProduct, 
          quantity,
          available_stock: quantity
        }));
      }
      setInitialStock("1");
      onClose();
    } catch (error) {
      logger.error("Error adding stock:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleCreateTransfer = async (row) => {
    setIsLoading(true)
    try {
      const quantity = requestedQuantities[row.store_id];
      const data = {
        quantity,
        origin_store: row.store_id,
        destination_store: storeProduct.store?.id || storeProduct.store,
        product: storeProduct.product.id,
      };

      const response = await createTransfer(data);
      if ([201, 202].includes(response.status)) {
        showSuccess("Traspaso creado, esperando confirmación");
        setRequestedQuantities({});
        onClose();
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      logger.error("Error creating transfer:", error);
    }
  };

  const renderStockInfo = () => {
      if (!storeProduct.onlyRead) {
        return (
          <Box sx={{ mb: 0, width: "100%" }}>
            {reservedInOtherCarts > 0 && (
              <Alert severity="warning" variant="filled" sx={{ my: 0 }}>
                {`${reservedInOtherCarts} unidad${reservedInOtherCarts > 1 ? 'es' : ''} apartada${reservedInOtherCarts > 1 ? 's' : ''} en otro carrito`}
              </Alert>
            )}
          </Box>
        );
    }
    return null;
  };

  return (
   <>

   
        <CustomSpinner isLoading={isLoading}></CustomSpinner>
       <CustomModal 
         showOut={isOpen} 
         onClose={onClose}
         title={`${storeProduct.product?.code} - ${storeProduct.product?.brand_name} ${storeProduct.product?.name}`}
         maxWidth="sm"
       >
        <CustomSpinner isLoading={isLoading} />
        <Box sx={{ p: 2, bgcolor: "#FFFFFF"}}>
          <Grid container>
            {renderStockInfo()}

        {storeProduct.showImage ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <img
              src={storeProduct.product?.image}
              alt="Producto"
              style={{ maxWidth: 200, borderRadius: 8 }}
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
              <Tab 
                label="Solicitar producto a otra tienda"
              />
              <Tab label="Agregar y vender" />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                {storesWithStock > 0 ? (
                  <SimpleTable
                    noDataComponent="Sin acceso a otras tiendas"
                    data={stockOtherStores}
                    columns={[
                      { name: "Tienda", selector: (row) => row.store_name },
                      { 
                        name: "Stock", 
                        selector: (row) => (
                          <Chip 
                            label={row.available_stock} 
                            color={row.available_stock > 0 ? "success" : "default"} 
                            size="small" 
                            variant="outlined"
                          />
                        )
                      },
                      {
                        name: "Cantidad",
                        width: 100,
                        cell: (row) => (
                          <TextField size="small" fullWidth type="number"
                            name="quantity"
                            min={1}
                            max={row.available_stock}
                            placeholder="Cant"
                            onChange={(e) => handleQuantityChange(row.store_id, row.available_stock, e.target.value)}
                            value={requestedQuantities[row.store_id] || ""}
                          />
                        ),
                      },
                      {
                        name: "Acción",
                        selector: (row) => (
                          <CustomButton
                            size="small"
                            disabled={!requestedQuantities[row.store_id] || requestedQuantities[row.store_id] <= 0}
                            onClick={() => handleCreateTransfer(row)}
                          >
                            Solicitar
                          </CustomButton>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Alert severity="warning" sx={{ py: 2 }}>
                    No hay stock disponible en ninguna otra tienda
                  </Alert>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ pt: 0, pb: 2 }}>
                <Alert severity="info" variant="filled" sx={{ mb: 2 }} >
                  Para productos que existen físicamente en tienda pero su stock en sistema está en cero.
                </Alert>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Cantidad"
                      value={initialStock}
                      onChange={(e) => setInitialStock(e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomButton 
                      onClick={handleAddStock} 
                      disabled={isLoading || !initialStock || parseInt(initialStock) <= 0}
                      fullWidth
                    >
                      Agregar y vender
                    </CustomButton>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        )}

      </Grid>
        </Box>
    </CustomModal>
    </> 

  );
};

export default StockModal;
