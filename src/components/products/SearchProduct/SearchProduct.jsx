import { showSuccess, showError, showWarning } from "../../../utils/alerts";
import Swal from "sweetalert2";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import CustomTooltip from "../../ui/Tooltip";
import { getStoreProducts, getStockOtherStores, getCreateProductsOnSale } from "../../../api/products";
import { addToCart, updateMovementType, countStockOtherStores } from "../../../redux/cart/cartActions";
import { Chip, Box, Snackbar, Alert as MuiAlert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import StockModal from "../../inventory/StockModal/StockModal";
import ProductModal from "../ProductModal/ProductModal";
import { useModal } from "../../../hooks/useModal";
import { useFetchWithRetry } from "../../../hooks/useFetch";
import { getPrinterUrl, getUserData } from "../../../api/utils";
import PrintIcon from "@mui/icons-material/Print";
import { handlePrintTicket } from "../../../utils/utils";
import { Grid, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, InputAdornment, IconButton, CircularProgress, LinearProgress, Alert, Link } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

const SearchProduct = ({ searchInputRef }) => {
  const localRef = useRef(null);
  const inputRef = searchInputRef || localRef;

  const dispatch = useDispatch();
  const stockModal = useModal();
  const productModal = useModal();
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
  const [showStockAlert, setShowStockAlert] = useState(() => localStorage.getItem('stockAlertDismissed') !== 'true');
  const [createProductsOnSale, setCreateProductsOnSale] = useState(false);
  const [stockVerificationSnackbar, setStockVerificationSnackbar] = useState({ open: false, productName: "", productCode: "" });

  useEffect(() => {
    const checkCreateProductsOnSale = async () => {
      try {
        const response = await getCreateProductsOnSale();
        setCreateProductsOnSale(response.data.create_products_on_sale || false);
      } catch (err) {
        console.error("Error checking create products on sale:", err);
      }
    };
    checkCreateProductsOnSale();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const searchingRef = useRef(false);

  const logSearchTiming = (ms, queryCode, productName) => {
    const stats = JSON.parse(localStorage.getItem("search_timing_stats") || '{"tiempos":{},"mas_de_8s":[]}');
    const bucket = ms <= 500 ? 0 : Math.ceil((ms - 500) / 1000);
    stats.tiempos[bucket] = (stats.tiempos[bucket] || 0) + 1;
    if (ms > 8000) stats.mas_de_8s.push(queryCode);
    localStorage.setItem("search_timing_stats", JSON.stringify(stats));
  };

  const fetchData = useCallback(
    async () => {
      if (!query || queryType === "q") {
        setData([]);
        return;
      }

      if (searchingRef.current) return;
      searchingRef.current = true;
      setSearching(true);

      const startTime = performance.now();

      try {
        const fetchedData = await fetchWithRetry({ [queryType]: query });
        const elapsed = Math.round(performance.now() - startTime);

        searchingRef.current = false;
        setSearching(false);

        const productName = fetchedData?.[0]?.product?.name || null;
        logSearchTiming(elapsed, query, productName);

        if (!fetchedData) {
          

          showError("Búsqueda tardada", "La búsqueda tardó demasiado. Reintentar o buscar de manera manual");

          return;
        }

        if (fetchedData.length === 0) {
          if (createProductsOnSale) {
            const confirm = await Swal.fire({
              icon: "question",
              title: "Producto no encontrado",
              text: `No se encontró ningún producto con el código "${query}". ¿Desea crear uno nuevo con este código?`,
              showCancelButton: true,
              confirmButtonText: "Sí, crear producto",
              cancelButtonText: "No, gracias",
              confirmButtonColor: "#04346b",
            });
            if (confirm.isConfirmed) {
              productModal.open({ code: query, createFromSearch: true });
            }
          } else {
            showError("Producto no encontrado", `No se encontró ningún producto con el código "${query}"`);
          }
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

  const fetchAndCountStock = async (storeProduct) => {
    const response = await getStockOtherStores(storeProduct.id);
    dispatch(countStockOtherStores(storeProduct, response.data));
  };

  const handleAddToCartIfAvailable = (storeProduct) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === storeProduct.id
    );
    const currentQuantityInCart = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;
    let added = false;

    if (existingProductIndex === -1) {
      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
      } else {
        const stock =
          movementType === "traspaso"
            ? storeProduct.reserved_stock
            : storeProduct.available_stock;
        const availableStock = getAvailableStock(storeProduct.id, stock);
        
        if (availableStock >= 1) {
          dispatch(addToCart({ ...storeProduct, quantity: 1 }));
          added = true;
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
        added = true;
      } else if (currentQuantityInCart < availableStock) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else if (
        movementType === "venta" &&
        currentQuantityInCart >= availableStock
      ) {
        handleOpenModal(cart[existingProductIndex]);
      }
    }

    if (added && storeProduct.requires_stock_verification) {
      setStockVerificationSnackbar({
        open: true,
        productName: storeProduct.product?.name || "Producto",
        productCode: storeProduct.product?.code || ""
      });
    }

    if (added && movementType === "distribucion") {
      fetchAndCountStock(storeProduct);
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
    if (event.ctrlKey && (event.key === "b" || event.key === "B")) {
      event.preventDefault();
      inputRef.current?.focus();
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
      <ProductModal isOpen={productModal.isOpen} product={productModal.data} onClose={productModal.close} onUpdate={(product) => {
        // Obtener el store_product y agregar al carrito
        getStoreProducts({ code: product.code }).then((response) => {
          if (response.data.length > 0) {
            handleAddToCartIfAvailable(response.data[0]);
          }
        });
      }} />

      {showStockAlert && (
        <Alert 
          severity="info" 
          variant="filled" 
          sx={{ 
            mb: 1, 
            py: 0,
            fontWeight: 500,
            '& .MuiAlert-icon': { fontSize: '1rem' }
          }}
          icon={<NotificationImportantIcon fontSize="inherit" />}
          onClose={() => setShowStockAlert(false)}
        >
          <strong>¿Detectaste stock incorrecto?</strong> Ve a <RouterLink to="/inventario/" style={{ color: "#04346b", fontWeight: 600 }}>Inventario</RouterLink> y sigue las instrucciones para solicitar un ajuste
        </Alert>
      )}
      <PageHeader title="Búsqueda de productos">
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
      </PageHeader>

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
            {storeType !== "T" && (
              <FormControlLabel 
                value="distribucion" 
                control={<Radio size="small" />} 
                label="Distribucion (Ctrl+T)"
                sx={{ mr: 4 }}
              />
            )}
            <FormControlLabel 
              value="traspaso" 
              control={<Radio size="small" />} 
              label="Confirmar traspaso (Ctrl+R)"
              sx={{ mr: 4 }}
            />
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
            placeholder="Buscar producto (Ctrl+B)"
            onChange={
              queryType === "q"
                ? handleQueryChange
                : (e) => setBarcode(e.target.value.replace("'", "-"))
            }
            onKeyDown={queryType === "code" ? handleBarcodeSearch : (e) => { if (e.key === "Enter") handleSearchProduct(); }}
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
              <SimpleTable
              noDataComponent="Sin resultados"
              data={data}
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
                  name: "Precios",
                  cell: (row) => (
                    row.product.prices.apply_wholesale
                      ? <>Men: ${row.product.prices.unit_price.toFixed(2)}<br />May: ${row.product.prices.wholesale_price.toFixed(2)} ({row.product.prices.min_wholesale_quantity}+)</>
                      : `$${row.product.prices.unit_price.toFixed(2)}`
                  ),
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

      <Snackbar
        open={stockVerificationSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setStockVerificationSnackbar({ ...stockVerificationSnackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setStockVerificationSnackbar({ ...stockVerificationSnackbar, open: false })}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          El producto {stockVerificationSnackbar.productCode}: {stockVerificationSnackbar.productName} necesita verificación de stock
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default SearchProduct;
