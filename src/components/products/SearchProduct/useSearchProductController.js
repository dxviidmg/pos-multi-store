import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMovementType } from "../../../redux/cart/selectors";
import { updateMovementType } from "../../../redux/cart/cartActions";
import { getStoreProducts, getCreateProductsOnSale } from "../../../api/products";
import { showSuccess, showWarning, showRequestError } from "../../../utils/alerts";
import { logger } from "../../../utils/logger";
import { useModal } from "../../../hooks/useModal";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";
import { useProductSearch } from "../../../hooks/useProductSearch";
import { useProductSuggestions } from "../../../hooks/useProductSuggestions";
import { useCartActions } from "../../../hooks/useCartActions";
import { useAvailableStock } from "../../../hooks/useAvailableStock";
import { useUser } from "../../../context/UserContext";
import { MOVEMENT_TYPES, QUERY_TYPES, STORE_TYPES } from "../../../constants";

const CLOSED_VERIFICATION = { open: false, productName: "", productCode: "" };

/**
 * Estado y acciones de la búsqueda de productos de la pantalla de venta: modo de búsqueda,
 * tipo de operación, sugerencias, atajos de teclado, código de barras y alta al carrito.
 */
export const useSearchProductController = (inputRef) => {
  const dispatch = useDispatch();
  const stockModal = useModal();
  const productModal = useModal();
  const { getAvailableStock } = useAvailableStock();
  const movementType = useSelector(selectMovementType);

  const { user } = useUser();
  const storeType = user?.store_type;
  const allowTransfer = !!user?.multistore;
  // Mismas reglas que las opciones visibles de "Tipo de operación"
  const allowSale = storeType !== STORE_TYPES.WAREHOUSE;
  const allowDistribution = storeType !== STORE_TYPES.STORE;

  const [barcode, setBarcode] = useState("");
  const [keepListOpen, setKeepListOpen] = useState(false);
  const [createProductsOnSale, setCreateProductsOnSale] = useState(false);
  const [stockVerification, setStockVerification] = useState(CLOSED_VERIFICATION);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const { query, setQuery, data, setData, queryType, setQueryType, searching, fetchData } = useProductSearch();
  const { handleAddToCartIfAvailable } = useCartActions(getAvailableStock, movementType, keepListOpen, setData, setQuery);

  // Sugerencias tipo autocompletado (solo modo "Nombre o marca")
  const suggestions = useProductSuggestions({ query, queryType, enabled: queryType === QUERY_TYPES.NAME });
  const { setOpen: setSuggestionsOpen } = suggestions;

  // Reiniciar el resaltado cuando cambian las sugerencias.
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions.suggestions]);

  // "q" (por marca o nombre) y "visual" (búsqueda visual) comparten el mismo flujo de texto
  const isTextMode = queryType === QUERY_TYPES.NAME || queryType === QUERY_TYPES.VISUAL;

  const changeQueryType = (newQueryType) => {
    setQueryType(newQueryType);
    setQuery("");
    setData([]);
  };

  useKeyboardShortcuts(inputRef, dispatch, {
    allowTransfer,
    allowSale,
    allowReservation: allowSale,
    allowDistribution,
    onQueryTypeChange: (newQueryType) => {
      changeQueryType(newQueryType);
      inputRef.current?.focus();
    },
    onVisualSearch: () => {
      changeQueryType(QUERY_TYPES.VISUAL);
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    const checkCreateProductsOnSale = async () => {
      try {
        const response = await getCreateProductsOnSale();
        setCreateProductsOnSale(response.data.create_products_on_sale || false);
      } catch (err) {
        logger.error("Error checking create products on sale:", err);
      }
    };
    checkCreateProductsOnSale();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [inputRef]);

  const handleSingleProductFetch = (storeProduct) => {
    if (movementType === MOVEMENT_TYPES.SALE && storeProduct.available_stock === 0) {
      stockModal.open(storeProduct);
    } else if (movementType === MOVEMENT_TYPES.TRANSFER && storeProduct.reserved_stock === 0) {
      showWarning("No se pudo agregar el producto", "No está incluido en ningún traspaso pendiente.");
    } else if (movementType === MOVEMENT_TYPES.CHECK_STOCK) {
      showSuccess(storeProduct.product.name, "Precio unitario $" + storeProduct.product.prices.unit_price);
    } else {
      const verification = handleAddToCartIfAvailable(storeProduct, stockModal);
      if (verification) {
        setStockVerification({ open: true, ...verification });
      }
    }
    setQuery("");
  };

  // La búsqueda usa siempre los handlers del último render; solo se dispara al cambiar el texto o el modo
  const runSearchRef = useRef(null);
  runSearchRef.current = () => fetchData(handleSingleProductFetch, createProductsOnSale, productModal);

  useEffect(() => {
    if (queryType === QUERY_TYPES.CODE && query) {
      runSearchRef.current();
      return undefined;
    }
    if ((queryType === QUERY_TYPES.NAME || queryType === QUERY_TYPES.VISUAL) && query) {
      const timer = setTimeout(() => runSearchRef.current(), 300);
      return () => clearTimeout(timer);
    }
    setData([]);
    return undefined;
  }, [query, queryType, setData]);

  const handleSearchProduct = async () => {
    // Al ejecutar la búsqueda final (Enter/lupa) se cierra el desplegable de sugerencias.
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    // "visual" usa el mismo parámetro de API que "q" (por marca o nombre)
    const apiParam = queryType === QUERY_TYPES.CODE ? QUERY_TYPES.CODE : QUERY_TYPES.NAME;
    try {
      const response = await getStoreProducts({ [apiParam]: query });
      setData(response.data);
      if (response.data.length === 0) {
        showWarning("No se encontraron productos", "Prueba con otro nombre, marca o código.");
      }
    } catch (error) {
      showRequestError("buscar productos", error);
    }
  };

  const handleMovementTypeChange = (e) => {
    dispatch(updateMovementType(e.target.value));
    setData([]);
  };

  const runBarcodeSearch = () => {
    if (!barcode) return;
    setQuery(barcode);
    setBarcode("");
  };

  const handleScanDetected = (code) => {
    setBarcode(code);
    setQuery(code);
  };

  const handleSuggestionSelect = (storeProduct) => {
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    handleSingleProductFetch(storeProduct);
    // handleSingleProductFetch ya limpia el query (setQuery("")).
    // Si el pin está activo, reponemos el texto para mantener la lista abierta.
    if (keepListOpen) {
      setQuery(query);
    }
  };

  // Manejo de teclado del desplegable, solo en modo "Nombre o marca" y con sugerencias abiertas.
  const handleSuggestionsKeyDown = (e) => {
    const list = suggestions.suggestions;
    if (!suggestions.open || list.length === 0) return false;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev <= 0 ? list.length - 1 : prev - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSuggestionSelect(list[highlightedIndex]);
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
      setHighlightedIndex(-1);
    } else {
      return false;
    }
    e.preventDefault();
    return true;
  };

  const handleInputKeyDown = (e) => {
    if (queryType === QUERY_TYPES.CODE) {
      if (e.key === "Enter") runBarcodeSearch();
      return;
    }
    if (queryType === QUERY_TYPES.NAME && handleSuggestionsKeyDown(e)) return;
    // Sin sugerencia resaltada: resultado final → tabla
    if (e.key === "Enter") handleSearchProduct();
  };

  const handleInputChange = (e) => {
    if (isTextMode) setQuery(e.target.value);
    else setBarcode(e.target.value.replace("'", "-"));
  };

  // Limpiar búsqueda al cerrar los modales de cantidad o de alta de producto
  const clearSearch = () => {
    setQuery("");
    setBarcode("");
  };

  const handleProductCreated = async (product) => {
    clearSearch();
    try {
      const response = await getStoreProducts({ code: product.code });
      if (response.data.length > 0) {
        handleAddToCartIfAvailable(response.data[0], stockModal);
      }
    } catch (error) {
      showRequestError("agregar el producto al carrito", error);
    }
  };

  return {
    user,
    movementType,
    allowTransfer,
    allowSale,
    allowDistribution,
    stockModal,
    productModal,
    query,
    barcode,
    data,
    queryType,
    isTextMode,
    searching,
    keepListOpen,
    toggleKeepListOpen: () => setKeepListOpen((prev) => !prev),
    stockVerification,
    closeStockVerification: () => setStockVerification((prev) => ({ ...prev, open: false })),
    suggestions,
    highlightedIndex,
    setHighlightedIndex,
    changeQueryType,
    handleMovementTypeChange,
    handleSearchProduct,
    handleInputKeyDown,
    handleInputChange,
    runBarcodeSearch,
    handleScanDetected,
    handleSuggestionSelect,
    handleAddToCartIfAvailable,
    clearSearch,
    handleProductCreated,
  };
};
