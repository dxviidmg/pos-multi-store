import React from 'react';
import { useSelector } from 'react-redux';
import CustomTable from '../commons/customTable'; // Si ya tienes una tabla personalizada, la usaremos

const Cart = () => {
  // Obtenemos el carrito del estado de Redux
  const cart = useSelector((state) => state.cartReducer.cart);

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cart.length > 0 ? (
        <CustomTable
          title="Productos en el Carrito"
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
                selector: (row) => (
                  <div>
                    <input type="number" min="1" max={row.quantity} value="1"/>
                  </div>
                ),
              },


            {
              name: "Total",
              selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`, // Multiplicamos el precio por la cantidad
              sortable: true,
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
