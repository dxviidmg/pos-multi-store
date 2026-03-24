import { showSuccess, showError, showWarning } from "../../../utils/alerts";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { getStoreProducts } from "../../../api/products";
import { addToCart, updateMovementType } from "../../../redux/cart/cartActions";
import { Chip } from "@mui/material";
import StockModal from "../../inventory/StockModal/StockModal";
import { useModal } from "../../../hooks/useModal";
import { useFetchWithRetry } from "../../../hooks/useFetch";
import { getPrinterUrl, getUserData } from "../../../api/utils";
import PrintIcon from "@mui/icons-material/Print";
import { handlePrintTicket } from "../../../utils/utils";
import { Grid, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, InputAdornment, IconButton, CircularProgress, LinearProgress, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const SearchProduct = ({ searchInputRef }) => {
  const localRef = useRef(null);
  const inputRef = searchInputRef || localRef;

  const dispatch = useDispatch();
  const stockModal = useModal();
  const { refetch: fetchWithRetry } = useFetchWithRetry(
    (params, config) => getStoreProducts(params, config),
    { maxRetries: 1, timeout: 8000 }
  );
  
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);
  
  const cart = useMemo(() => {
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.cart || [];
  }, [carts, activeCartId]);
  
  const movementType = useMemo(() => {
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.movementType || "venta";
  }, [carts, activeCartId]);
  
  // Calcular stock disponible considerando todos los carritos
  const getAvailableStock = useCallback((productId, productStock) => {
    const reservedInOtherCarts = carts.reduce((total, cart) => {
      if (cart.id === activeCartId) return total;
      const item = cart.cart.find(item => item.id === productId);
      return total + (item ? item.quantity : 0);
    }, 0);
    return productStock - reservedInOtherCarts;
  }, [carts, activeCartId]);

  const storeType = getUserData().store_type;
  const urlPrinter = getPrinterUrl();
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [queryType, setQueryType] = useState("code");
  const [barcode, setBarcode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const [keepListOpen, setKeepListOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const searchingRef = useRef(false);

  const fetchData = useCallback(
    async () => {
      if (!query || queryType === "q") {
        setData([]);
        return;
      }

      if (searchingRef.current) return;
      searchingRef.current = true;
      setSearching(true);

      try {
        const fetchedData = await fetchWithRetry({ [queryType]: query });

        searchingRef.current = false;
        setSearching(false);

        if (!fetchedData) {
          

          showError("Búsqueda tardada", "La búsqueda tardó demasiado. Reintentar o buscar de manera manual");

          return;
        }

        if (fetchedData.length === 0) {
          showError("Producto no encontrado", "No se pudo encontrar este producto mediante su código");
        } else if (fetchedData.length === 1) {
          handleSingleProductFetch(fetchedData[0]);
        } else {
          setData(fetchedData);
        }
      } catch (err) {
        searchingRef.current = false;
        if (err.name === "AbortError" || err.name === "CanceledError") return;
        
        setSearching(false);
      }
    },
    [query, queryType, fetchWithRetry]
  );

  const handleSearchProduct = async () => {
    setSearching(true);
    const response = await getStoreProducts({ [queryType]: query });
    const fetchedData = response.data;
    setData(fetchedData);
    setSearching(false);
    if (fetchedData.length === 0) {
      showError("Sin resultados", "No se encontraron productos con esa búsqueda");
    }
  };
  const handleSingleProductFetch = (storeProduct) => {
    if (movementType === "venta" && storeProduct.available_stock === 0) {
      handleOpenModal(storeProduct);
    } else if (
      movementType === "traspaso" &&
      storeProduct.reserved_stock === 0
    ) {
      showError("Este producto no está relacionado a algún traspaso");
    } else if (movementType === "checar") {
      showSuccess(storeProduct.product.name, "Precio unitario $" + storeProduct.product.prices.unit_price);
    } else {
      handleAddToCartIfAvailable(storeProduct);
    }
    setQuery("");
  };

  const handleAddToCartIfAvailable = (storeProduct) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === storeProduct.id
    );
    const currentQuantityInCart = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;

    if (existingProductIndex === -1) {
      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
      } else {
        const stock =
          movementType === "traspaso"
            ? storeProduct.reserved_stock
            : storeProduct.available_stock;
        const availableStock = getAvailableStock(storeProduct.id, stock);
        
        if (availableStock >= 1) {
          dispatch(addToCart({ ...storeProduct, quantity: 1 }));
          if (!keepListOpen) {
            setData([]);
            setQuery("");
          }
        } else {
          showWarning("Stock insuficiente", `Este producto ya está reservado en otros carritos. Stock disponible: ${availableStock}`);
        }
      }
    } else {
      const stock =
        movementType === "traspaso"
          ? storeProduct.reserved_stock
          : storeProduct.available_stock;
      const availableStock = getAvailableStock(storeProduct.id, stock);

      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
      } else if (currentQuantityInCart < availableStock) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else if (
        movementType === "venta" &&
        currentQuantityInCart >= availableStock
      ) {
        handleOpenModal(cart[existingProductIndex]);
      } else {
        showWarning("Stock insuficiente", `Este producto ya está reservado en otros carritos. Stock disponible: ${availableStock}`);
      }
    }
  };

  useEffect(() => {
    if (queryType === "code" && query) {
      fetchData();
    } else if (queryType === "q" && query) {
      const timer = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setData([]);
    }
  }, [query, queryType]);

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
    stockModal.open(storeProduct);
  };

  const handleShortcut = useCallback((event) => {
    if (event.ctrlKey && (event.key === "q" || event.key === "Q")) {
      event.preventDefault();
      setQueryType("code");
    }
    if (event.ctrlKey && (event.key === "w" || event.key === "W")) {
      event.preventDefault();
      setQueryType("q");
    }
    if (event.ctrlKey && (event.key === "e" || event.key === "E")) {
      event.preventDefault();
      dispatch(updateMovementType("venta"));
    }
    if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
      event.preventDefault();
      dispatch(updateMovementType("traspaso"));
    }
    if (event.ctrlKey && (event.key === "t" || event.key === "T")) {
      event.preventDefault();
      dispatch(updateMovementType("distribucion"));
    }
    if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
      event.preventDefault();
      dispatch(updateMovementType("agregar"));
    }
    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
      event.preventDefault();
      dispatch(updateMovementType("checar"));
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);

  return (
    <>
      <StockModal isOpen={stockModal.isOpen} product={stockModal.data} onClose={stockModal.close} />

      <div className="flex-between" style={{ marginBottom: '0.25rem', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Consulta de productos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!isInputFocused && (
            <Alert severity="warning" variant="filled" sx={{ py: 0 }}>
              Enfoca el campo de búsqueda para agregar productos
            </Alert>
          )}
          <CustomButton
            disabled={!urlPrinter}
            onClick={(e) => handlePrintTicket("test", {})}
            startIcon={<PrintIcon fontSize="small" />}
          >
            Probar impresora
          </CustomButton>
        </div>
      </div>

      <Grid container spacing={0} sx={{ mb: 0.5 }}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 0.25 }}>
          <FormLabel sx={{ fontWeight: 600, mr: 1, fontSize: '0.875rem' }}>Tipo de búsqueda:</FormLabel>
          <RadioGroup row value={queryType} onChange={handleQueryTypeChange}>
            <FormControlLabel 
              value="code" 
              control={<Radio size="small" />} 
              label="Por código de barras (Ctrl+Q)"
              sx={{ mr: 4 }}
            />
            <FormControlLabel 
              value="q" 
              control={<Radio size="small" />} 
              label="Por marca o nombre (Ctrl+W)"
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <FormLabel sx={{ fontWeight: 600, mr: 1, fontSize: '0.875rem' }}>Tipo de operación:</FormLabel>
          <RadioGroup row value={movementType} onChange={handleMovementTypeChange}>
            {storeType !== "A" && (
              <FormControlLabel 
                value="venta" 
                control={<Radio size="small" />} 
                label="Venta (Ctrl+E)"
                sx={{ mr: 4 }}
              />
            )}
            <FormControlLabel 
              value="traspaso" 
              control={<Radio size="small" />} 
              label="Confirmar traspaso (Ctrl+R)"
              sx={{ mr: 4 }}
            />
            {storeType !== "T" && (
              <FormControlLabel 
                value="distribucion" 
                control={<Radio size="small" />} 
                label="Distribucion (Ctrl+T)"
                sx={{ mr: 4 }}
              />
            )}
            <FormControlLabel 
              value="agregar" 
              control={<Radio size="small" />} 
              label="Agregar a inventario (Ctrl+Y)"
              sx={{ mr: 4 }}
            />
            <FormControlLabel 
              value="checar" 
              control={<Radio size="small" />} 
              label="Checar precio (Ctrl+U)"
              sx={{ mr: 4 }}
            />
          </RadioGroup>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mb: 0.5 }}>
        <Grid item xs={12} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {queryType === "q" && (
            <>
              <IconButton
                size="small"
                onClick={() => setKeepListOpen(!keepListOpen)}
                sx={{ width: 36, height: 36, bgcolor: keepListOpen ? 'primary.main' : 'transparent', color: keepListOpen ? 'white' : 'text.secondary', borderRadius: 1, '&:hover': { bgcolor: keepListOpen ? 'primary.dark' : 'action.hover' } }}
              >
                {keepListOpen ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
              </IconButton>
              <IconButton size="small" onClick={handleSearchProduct} disabled={searching} sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'white', borderRadius: 1, '&:hover': { bgcolor: 'primary.dark' } }}>
                {searching ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SearchIcon />}
              </IconButton>
            </>
          )}
          <TextField size="small" fullWidth
            inputRef={inputRef}
            type="text"
            value={queryType === "code" ? barcode : query}
            placeholder="Buscar producto"
            onChange={
              queryType === "q"
                ? handleQueryChange
                : (e) => setBarcode(e.target.value.replace("'", "-"))
            }
            onKeyDown={queryType === "code" ? handleBarcodeSearch : undefined}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoComplete="off"
          />
          {queryType === "q" && data.length > 0 && (
            <Chip label={`${data.length} resultados`} color="primary" size="small" sx={{ height: 36 }} />
          )}
        </Grid>
        {searching && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
        
        {data.length > 0 && (
          <Grid item xs={12}>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <DataTable
              showNoDataComponent={false}
              data={data}
              pagination={true}
              columns={[
                { name: "Código", selector: (row) => row.product.code },
                {
                  name: "Marca",
                  selector: (row) => row.product.brand_name,
                },
                {
                  name: "Nombre",
                  selector: (row) => row.product.name,
                },
                { name: "Stock", selector: (row) => row.available_stock },
                {
                  name: "Precio unitario",
                  selector: (row) =>
                    `$${row.product.prices.unit_price.toFixed(2)}`,
                },
                {
                  name: "Precio mayoreo",
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
                  width: 180,
                  cell: (row) => (
                    <>
                      <CustomTooltip text="Agregar al carrito">
                        <CustomButton
                          onClick={() => handleAddToCartIfAvailable(row)}
                          disabled={
                            movementType === "venta" && row.available_stock === 0
                          }
                        >
                          <AddIcon />
                        </CustomButton>
                      </CustomTooltip>

                      <CustomTooltip text="Ver stock en todas las tiendas">
                        <CustomButton
                          onClick={() =>
                            handleOpenModal({ ...row, onlyRead: true })
                          }
                        >
                          <InventoryIcon />
                        </CustomButton>
                      </CustomTooltip>

                      <CustomTooltip text="Ver imagen del producto">
                        <CustomButton
                          onClick={() =>
                            handleOpenModal({ ...row, showImage: true })
                          }
                          disabled={!row.product.image}
                        >
                          <RemoveRedEyeIcon />
                        </CustomButton>
                      </CustomTooltip>
                    </>
                  ),
                },
              ]}
            />
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SearchProduct;
