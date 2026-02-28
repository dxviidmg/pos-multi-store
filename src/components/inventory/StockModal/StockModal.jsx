import { logger } from "../../../utils/logger";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../ui/Modal/Modal";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import { hideStockModal } from "../../../redux/stockModal/StockModalActions";
import { createTransfer } from "../../../api/transfers";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getStockOtherStores } from "../../../api/products";
import { Grid, TextField } from "@mui/material";


const StockModal = () => {
  const { showStockModal, storeProduct } = useSelector((state) => state.StockModalReducer);
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);

  logger.log('showStockModal', showStockModal)
  const [requestedQuantities, setRequestedQuantities] = useState({});
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const [stockOtherStores, setStockOtherStores] = useState([])

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
      const response = await getStockOtherStores(storeProduct.product?.code);
      setStockOtherStores(response.data);
    };
  
    if (storeProduct?.product?.code) {
      fetchData();
    }
  }, [storeProduct?.product?.code]);



  const handleCreateTransfer = async (row) => {
    setIsLoading(true)
    try {
      const quantity = requestedQuantities[row.store_id];
      const data = {
        quantity,
        origin_store: row.store_id,
        destination_store: storeProduct.store.id,
        product: storeProduct.product.id,
      };

      const response = await createTransfer(data);
      if ([201, 202].includes(response.status)) {
        setRequestedQuantities({});
        dispatch(hideStockModal());
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
        return <p><b>Nota:</b> Producto no disponible</p>;
      }
      if (!storeProduct.onlyRead) {
        return (
          <>
            <p><b>Nota:</b> Has alcanzado el límite de este producto en esta tienda</p>
            {reservedInOtherCarts > 0 && (
              <p style={{ color: '#ff9800', fontWeight: 'bold' }}>
                ⚠️ Hay {reservedInOtherCarts} unidades reservadas en otros carritos activos
              </p>
            )}
          </>
        );
      }
    }
    return null;
  };

  return (
   <>
        <CustomSpinner isLoading={isLoading}></CustomSpinner>
       <CustomModal 
         showOut={showStockModal} 
         onClose={() => dispatch(hideStockModal())}
         title="Revisión de Stock"
       >
      <div className="text-center custom-section">
        <p>
          <b>Código:</b> {storeProduct.product?.code} <b>Nombre:</b> {storeProduct.product?.brand_name} {storeProduct.product?.name}
        </p>
        {renderStockInfo()}

      {storeProduct.showImage ? (
        <Grid container spacing={2} className="justify-content-center">
          <Grid item xs={12} md={3}>
            <Image src={storeProduct.product?.image} fluid />
          </Grid>
        </Grid>
      ) : (
        stockOtherStores.length > 0 && (
          <CustomTable
            data={stockOtherStores}
            columns={[
              { name: "Locación", selector: (row) => row.store_name, sortable: true },
              { name: "Stock disponible", selector: (row) => row.available_stock, sortable: true },
              {
                name: "Cantidad a solicitar",
                selector: (row) => (
                  <TextField size="small" fullWidth type="number"
                    name="quantity"
                    min={1}
                    max={row.available_stock}
                    placeholder="Cantidad a solicitar"
                    onChange={(e) => handleQuantityChange(row.store_id, row.available_stock, e.target.value)}
                    value={requestedQuantities[row.store_id] || 0}
                  />
                ),
                sortable: true,
              },
              {
                name: "Solicitar",
                selector: (row) => (
                  <CustomButton
                    disabled={!requestedQuantities[row.store_id] || requestedQuantities[row.store_id] <= 0}
                    onClick={() => handleCreateTransfer(row)}
                  >
                    Solicitar
                  </CustomButton>
                ),
                sortable: true,
              },
            ]}
          />
        )
      )}

      

      </div>
    </CustomModal></> 

  );
};

export default StockModal;
