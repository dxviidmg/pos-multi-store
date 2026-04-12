import { logger } from "../../../utils/logger";
import { showSuccess } from "../../../utils/alerts";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomModal from "../../ui/Modal/Modal";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import { createTransfer } from "../../../api/transfers";
import { addProducts } from "../../../api/products";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getStockOtherStores } from "../../../api/products";
import { addToCart, updateMovementType } from "../../../redux/cart/cartActions";
import { Grid, TextField, Box, Typography, Alert, Chip, Divider } from "@mui/material";


const StockModal = ({ isOpen, product, onClose }) => {
  const storeProduct = product || {};
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);
  const dispatch = useDispatch();

  const [requestedQuantities, setRequestedQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [stockOtherStores, setStockOtherStores] = useState([])
  const [initialStock, setInitialStock] = useState("1")

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


  const handleQuantityChange = (rowId, max, value) => {
    const quantity = Math.min(parseInt(value) || 0, max);
    setRequestedQuantities((prev) => ({ ...prev, [rowId]: quantity }));
  };


  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getStockOtherStores(storeProduct.id);
      setStockOtherStores(response.data);
    };
  
    if (storeProduct?.product?.code) {
      fetchData();
    }
  }, [storeProduct?.product?.code]);


  const handleAddStock = async () => {
    if (!initialStock || parseInt(initialStock) <= 0) return;
    setIsLoading(true);
    try {
      const quantity = parseInt(initialStock);
      await addProducts({
        store_products: [{ id: storeProduct.id, quantity }],
      });
      showSuccess(`Stock agregado: ${quantity} unidades`);
      // Cambiar a tipo "agregar" y agregar al carrito con stock actualizado
      dispatch(updateMovementType("agregar"));
      dispatch(addToCart({ 
        ...storeProduct, 
        quantity,
        available_stock: (storeProduct.available_stock || 0) + quantity 
      }));
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
    if (!storeProduct.showImage) {
      if (storeProduct.available_stock === 0) {
        return (
          <Alert severity="error" sx={{ mb: 1, width: "100%" }}>
            Producto no disponible en esta tienda
          </Alert>
        );
      }
      if (!storeProduct.onlyRead) {
        return (
          <Box sx={{ mb: 2, width: "100%" }}>
            <Alert severity="warning" sx={{ mb: 1, width: "100%" }}>
              Has alcanzado el límite de este producto en esta tienda
            </Alert>
            {reservedInOtherCarts > 0 && (
              <Chip 
                icon={<span>⚠️</span>} 
                label={`${reservedInOtherCarts} unidades reservadas en otros carritos`} 
                color="warning" 
                variant="outlined" 
                size="small" 
              />
            )}
          </Box>
        );
      }
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
      <Grid container className="modal-content" sx={{ p: 2 }}>
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
          <>
            {stockOtherStores.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Ver stock en otras tiendas y solicitar producto" size="small" />
                </Divider>
                <SimpleTable
                  noDataComponent="Sin stock en otras tiendas"
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
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Agrega stock aquí y se añadirá directamente al carrito." size="small" />
              </Divider>
              <Box sx={{ py: 2, px: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
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
            </Grid>
          </>

        )}

      

      </Grid>
    </CustomModal>
    </> 

  );
};

export default StockModal;
