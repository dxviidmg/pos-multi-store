import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../redux/cart/cartActions";
import { Form } from "react-bootstrap";
import { debounce } from "lodash"; // Ensure you install lodash
import StockModal from "../stockModal/StockModal";
import {
  hideStockModal,
  showStockModal,
} from "../redux/stockModal/StockModalActions";

const SearchProduct = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);

  // State variables
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [barcode, setBarcode] = useState("");

  const [isInputFocused, setIsInputFocused] = useState(false);

  // Focus input on component load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handlers for input focus
  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  // Debounced fetch data function
  const fetchData = useCallback(
    debounce(async () => {
      if (!query) {
        setData([]);
        return;
      }

      const response = await getStoreProducts(queryType, query);
      const fetchedData = response.data;

      if (queryType === "code" && fetchedData.length === 1) {
        handleSingleProductFetch(fetchedData[0]);
      } else {
        setData(fetchedData);
      }
    }, 300),
    [query, queryType, dispatch, cart]
  );

  const handleSingleProductFetch = (product) => {
    if (product.available_stock === 0) {
      handleOpenModal(product);
    } else {
      handleAddToCartIfAvailable(product);
    }
    setQuery(""); // Clear the query after fetching
  };

  const handleAddToCartIfAvailable = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex === -1) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    } else {
      const productExists = cart[existingProductIndex];
      if (productExists.quantity < product.available_stock) {
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else {
        handleOpenModal(product);
      }
    }
  };

  useEffect(() => {
    if (query) {
      fetchData();
    } else {
      setData([]);
    }
    return () => {
      fetchData.cancel();
    };
  }, [fetchData, query]);

  // Event handlers
  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
    setQuery(""); // Reset the query when changing type
    setData([]); // Clear results
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && queryType === "code") {
      setQuery(barcode); // Update the query with the scanned code
      setBarcode(""); // Clear the barcode field
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (queryType === "q") {
      fetchData();
    }
  };

  const handleOpenModal = (row) => {
    dispatch(hideStockModal());

    setTimeout(() => dispatch(showStockModal(row)), 1);
  };

  return (
    <>
      <StockModal></StockModal>

      <Form.Label>Buscador de productos</Form.Label>
      <br />
      <Form.Label className="me-3">Tipo de búsqueda:</Form.Label>

      <Form.Check
        inline
        id="code"
        label="Por código de barras"
        type="radio"
        onChange={handleQueryTypeChange}
        value="code"
        checked={queryType === "code"}
      />
      <Form.Check
        inline
        id="description"
        label="Manual (Descripción)"
        type="radio"
        onChange={handleQueryTypeChange}
        value="q"
        checked={queryType === "q"}
      />

      <Form.Label>
        <b>
          {!isInputFocused && (
            <>Aviso: El cursor no está en el campo de búsqueda de productos.</>
          )}
        </b>
      </Form.Label>
      <br />

      <Form.Control
        ref={inputRef}
        type="text"
        value={queryType === "code" ? barcode : query} // Use barcode if queryType is "code"
        placeholder="Buscar producto"
        onChange={
          queryType === "q" ? handleChange : (e) => setBarcode(e.target.value)
        }
        onKeyDown={queryType === "code" ? handleKeyDown : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <CustomTable
        inputPlaceholder="Buscar producto"
        title="Productos"
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product_code },
          { name: "Descripción", selector: (row) => row.description, grow: 3,  wrap: true},
          {
            name: "Stock",
            selector: (row) => row.available_stock,
          },
          {
            name: "Precio unitario",
            selector: (row) => `$${row.prices.unit_sale_price.toFixed(2)}`,
          },
          {
            name: "Precio mayoreo",
            selector: (row) =>
              row.prices.apply_wholesale
                ? `${
                    row.prices.min_wholesale_quantity
                  } o más a $${row.prices.wholesale_sale_price.toFixed(2)}`
                : "N/A",
          },
          {
            name: "Añadir",
            cell: (row) => (
              <CustomButton
                onClick={() => handleAddToCartIfAvailable(row)}
                disabled={row.available_stock === 0}
                variant="primary"
              >
                Añadir
              </CustomButton>
            ),
          },
          {
            name: "Stock total",
            cell: (row) => (
              <CustomButton
                onClick={() => handleOpenModal({ ...row, onlyRead: true })}
                variant="danger"
              >
                Ver
              </CustomButton>
            ),
          },
        ]}
      />
    </>
  );
};

export default SearchProduct;
