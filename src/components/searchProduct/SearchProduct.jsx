import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart } from "../redux/cart/cartActions";
import { Form, Table } from "react-bootstrap";
import { debounce } from "lodash"; // Ensure you install lodash
import CustomModal from "../commons/customModal/customModal";

const SearchProduct = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);

  // State variables
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [barcode, setBarcode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productStock, setProductStock] = useState({
    code: "",
    name: "",
    stock: "",
    stock_in_other_stores: [],
  });
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
    if (product.stock === 0) {
      handleOpenModal(product);
    } else {
      handleAddToCartIfAvailable(product);
    }
    setQuery(""); // Clear the query after fetching
  };

  const handleAddToCartIfAvailable = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex === -1) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    } else {
      const productExists = cart[existingProductIndex];
      if (productExists.quantity < product.stock) {
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else {
        handleOpenModal(product);
      }
    }
  };

  useEffect(() => {
    if (query) {
      fetchData();
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
    setShowModal(false);
    setTimeout(() => setShowModal(true), 1);
    setProductStock({
      code: row.product_code,
      name: row.description,
      stock: row.stock,
      stock_in_other_stores: row.stock_in_other_stores,
    });
  };

  return (

    <>
      <CustomModal showOut={showModal} title="Revision de stock">
        <p className="text-center">
          <b>Código:</b> {productStock.code} <b>Nombre:</b> {productStock.name}
        </p>

        {productStock.stock === 0 ? (
          <p className="text-center">
            <b>Nota:</b> No hay stock de este producto en la tienda
          </p>
        ) : (
          <p className="text-center">
            <b>Nota:</b> Si, estas intentando añadir, productos. Ya llegaste al límite de stock de este producto en esta
            tienda
          </p>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tienda/Almacen</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productStock.stock_in_other_stores.map((stock, index) => (
              <tr key={index}>
                <td>{stock.store_name}</td>
                <td>{stock.stock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CustomModal>
      
      <Form.Label>Buscador de productos</Form.Label>
      <br />
      <Form.Label style={{ marginRight: "30px" }}>Tipo de búsqueda:</Form.Label>

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
          { name: "Descripción", cell: (row) => <div>{row.description}</div> },
          {
            name: "Stock",
            selector: (row) => row.stock,
          },
          {
            name: "Precio unitario",
            selector: (row) => `$${row.prices.unit_sale_price.toFixed(2)}`,
          },
          {
            name: "Precio mayoreo",
            selector: (row) =>
              row.prices.apply_wholesale
                ? `${row.prices.min_wholesale_quantity} o más a $${row.prices.wholesale_sale_price.toFixed(2)}`
                : "N/A",
          },
          {
            name: "Añadir",
            cell: (row) => (
              <CustomButton
                onClick={() => handleAddToCartIfAvailable(row)}
                disabled={row.stock === 0}
                variant="primary"
              >
                Añadir
              </CustomButton>
            ),
          },
          {
            name: "Stock en otras tiendas",
            cell: (row) => (
              <CustomButton
                onClick={() => handleOpenModal(row)}
                disabled={row.stock === 0}
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
