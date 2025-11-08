import React, { useEffect, useState } from "react";
import { Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../commons/customModal/customModal";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { hideStockModal } from "../redux/stockModal/StockModalActions";
import { createTransfer } from "../apis/transfers";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";
import { getStockOtherStores } from "../apis/products";


const StockModal = () => {
  const { showStockModal, storeProduct } = useSelector((state) => state.StockModalReducer);
  const [requestedQuantities, setRequestedQuantities] = useState({});
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const [stockOtherStores, setStockOtherStores] = useState([])


  const handleQuantityChange = (rowId, max, value) => {
    const quantity = Math.min(parseInt(value) || 0, max);
    setRequestedQuantities((prev) => ({ ...prev, [rowId]: quantity }));
  };


  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getStockOtherStores(storeProduct.product?.code);
      setStockOtherStores(response.data)
      console.log(response);
    };
  
    if (storeProduct && storeProduct.product) {
      fetchData();
    }
  }, [storeProduct]);



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
      console.error("Error creating transfer:", error);
    }
  };

  const renderStockInfo = () => {
    if (!storeProduct.showImage) {
      if (storeProduct.available_stock === 0) {
        return <p><b>Nota:</b> Producto no disponible</p>;
      }
      if (!storeProduct.onlyRead) {
        return <p><b>Nota:</b> Has alcanzado el límite de este producto en esta tienda</p>;
      }
    }
    return null;
  };

  return (
   <>
        <CustomSpinner2 isLoading={isLoading}></CustomSpinner2>
       <CustomModal showOut={showStockModal} title="Revisión de Stock">
      <div className="text-center custom-section">
        <p>
          <b>Código:</b> {storeProduct.product?.code} <b>Nombre:</b> {storeProduct.product?.brand_name} {storeProduct.product?.name}
        </p>
        {renderStockInfo()}

      {storeProduct.showImage ? (
        <Row className="justify-content-center">
          <Col md={3}>
            <Image src={storeProduct.product?.image} fluid />
          </Col>
        </Row>
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
                  <Form.Control
                    type="number"
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
