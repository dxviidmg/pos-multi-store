import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../commons/customTable';
import { removeFromCart } from '../redux/cart/cartActions';
import CustomButton from '../commons/customButton/CustomButton';
import { Col, Row } from 'react-bootstrap';

const Cart = () => {

  const cart = useSelector((state) => state.cartReducer.cart);
  const clientSelected = useSelector((state) => state.clientSelectedReducer.client);
  console.log('clientSelected', clientSelected)
  const dispatch = useDispatch(); 

  const handleRemoveToCart = (product) => {
    dispatch(removeFromCart(product));
  };

  // Calcular el total del carrito
  const total = cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0);


  const total_with_discount = total * (clientSelected.discount?.discount_percentage_complement /100)

  return (
    <div>
      {cart.length > 0 ? (
        <div>
            <Row>
              <Col md={4}>          <h1>Compra actual</h1></Col>
              <Col md={3}>          <h2>Total: ${total.toFixed(2)}</h2></Col>
              <Col md={5}>                    {Object.keys(clientSelected).length > 0
        ?           <h2>Total con descuento: ${total_with_discount.toFixed(2)}</h2>
        : ''
      }</Col>
            </Row>

          <h3></h3>
          {}




          <CustomTable
            data={cart}
            columns={[
              {
                name: "Código",
                selector: (row) => row.product_code,
                sortable: true,
              },
              {
                name: "Descripcion",
                selector: (row) => row.description,
                sortable: true,
              },
              {
                name: "Stock",
                selector: (row) => row.stock,
                sortable: true,
              },
              {
                name: "Precio",
//                selector: (row) => `$${row.product_price.toFixed(2)}`,
                selector: (row) => row.product_price,
                sortable: true,
              },
              {
                name: "Cantidad a vender",
                selector: (row) => row.quantity,
                sortable: true,
              },
              {
                name: "Total por producto",
                selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`, // Calcular el total por producto
                sortable: true,
              },
              {
                name: "Acciones",
                selector: (row) => (
                  <div>
                    <CustomButton onClick={() => handleRemoveToCart(row)}> 
                      Borrar
                    </CustomButton>
                  </div>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default Cart;
