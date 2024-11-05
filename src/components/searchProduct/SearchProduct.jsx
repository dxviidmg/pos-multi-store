import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart, cleanCart } from "../redux/cart/cartActions";
import { Form } from "react-bootstrap";
import { debounce } from "lodash";
import StockModal from "../stockModal/StockModal";
import {
  hideStockModal,
  showStockModal,
} from "../redux/stockModal/StockModalActions";
import Swal from "sweetalert2";
import { updateMovement } from "../redux/movementType/movementTypeActions";

const SearchProduct = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector(
    (state) => state.movementTypeReducer.movementType
  );

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [barcode, setBarcode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchData = useCallback(
    debounce(async () => {
      if (!query) {
        setData([]);
        return;
      }
      const response = await getStoreProducts(queryType, query);
      const fetchedData = response.data;

      if (queryType === "code" && fetchedData.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Producto no encontrado",
          text: "No se pudo encontrar este producto mediante su código",
          timer: 1000,
        });
      } else if (queryType === "code" && fetchedData.length === 1) {
        handleSingleProductFetch(fetchedData[0]);
      } else {
        setData(fetchedData);
      }
    }, 300),
    [query, queryType, movementType]
  );

  const handleSingleProductFetch = (product) => {
    if (
      (movementType === "compra" && product.available_stock === 0) ||
      (movementType === "traspaso" && product.reserved_stock === 0)
    ) {
      handleOpenModal(product);
    } else {
      handleAddToCartIfAvailable(product);
    }
    setQuery("");
  };

  const handleAddToCartIfAvailable = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    const quantity = product.quantity || 1;

    if (existingProductIndex === -1) {
      const stock = movementType === "traspaso" ? product.reserved_stock : product.available_stock;
      if (quantity < stock) {
        dispatch(addToCart({ ...product, quantity: 1, movement_type: movementType }));
      } else {
        displayStockLimitAlert();
      }
    } else {
      const existingProduct = cart[existingProductIndex];
      const stock = movementType === "traspaso" ? product.reserved_stock : product.available_stock;

      if (existingProduct.quantity < stock) {
        dispatch(addToCart({ ...product, quantity: 1, movement_type: movementType }));
      }
      else if (movementType == "compra" && existingProduct.quantity >= stock) {
        handleOpenModal(existingProduct);
      }
      else {
        displayStockLimitAlert();
      }
    }
  };

  const displayStockLimitAlert = () => {
    Swal.fire({
      icon: "error",
      title: movementType === "traspaso"
        ? "Llegaste al límite de producto reservado para traspasar"
        : "No hay suficiente stock para comprar",
      timer: 2000,
    });
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

  const handleQueryTypeChange = (e) => {
    setQueryType(e.target.value);
    setQuery("");
    setData([]);
  };

  const handleMovementTypeChange = (e) => {
    dispatch(updateMovement(e.target.value));
    setData([]);
    dispatch(cleanCart());
  };

  const handleBarcodeSearch = (event) => {
    if (event.key === "Enter") {
      setQuery(barcode);
      setBarcode("");
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    if (queryType === "q") fetchData();
  };

  const handleOpenModal = (product) => {
    dispatch(hideStockModal());
    setTimeout(() => dispatch(showStockModal(product)), 1);
  };

  return (
    <>
      <StockModal />
      <Form.Label className="fw-bold">Buscador de productos</Form.Label>
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
      <Form.Label className="me-3">Tipo de operación:</Form.Label>
      <Form.Check
        inline
        id="compra"
        label="Compra"
        type="radio"
        onChange={handleMovementTypeChange}
        value="compra"
        checked={movementType === "compra"}
      />
      <Form.Check
        inline
        id="traspaso"
        label="Traspaso"
        type="radio"
        onChange={handleMovementTypeChange}
        value="traspaso"
        checked={movementType === "traspaso"}
      />
      <br />
      <Form.Label className="fw-bold">
        {!isInputFocused && "Aviso: Para añadir productos al carrito el cursor debe estar en el campo de búsqueda de productos."}
      </Form.Label>
      <br />
      <Form.Control
        ref={inputRef}
        type="text"
        value={queryType === "code" ? barcode : query}
        placeholder="Buscar producto"
        onChange={queryType === "q" ? handleQueryChange : (e) => setBarcode(e.target.value)}
        onKeyDown={queryType === "code" ? handleBarcodeSearch : undefined}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <CustomTable
        title="Productos"
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product_code },
          { name: "Descripción", selector: (row) => row.description, grow: 3, wrap: true },
          { name: "Stock", selector: (row) => row.available_stock },
          { name: "Precio unitario", selector: (row) => `$${row.prices.unit_sale_price.toFixed(2)}` },
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
              <CustomButton onClick={() => handleOpenModal({ ...row, onlyRead: true })} variant="danger">
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
