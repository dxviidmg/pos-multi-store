import React, { useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { hideStockModal } from "../redux/stockModal/StockModalActions";
import { createTransfer } from "../apis/transfers";

const StockModal = () => {
  const { showStockModal, product } = useSelector(
    (state) => state.StockModalReducer
  );

  const dispatch = useDispatch();

  const [requestedQuantities, setRequestedQuantities] = useState({});

  const handleQuantityChange = (rowId, max, value) => {
    value = parseInt(value);

    if (value > max) {
      value = max;
    }
    setRequestedQuantities((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  };

  const handleCreateTransfer = async (row) => {
    const quantity = requestedQuantities[row.store_id];

    const data = {
      quantity: quantity,
      origin_store: row.store_id,
      destination_store: product.store,
      product: product.product_id,
    };

    const response = await createTransfer(data);

    if (response.status === 201) {
      setRequestedQuantities({});
      dispatch(hideStockModal());
    }
  };
  return (
    <CustomModal showOut={showStockModal} title="Revisión de Stock">
      <div className="text-center">
        <p>
          <b>Código:</b> {product.product_code} <b>Nombre:</b>{" "}
          {product.description}
        </p>

        {product.available_stock === 0 ? (
          <p>
            <b>Nota:</b> Producto no disponible
          </p>
        ) : product.available_stock !== 0 && !product.onlyRead ? (
          <p>
            <b>Nota:</b> Has alcancado el limite de este producto en esta tienda
          </p>
        ) : null}
      </div>

      {product.stock_in_other_stores &&
        product.stock_in_other_stores.length > 0 && (
          <CustomTable
            data={product.stock_in_other_stores}
            columns={[
              {
                name: "Locación",
                selector: (row) => row.store_name,
                sortable: true,
              },
              {
                name: "Stock disponible",
                selector: (row) => row.available_stock,
                sortable: true,
              },

              {
                name: "Cantidad a solicitar",
                selector: (row) => (
                  <Form.Control
                    type="number"
                    name="quantity"
                    required
                    min={1}
                    max={row.available_stock}
                    placeholder="Cantidad a solicitar"
                    onChange={(e) =>
                      handleQuantityChange(
                        row.store_id,
                        row.available_stock,
                        e.target.value
                      )
                    }
                    value={requestedQuantities[row.store_id]}
                  />
                ),
                sortable: true,
              },
              {
                name: "Solicitar",
                selector: (row) => (
                  <CustomButton
                    disabled={
                      !requestedQuantities[row.store_id] ||
                      requestedQuantities[row.store_id] <= 0
                    }
                    onClick={() => handleCreateTransfer(row)}
                  >
                    Solicitar
                  </CustomButton>
                ),
                sortable: true,
              },
            ]}
          />
        )}
    </CustomModal>
  );
};

export default StockModal;
