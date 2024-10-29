import React from 'react';
import CustomModal from '../commons/customModal/customModal';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const StockModal = () => {
  const { showStockModal, product } = useSelector((state) => state.StockModalReducer);

  return (
    <CustomModal showOut={showStockModal} title="Revisión de Stock">
      <div className="text-center">
        <p>
          <b>Code:</b> {product.product_code} <b>Name:</b> {product.description}
        </p>

        {product.stock === 0 ? (
          <p>
            <b>Note:</b> Producto no disponible
          </p>
        ) : product.stock !== 0 && !product.onlyRead ? (
          <p>
            <b>Note:</b> Has alcancado el limite de este producto en esta tienda
          </p>
        ) : null}
      </div>

      {product.stock_in_other_stores && product.stock_in_other_stores.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Locación</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {product.stock_in_other_stores.map((stock, index) => (
              <tr key={index}>
                <td>{stock.store_name}</td>
                <td>{stock.stock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CustomModal>
  );
};

export default StockModal;
