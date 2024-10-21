import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'; // Importar useDispatch
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import Searcher from "../commons/searcher/Searcher";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../../cartActions";


const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch(); // Crear la instancia de dispatch

  useEffect(() => {
    const fetchData = async () => {
      console.log(query);

      if (query) {
        const response = await getStoreProducts(query);
        setOptions(response.data);
      } else {
        setOptions([]);
      }
    };

    fetchData();
  }, [query]);

  // Función para manejar la adición de un producto al carrito
  const handleAddToCart = (product) => {
    console.log(product)
    dispatch(addToCart(product)); // Despachar la acción con el producto como payload
  };

  return (
    <>
      <Searcher setQuery={setQuery} title="Productos" inputPlaceholder="Nombre o codigo" />
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
                <input type="number" id="quantity" name="quantity" min="1" max={row.quantity} value="1"/>
              </div>
            ),
          },
  
          {
            name: "Acciones",
            selector: (row) => (
              <div>
                <CustomButton onClick={() => handleAddToCart(row)}> 
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
