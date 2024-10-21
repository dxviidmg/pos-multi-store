import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'; 
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import Searcher from "../commons/searcher/Searcher";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../../cartActions";

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState({});
  const [quantities, setQuantities] = useState([]); // Almacenar las cantidades por ID de producto
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchData = async () => {
      console.log(query);

      if (query) {
        const response = await getStoreProducts(query);
        setOptions(response.data);
        console.log(response.data)
      } else {
        setOptions([]);
      }
    };

    fetchData();
  }, [query]);

  // Función para manejar la adición de un producto al carrito
  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1; // Usar la cantidad almacenada o 1 si no existe
    const productWithQuantity = { ...product, quantity }; // Incluir la cantidad en el producto
    dispatch(addToCart(productWithQuantity)); // Despachar la acción con el producto como payload
  };

  // Función para manejar el cambio en la cantidad
  const handleQuantityChange = (id, value, max) => {


    if ( value > max){
      return
    }

    setQuantities((prev) => ({
      ...prev,
      [id]: value, // Limitar el valor
    }));

    console.log(quantities)
  };

  return (
    <>
      <Searcher setQuery={setQuery} title="Productos" inputPlaceholder="Nombre o código" />
      <CustomTable
        inputPlaceholder="Buscar producto"
        title="Productos"
        data={options}
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
                <input 
                  type="number" 
                  id={`quantity-${row.id}`} 
                  name="quantity" 
                  min="1" 
                  max={row.stock} 
                  value={quantities[row.id] || ''} // Usar el valor almacenado o 1 como predeterminado
                  onChange={(e) => handleQuantityChange(row.id, Number(e.target.value), row.stock)} // Manejar el cambio
                />
              </div>
            ),
          },
          {
            name: "Acciones",
            selector: (row) => (
              <div>
                <CustomButton onClick={() => handleAddToCart(row)} disabled={row.stock === 0}> 
                  Añadir
                </CustomButton>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default SearchProduct;
