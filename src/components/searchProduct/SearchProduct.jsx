import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { getStoreProducts } from "../../api/products";
import { addToCart, updateMovementType } from "../../redux/cart/cartActions";
import { Badge } from "react-bootstrap";
import StockModal from "../stockModal/StockModal";
import {
  hideStockModal,
  showStockModal,
} from "../../redux/stockModal/StockModalActions";
import { showSuccess, showError } from "../../utils/alerts";
import Swal from "sweetalert2";
import { getPrinterUrl, getUserData } from "../../api/utils";
import PrintIcon from "@mui/icons-material/Print";
import { handlePrintTicket } from "../../utils/utils";
import { Grid, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";

const SearchProduct = () => {
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const storeType = getUserData().store_type;
  const urlPrinter = getPrinterUrl();
  const supports_reservations = getUserData().supports_reservations;
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [barcode, setBarcode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  async function fetchWithTimeout(query, queryType, maxRetries = 2) {
    let attempts = 0;

    const localString = localStorage.getItem("attempts");
    let local = localString ? JSON.parse(localString) : {};
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    while (attempts <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // ⏱️ 2 segundos

      try {
        
        const response = await getStoreProducts(
          { [queryType]: query },
          { signal: controller.signal }
        );
        
        local[attempts+1] = (local[attempts+1] || 0) + 1;
        localStorage.setItem("attempts", JSON.stringify(local));
        clearTimeout(timeoutId); // cancelar timeout si respondió a tiempo
        return response.data;
  
      } catch (err) {
        clearTimeout(timeoutId);
  
        if (err.name === "CanceledError") {
          console.warn(`Intento ${attempts + 1}: la petición se canceló por timeout`);
          await delay(1000);
          attempts++;
  
          if (attempts > maxRetries) {

            local['Error'] = local['Error'] || [];
            local['Error'].push(query);  // someValue es lo que quieras añadir
            localStorage.setItem("attempts", JSON.stringify(local));
            console.error("❌ Se alcanzó el máximo de reintentos. Abortando.");
            return null;
          }
          // sigue el ciclo → reintenta
        } else {
          // otro error → no reintentar
          throw err;
        }
      }
    }
    return null;
  }

  
  const fetchData = useCallback(
    async () => {
      if (!query || queryType === "q") {
        setData([]);
        return;
      }

      setSearching(true);

      // cancelar petición anterior

      try {
        const fetchedData = await fetchWithTimeout(query, queryType);

        // ⚠️ Solo actualizar si esta es la última búsqueda
        setSearching(false);

        if (!fetchedData) {
          console.log("No se pudo completar la búsqueda después de 2 intentos.");

          Swal.fire({
            icon: "error",
            title: "Busqueda tardada",
            text: "La busqueda tardo mas de 6 segundos. Reintentar o buscar de manera manual",
            timer: 5000,
          })

          return;
        }

        if (fetchedData.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Producto no encontrado",
            text: "No se pudo encontrar este producto mediante su código",
            timer: 5000,
          });
        } else if (fetchedData.length === 1) {
          handleSingleProductFetch(fetchedData[0]);
        }
      } catch (err) {
        if (err.name === "AbortError") return; // petición cancelada, no hacer nada
        console.error(err);
        setSearching(false);
      }
    },
    [query, queryType, movementType]
  );

  const handleSearchProduct = async () => {
    setSearching(true);
    const response = await getStoreProducts({ [queryType]: query });
    const fetchedData = response.data;
    setData(fetchedData);
    setSearching(false);
  };
  const handleSingleProductFetch = (storeProduct) => {
    if (movementType === "venta" && storeProduct.available_stock === 0) {
      handleOpenModal(storeProduct);
    } else if (
      movementType === "traspaso" &&
      storeProduct.reserved_stock === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Este producto no esta relacionado a algun traspaso",
        timer: 5000,
      });
    } else if (movementType === "checar") {
      Swal.fire({
        icon: "success",
        title: storeProduct.product.name,
        text: "Precio unitario $" + storeProduct.product.prices.unit_price,
        timer: 5000,
      });
    } else {
      handleAddToCartIfAvailable(storeProduct);
    }
    setQuery("");
  };

  const handleAddToCartIfAvailable = (storeProduct) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === storeProduct.id
    );
    const quantity = storeProduct.quantity || 0;

    if (existingProductIndex === -1) {
      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
      } else {
        const stock =
          movementType === "traspaso"
            ? storeProduct.reserved_stock
            : storeProduct.available_stock;
        if (quantity < stock) {
          dispatch(addToCart({ ...storeProduct, quantity: 1 }));
          setData([]);
          setQuery("");
        } else {
          displayStockLimitAlert();
        }
      }
    } else {
      const existingProduct = cart[existingProductIndex];
      const stock =
        movementType === "traspaso"
          ? storeProduct.reserved_stock
          : storeProduct.available_stock;

      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
      } else if (existingProduct.quantity < stock) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        setData([]);
        setQuery("");
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

  const handleOpenModal = (storeProduct) => {
    dispatch(hideStockModal());
    setTimeout(() => dispatch(showStockModal(storeProduct)), 1);
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
      dispatch(updateMovementType("checar"));
    }
    if (event.ctrlKey && event.key === "s") {
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

      <h1>
        Buscador de productos{" "}
        <CustomButton
          disabled={!urlPrinter}
          onClick={(e) => handlePrintTicket("test", {})}
        >
          <PrintIcon />
        </CustomButton>
      </h1>

      <div>
        <FormLabel className="me-3">Tipo de búsqueda:</FormLabel>
        <RadioGroup row value={queryType} onChange={handleQueryTypeChange}>
          <FormControlLabel 
            value="code" 
            control={<Radio size="small" />} 
            label="Por código de barras (Ctrl + R)" 
          />
          <FormControlLabel 
            value="q" 
            control={<Radio size="small" />} 
            label="Por marca o nombre (Ctrl + Y)" 
          />
        </RadioGroup>
      </div>

      <div>
        <FormLabel className="me-3">Tipo de operación:</FormLabel>
        <RadioGroup row value={movementType} onChange={handleMovementTypeChange}>
          <FormControlLabel 
            value="venta" 
            control={<Radio size="small" />} 
            label="Venta (Ctrl + U)" 
            className={storeType === "A" ? "d-none" : ""}
          />
          <FormControlLabel 
            value="traspaso" 
            control={<Radio size="small" />} 
            label="Confirmar traspaso (Ctrl + I)" 
          />
          <FormControlLabel 
            value="distribucion" 
            control={<Radio size="small" />} 
            label="Distribucion (Ctrl + O)" 
            className={storeType === "T" ? "d-none" : ""}
          />
          <FormControlLabel 
            value="agregar" 
            control={<Radio size="small" />} 
            label="Agregar a inventario (Ctrl + P)" 
          />
          <FormControlLabel 
            value="checar" 
            control={<Radio size="small" />} 
            label="Checar precio (Ctrl + A)" 
          />
          {supports_reservations && (
            <FormControlLabel 
              value="apartado" 
              control={<Radio size="small" />} 
              label="Apartado (Sin atajo)" 
              className={storeType === "A" ? "d-none" : ""}
            />
          )}
        </RadioGroup>
      </div>

      <Badge bg="success" className="text-wrap" hidden={isInputFocused}>
        Aviso: Para añadir productos al carrito, el cursor debe estar en el
        campo de búsqueda de productos.
      </Badge>

      <Badge bg="success" className="text-wrap" hidden={!searching}>
        Buscando...
      </Badge>

      <Badge
        bg="success"
        className="text-wrap"
        hidden={searching || data.length === 0}
      >
        {data.length} resultados{" "}
        {data.length === 200 && "(puede haber mas coincidencias)"}
      </Badge>

      {!searching && isInputFocused && <br />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={11}>
          <TextField size="small" fullWidth className=""
            ref={inputRef}
            type="text"
            value={queryType === "code" ? barcode : query}
            placeholder="Buscar producto (Ctrl + S)"
            onChange={
              queryType === "q"
                ? handleQueryChange
                : (e) => setBarcode(e.target.value.replace("'", "-"))
            }
            onKeyDown={queryType === "code" ? handleBarcodeSearch : undefined}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          {data.length > 0 && (
            <CustomTable
            showNoDataComponent={false}
            data={data}
            pagination={false}
            columns={[
              { name: "Código", selector: (row) => row.product.code, grow: 2 },
              {
                name: "Marca",
                selector: (row) => row.product.brand_name,
              },
              {
                name: "Nombre",
                selector: (row) => row.product.name,
                grow: 3,
                wrap: true,
              },
              { name: "Stock", selector: (row) => row.available_stock },
              {
                name: "Precio unitario",
                selector: (row) =>
                  `$${row.product.prices.unit_price.toFixed(2)}`,
              },
              {
                name: "Precio mayoreo",
                wrap: true,
                selector: (row) =>
                  row.product.prices.apply_wholesale
                    ? `${
                        row.product.prices.min_wholesale_quantity
                      } o más a $${row.product.prices.wholesale_price.toFixed(
                        2
                      )}`
                    : "N/A",
              },
              {
                name: "Acciones",
                grow: 5,
                cell: (row) => (
                  <>
                    <CustomButton
                      onClick={() => handleAddToCartIfAvailable(row)}
                      disabled={
                        movementType === "venta" && row.available_stock === 0
                      }
                      variant="primary"
                      startIcon={<AddIcon />}
                    >
                      Agregar
                    </CustomButton>

                    <CustomButton
                      onClick={() =>
                        handleOpenModal({ ...row, onlyRead: true })
                      }
                      variant="danger"
                      startIcon={<VisibilityIcon />}
                    >
                      Ver stock
                    </CustomButton>

                    <CustomButton
                      onClick={() =>
                        handleOpenModal({ ...row, showImage: true })
                      }
                      variant="danger"
                      disabled={!row.product.image}
                      startIcon={<ImageIcon />}
                    >
                      Ver imagen
                    </CustomButton>
                  </>
                ),
              },
            ]}
          />
          )}


        </Grid>
        {queryType === "q" && (
          <Grid item xs={12}>
            <CustomButton onClick={handleSearchProduct} startIcon={<SearchIcon />}>Buscar</CustomButton>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SearchProduct;
