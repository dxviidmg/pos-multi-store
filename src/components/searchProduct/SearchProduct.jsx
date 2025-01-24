import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../apis/products";
import { addToCart, updateMovementType } from "../redux/cart/cartActions";
import { Badge, Form } from "react-bootstrap";
import { debounce } from "lodash";
import StockModal from "../stockModal/StockModal";
import {
  hideStockModal,
  showStockModal,
} from "../redux/stockModal/StockModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";


const SearchProduct = () => {
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const store_type = getUserData().store_type;

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
          timer: 5000,
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
    if (movementType === "venta" && product.available_stock === 0) {
      handleOpenModal(product);
    } else if (movementType === "traspaso" && product.reserved_stock === 0) {
      Swal.fire({
        icon: "error",
        title: "Este producto no esta relacionado a algun traspaso",
        timer: 5000,
      });
    } else {
      handleAddToCartIfAvailable(product);
    }
    setQuery("");
  };

  const handleAddToCartIfAvailable = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    const quantity = product.quantity || 0;

    if (existingProductIndex === -1) {
      if (movementType === "agregar") {
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else {
        const stock =
          movementType === "traspaso"
            ? product.reserved_stock
            : product.available_stock;
        if (quantity < stock) {
          dispatch(addToCart({ ...product, quantity: 1 }));
        } else {
          displayStockLimitAlert();
        }
      }
    } else {
      const existingProduct = cart[existingProductIndex];
      const stock =
        movementType === "traspaso"
          ? product.reserved_stock
          : product.available_stock;
      if (movementType === "agregar") {
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else if (existingProduct.quantity < stock) {
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else if (
        movementType === "venta" &&
        existingProduct.quantity >= stock
      ) {
        handleOpenModal(existingProduct);
      } else {
        displayStockLimitAlert();
      }
    }
  };

  const displayStockLimitAlert = () => {
    Swal.fire({
      icon: "error",
      title:
        movementType === "traspaso"
          ? "Llegaste al límite de producto reservado para traspasar"
          : "No hay suficiente stock para vender",
      timer: 5000,
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
    dispatch(updateMovementType(e.target.value));

    setData([]);
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

  const handleShortcut = (event) => {
    if (event.ctrlKey && event.key === "r") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      setQueryType("code");
    }
    if (event.ctrlKey && event.key === "y") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      setQueryType("q");
    }
    if (event.ctrlKey && event.key === "u") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(updateMovementType("venta"));
    }
    if (event.ctrlKey && event.key === "i") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(updateMovementType("traspaso"));
    }
    if (event.ctrlKey && event.key === "o") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(updateMovementType("distribucion"));
    }
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(updateMovementType("agregar"));
    }
    if (event.ctrlKey && event.key === "a") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    // Añadir el listener al montar el componente
    window.addEventListener("keydown", handleShortcut);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);



  return (
    <>
      <StockModal />
      <Form.Label className="fw-bold">Buscador de productos</Form.Label>
      <br />
      <Form.Label className="me-3">Tipo de búsqueda:</Form.Label>
      <Form.Check
        inline
        id="code"
        label="Por código de barras (Ctrl + R)"
        type="radio"
        onChange={handleQueryTypeChange}
        value="code"
        checked={queryType === "code"}
      />
      <Form.Check
        inline
        id="description"
        label="Manual (Descripción) (Ctrl + Y)"
        type="radio"
        onChange={handleQueryTypeChange}
        value="q"
        checked={queryType === "q"}
      />
      <Form.Label className="me-3">Tipo de operación:</Form.Label>
      <Form.Check
        inline
        id="venta"
        label="Venta (Ctrl + U)"
        type="radio"
        onChange={handleMovementTypeChange}
        value="venta"
        checked={movementType === "venta"}
        disabled={store_type === "A"}
      />
      <Form.Check
        inline
        id="traspaso"
        label="Traspaso  (Ctrl + I)"
        type="radio"
        onChange={handleMovementTypeChange}
        value="traspaso"
        checked={movementType === "traspaso"}
        disabled={store_type === "A"}
      />
      <Form.Check
        inline
        id="distribucion"
        label="Distribucion  (Ctrl + O)"
        type="radio"
        onChange={handleMovementTypeChange}
        value="distribucion"
        checked={movementType === "distribucion"}
        disabled={store_type === "T"}
      />
      <Form.Check
        inline
        id="agregar"
        label="Agregar a inventario (Ctrl + P)"
        type="radio"
        onChange={handleMovementTypeChange}
        value="agregar"
        checked={movementType === "agregar"}
      />

      <br />

      {!isInputFocused && (
        <Badge bg="success">
          Aviso: Para añadir productos al carrito el cursor debe estar en el
          campo de búsqueda de productos.
        </Badge>
      )}

      <br />
      <Form.Control
        ref={inputRef}
        type="text"
        value={queryType === "code" ? barcode : query}
        placeholder="Buscar producto (Ctrl + A)"
        onChange={
          queryType === "q"
            ? handleQueryChange
            : (e) => setBarcode(e.target.value)
        }
        onKeyDown={queryType === "code" ? handleBarcodeSearch : undefined}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      <CustomTable
        showNoDataComponent={false}
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product_code },
          {
            name: "Descripción",
            selector: (row) => row.product_description,
            grow: 3,
            wrap: true,
          },
          { name: "Stock", selector: (row) => row.available_stock },
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
            name: "Agregar a venta",
            cell: (row) => (
              <CustomButton
                onClick={() => handleAddToCartIfAvailable(row)}
                disabled={row.available_stock === 0}
                variant="primary"
              >
                Agregar
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
