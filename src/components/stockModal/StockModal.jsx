import React from 'react'
import CustomModal from '../commons/customModal/customModal'
import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'


const StockModal = () => {
    const showStockModal = useSelector((state) => state.StockModalReducer.showStockModal);
    const product = useSelector((state) => state.StockModalReducer.product);

    console.log(product)
    return (
    <CustomModal showOut={showStockModal} title="Revision de stock">
    <p className="text-center">
      <b>Código:</b> {product.product_code} <b>Nombre:</b> {product.description}
    </p>

    {product.stock === 0 ? (
      <p className="text-center">
        <b>Nota:</b> No hay stock de este producto en la tienda
      </p>
    ) : ''}

{product.stock !== 0 && !product.onlyRead ? (
      <p className="text-center">
        <b>Nota:</b> Ya llegaste al limite de productos existentes
      </p>
    ) : ''}


    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Tienda/Almacen</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>

        {product.stock_in_other_stores && (product.stock_in_other_stores.map((stock, index) => (
          <tr key={index}>
            <td>{stock.store_name}</td>
            <td>{stock.stock}</td>
          </tr>
        )))}
      </tbody>
    </Table>
  </CustomModal>
  )
}

export default StockModal
