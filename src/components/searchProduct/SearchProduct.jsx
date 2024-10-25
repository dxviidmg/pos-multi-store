import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../redux/cart/cartActions";
import { Form } from "react-bootstrap";

const SearchProduct = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState("");

  const fetchData = useCallback(async () => {
    if (!query) {
      setData([]);
      return;
    }

    const response = await getStoreProducts(queryType, query);
    const fetchedData = response.data;

    if (queryType === "code" && fetchedData.length === 1) {
      dispatch(addToCart({ ...fetchedData[0], quantity: 1 }));
      setQuery("");
    } else {
      setData(fetchedData);
    }
  }, [query, queryType, dispatch]);

  useEffect(() => {
    // Solo llama a fetchData si hay un query
    if (query) {
      fetchData();
    }
  }, [fetchData, query]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
    setQuery(""); // Reinicia el query cuando cambias el tipo
    setData([]); // Limpia los resultados
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && queryType === "code") {
      // Solo busca si el tipo de consulta es código
      console.log("Código escaneado:", barcode);
      setQuery(barcode); // Actualiza el query con el código escaneado
      setBarcode(""); // Limpia el campo de código de barras
    }
  };

  const handleChange = async (e) => {
    setQuery(e.target.value);

    // Solo llama a fetchData si el tipo de consulta es "q"
    if (queryType === "q") {
      const response = await getStoreProducts(queryType, e.target.value);
      const fetchedData = response.data;
      setData(fetchedData);
    }
  };

  return (
    <>
      <Form.Label>Tipo de búsqueda</Form.Label>
      <Form.Check
        inline
        id="code"
        label="Código"
        type="radio"
        onChange={handleQueryTypeChange}
        value="code"
        checked={queryType === "code"}
      />
      <Form.Check
        inline
        id="description"
        label="Descripción (Manual)"
        type="radio"
        onChange={handleQueryTypeChange}
        value="q"
        checked={queryType === "q"}
      />
      <br></br>
      <Form.Label>Buscador de productos</Form.Label>


      <Form.Control
        type="text"
        value={queryType === "code" ? barcode : query} // Usa barcode si es código
        placeholder="Buscar producto"
        onChange={queryType === "q" ? handleChange : (e) => setBarcode(e.target.value)} // Cambia el valor del input según el tipo
        onKeyDown={queryType === "code" ? handleKeyDown : undefined} // Solo activa si queryType es "code"
      />

      <CustomTable
        inputPlaceholder="Buscar producto"
        title="Productos"
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product_code },
          { name: "Descripción", cell: (row) => <div>{row.description}</div> },
          { name: "Stock", selector: (row) => row.stock },
          {
            name: "Precio unitario",
            selector: (row) => row.prices.unit_sale_price,
          },
          {
            name: "Precio mayoreo",
            selector: (row) =>
              row.prices.apply_wholesale
                ? `${row.prices.min_wholesale_quantity} o más a ${row.prices.wholesale_sale_price}`
                : "",
          },
          {
            name: "Acciones",
            selector: (row) => (
              <CustomButton
                onClick={() => handleAddToCart(row)}
                disabled={row.stock === 0}
              >
                Añadir
              </CustomButton>
            ),
          },
        ]}
      />
    </>
  );
};

export default SearchProduct;
