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
  const [quantities, setQuantities] = useState({});
  const [queryType, setQueryType] = useState("code");
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState('');

  const fetchData = useCallback(async () => {
    if (!query) {
      setData([]);
      return;
    }

    if (queryType === "code") await new Promise((resolve) => setTimeout(resolve, 1000));

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
    fetchData();
  }, [fetchData]);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleQuantityChange = (id, value, max) => {
    if (value <= max) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleQueryTypeChange = (e) => setQueryType(e.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Código escaneado:", barcode);
      setBarcode("");
      setQuery(barcode);
    }
  };

  const handleChange = async (e) => {
    if (queryType === "code") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    setQuery(e.target.value);
  };
  

  return (
    <>
      <input
        type="text"
        placeholder="Escanea el código de barras"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={queryType === "code" ? handleKeyDown : undefined}
      />

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

      <Form.Label>Buscador de productos</Form.Label>
      <Form.Control
        type="text"
        value={query}
        placeholder="Buscar producto"
        onChange={handleChange} // Solo activa si queryType es "q"
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
