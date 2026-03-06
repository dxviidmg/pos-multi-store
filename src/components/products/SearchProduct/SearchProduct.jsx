import { logger } from "../../../utils/logger";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { getStoreProducts } from "../../../api/products";
import { addToCart, updateMovementType } from "../../../redux/cart/cartActions";
import { Chip } from "@mui/material";
import StockModal from "../../inventory/StockModal/StockModal";
import { useModal } from "../../../hooks/useModal";
import { useFetchWithRetry } from "../../../hooks/useFetch";
import Swal from "sweetalert2";
import { getPrinterUrl, getUserData } from "../../../api/utils";
import PrintIcon from "@mui/icons-material/Print";
import { handlePrintTicket } from "../../../utils/utils";
import { Grid, TextField, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const SearchProduct = () => {
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const stockModal = useModal();
  const { refetch: fetchWithRetry } = useFetchWithRetry(
    (params) => getStoreProducts(params),
    { maxRetries: 2, timeout: 3000 }
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

  const fetchData = useCallback(
    async () => {
      if (!query || queryType === "q") {
        setData([]);
        return;
      }

      setSearching(true);

      try {
        const fetchedData = await fetchWithRetry({ [queryType]: query });

        setSearching(false);

        if (!fetchedData) {
          logger.log("No se pudo completar la búsqueda después de 2 intentos.");

          Swal.fire({
            icon: "error",
            title: "Búsqueda tardada",
            text: "La búsqueda tardó más de 6 segundos. Reintentar o buscar de manera manual",
            timer: 5000,
          });

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
        } else {
          setData(fetchedData);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        logger.error(err);
        setSearching(false);
      }
    },
    [query, queryType]
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
          setData([]);
          setQuery("");
        } else {
          Swal.fire({
            icon: "warning",
            title: "Stock insuficiente",
            text: `Este producto ya está reservado en otros carritos. Stock disponible: ${availableStock}`,
          });
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
        setData([]);
        setQuery("");
      } else if (
        movementType === "venta" &&
        currentQuantityInCart >= availableStock
      ) {
        handleOpenModal(cart[existingProductIndex]);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Stock insuficiente",
          text: `Este producto ya está reservado en otros carritos. Stock disponible: ${availableStock}`,
        });
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
      <StockModal isOpen={stockModal.isOpen} product={stockModal.data} onClose={stockModal.close} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Buscador de productos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Chip 
            label="Enfoca el campo de búsqueda para agregar productos"
            color="success" 
            size="small"
            sx={{ display: isInputFocused ? 'none' : 'inline-flex' }}
          />
          <Chip 
            label="Buscando..."
            color="success" 
            size="small"
            sx={{ display: !searching ? 'none' : 'inline-flex' }}
          />
          <Chip
            label={`${data.length} resultados ${data.length === 200 ? "(puede haber mas coincidencias)" : ""}`}
            color="success"
            size="small"
            sx={{ display: (searching || data.length === 0) ? 'none' : 'inline-flex' }}
          />
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
              label="Por código de barras (Ctrl+R)"
              sx={{ mr: 4 }}
            />
            <FormControlLabel 
              value="q" 
              control={<Radio size="small" />} 
              label="Por marca o nombre (Ctrl+Y)"
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
                label="Venta (Ctrl+U)"
                sx={{ mr: 4 }}
              />
            )}
            <FormControlLabel 
              value="traspaso" 
              control={<Radio size="small" />} 
              label="Confirmar traspaso (Ctrl+I)"
              sx={{ mr: 4 }}
            />
            {storeType !== "T" && (
              <FormControlLabel 
                value="distribucion" 
                control={<Radio size="small" />} 
                label="Distribucion (Ctrl+O)"
                sx={{ mr: 4 }}
              />
            )}
            <FormControlLabel 
              value="agregar" 
              control={<Radio size="small" />} 
              label="Agregar a inventario (Ctrl+P)"
              sx={{ mr: 4 }}
            />
            <FormControlLabel 
              value="checar" 
              control={<Radio size="small" />} 
              label="Checar precio (Ctrl+A)"
              sx={{ mr: 4 }}
            />
            {supports_reservations && storeType !== "A" && (
              <FormControlLabel 
                value="apartado" 
                control={<Radio size="small" />} 
                label="Apartado (Sin atajo)"
              />
            )}
          </RadioGroup>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 0.5 }}>
        <Grid item xs={queryType === "code" ? 12 : 10}>
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
        </Grid>
        {queryType === "q" && (
          <Grid item xs={2}>
            <CustomButton 
              fullWidth 
              onClick={handleSearchProduct} 
              startIcon={<SearchIcon />}
              disabled={searching}
            >
              {searching ? "Buscando..." : "Buscar"}
            </CustomButton>
          </Grid>
        )}
        
        {data.length > 0 && (
          <Grid item xs={12}>
            <CustomTable
            showNoDataComponent={false}
            data={data}
            pagination={true}
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
                wrapText: true,
              },
              { name: "Stock", selector: (row) => row.available_stock },
              {
                name: "Precio unitario",
                selector: (row) =>
                  `$${row.product.prices.unit_price.toFixed(2)}`,
              },
              {
                name: "Precio mayoreo",
                wrapText: true,
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
                grow: 2,
                cell: (row) => (
                  <>
                    <CustomTooltip text="Agregar al carrito">
                      <CustomButton
                        onClick={() => handleAddToCartIfAvailable(row)}
                        disabled={
                          movementType === "venta" && row.available_stock === 0
                        }
                        variant="primary"
                      >
                        <AddIcon />
                      </CustomButton>
                    </CustomTooltip>

                    <CustomTooltip text="Ver stock en todas las tiendas">
                      <CustomButton
                        onClick={() =>
                          handleOpenModal({ ...row, onlyRead: true })
                        }
                        variant="danger"
                      >
                        <InventoryIcon />
                      </CustomButton>
                    </CustomTooltip>

                    <CustomTooltip text="Ver imagen del producto">
                      <CustomButton
                        onClick={() =>
                          handleOpenModal({ ...row, showImage: true })
                        }
                        variant="danger"
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
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SearchProduct;
