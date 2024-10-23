import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../commons/customTable'; // Si ya tienes una tabla personalizada, la usaremos
import { removeFromCart } from '../redux/cart/cartActions';
import CustomButton from '../commons/customButton/CustomButton';


const Cart = () => {
  const cart = useSelector((state) => state.cartReducer.cart);
  const dispatch = useDispatch(); 


  const handleRemoveToCart = (product) => {
    dispatch(removeFromCart(product)); // Despachar la acción con el producto como payload
  };


  return (
    <div>
      {cart.length > 0 ? (
        <CustomTable
          data={cart} // Pasamos los productos en el carrito
          columns={[


            {
                name: "Codigo",
                selector: (row) => row.product_code,
                sortable: true,
              },
              {
                name: "Nombre",
                selector: (row) => row.product_name,
                sortable: true,
              },
              {
                name: "Marca",
                selector: (row) => row.brand_name,
                sortable: true,
              },
              {
                name: "Categoria",
                selector: (row) => row.category_name,
                sortable: true,
              },
              {
                name: "Stock",
                selector: (row) => row.stock,
                sortable: true,
              },
    
              {
                name: "Precio",
                selector: (row) => row.product_price,
                sortable: true,
              },

              {
                name: "Cantidad a vender",
                selector: (row) => row.quantity,
                sortable: true,
              },


            {
              name: "Total",
              selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`, // Multiplicamos el precio por la cantidad
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
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default Cart;
