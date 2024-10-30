import React, { useState } from 'react';
import CustomModal from '../commons/customModal/customModal';
import { Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../commons/customTable';
import CustomButton from '../commons/customButton/CustomButton';
import { createTransfer } from '../apis/products';
import { hideStockModal } from '../redux/stockModal/StockModalActions';


const StockModal = () => {
  const { showStockModal, product } = useSelector((state) => state.StockModalReducer);
  console.log(product)

  const dispatch = useDispatch();

  const [requestedQuantities, setRequestedQuantities] = useState({}); // Manejar cantidades solicitadas

  const handleQuantityChange = (rowId, max, value) => {

    console.log('hola')    

    value = parseInt(value);
    console.log(value, max, typeof value, typeof max)


    if (value > max){
      console.log('entro')
      value = max
    }
    setRequestedQuantities((prev) => ({
      ...prev,
      [rowId]: value, // Usamos el ID de la fila como clave
    }));
  };


  const handleCreateTransfer = async (row) => {
    console.log('base', row)
    const quantity = requestedQuantities[row.store_id]; // Usa el ID de la tienda como clave
    console.log('Solicitar cantidad:', quantity);


    const data = {

      "quantity": quantity,
      "origin_store": row.store_id,
      "destination_store": product.store,
      "product": product.product_id
    }

    console.log(data)

    const response = await createTransfer(data);



    if (response.status === 201) {
      setRequestedQuantities({})
      dispatch(hideStockModal());

    }



  }
  return (
    <CustomModal showOut={showStockModal} title="Revisión de Stock">
      <div className="text-center">
        <p>
          <b>Código:</b> {product.product_code} <b>Nombre:</b> {product.description}
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

      {product.stock_in_other_stores && product.stock_in_other_stores.length > 0 && (
  <CustomTable
    data={product.stock_in_other_stores}
    columns={[
      {
        name: "Locación",
        selector: (row) => row.store_name, // Replace `row.total` with the actual field in your data
        sortable: true,
      },
      {
        name: "Stock disponible",
        selector: (row) => row.available_stock, // Replace `row.total` with the actual field in your data
        sortable: true,
      },

      {
        name: "Cantidad a solicitar",
        selector: (row) => 
        <Form.Control 
        type="number" 
        name="quantity" 
        required 
        min={1} // Ejemplo de mínimo 4 dígitos
        max={row.available_stock} // Ejemplo de máximo 8 dígitos
        placeholder="Cantidad a solicitar" 
        onChange={(e) => handleQuantityChange(row.store_id, row.available_stock, e.target.value)}
        value={requestedQuantities[row.store_id]}
        />,
        sortable: true,
      },
      {
        name: "Solicitar",
        selector: (row) => <CustomButton disabled={!requestedQuantities[row.store_id] || requestedQuantities[row.store_id] <= 0} onClick={() => handleCreateTransfer(row)}>Solicitar</CustomButton>,
        sortable: true,
      }
    ]}
  />
)}
    </CustomModal>
  );
};

export default StockModal;
