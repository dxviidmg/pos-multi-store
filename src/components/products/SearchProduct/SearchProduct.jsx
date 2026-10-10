import React, { useRef, useState } from "react";
import { Chip, Grid, TextField, InputAdornment, IconButton, CircularProgress, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import BarcodeScanner from "../../ui/BarcodeScanner/BarcodeScanner";
import StockModal from "../../inventory/StockModal/StockModal";
import ProductModal from "../ProductModal/ProductModal";
import ProductCarousel from "../ProductCarousel/ProductCarousel";
import { showAlert } from "../../../utils/alerts";
import { handlePrintTicket } from "../../../utils/print";
import { usePrinterStatus } from "../../../hooks/usePrinterStatus";
import { isGeneralView, isSeller } from "../../../constants/routeAccess";
import { QUERY_TYPES } from "../../../constants";
import SearchSuggestions from "./SearchSuggestions";
import SearchModeSelectors from "./SearchModeSelectors";
import SearchResultsTable from "./SearchResultsTable";
import StockVerificationSnackbar from "./StockVerificationSnackbar";
import { useSearchProductController } from "./useSearchProductController";

const SQUARE_BUTTON_SX = { width: 36, height: 36, color: "common.white", borderRadius: 1 };
const SEARCH_BUTTON_SX = { ...SQUARE_BUTTON_SX, bgcolor: "primary.main" };

const SearchProduct = ({ searchInputRef }) => {
  const localRef = useRef(null);
  const inputRef = searchInputRef || localRef;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const search = useSearchProductController(inputRef);
  const { user, queryType, isTextMode, searching, data, stockModal, productModal, suggestions } = search;
  const isCodeMode = queryType === QUERY_TYPES.CODE;

  const storePrinter = user?.store_printer;
  const { connected: printerConnected } = usePrinterStatus(storePrinter);

  const handlePrinterClick = () => {
    if (!storePrinter) {
      showAlert("info", "Impresora no configurada", "Para configurar la impresora, contacte a soporte técnico. Recomendamos la Epson TM-88V.");
    } else {
      handlePrintTicket("test", {});
    }
  };

  const closeStockModal = () => {
    stockModal.close();
    search.clearSearch();
  };

  const closeProductModal = () => {
    productModal.close();
    search.clearSearch();
  };

  const searchButton = (
    <IconButton size="small" onClick={isCodeMode ? search.runBarcodeSearch : search.handleSearchProduct} disabled={searching} sx={SEARCH_BUTTON_SX}>
      {searching ? <CircularProgress size={18} color="inherit" /> : <SearchIcon fontSize="small" />}
    </IconButton>
  );

  return (
    <>
      <StockModal isOpen={stockModal.isOpen} product={stockModal.data} onClose={closeStockModal} />
      <ProductModal
        isOpen={productModal.isOpen}
        product={productModal.data}
        onClose={closeProductModal}
        onUpdate={search.handleProductCreated}
      />

      <StockVerificationSnackbar
        open={search.stockVerification.open && !isSeller(user) && !isGeneralView(user)}
        productCode={search.stockVerification.productCode}
        onClose={search.closeStockVerification}
      />

      <PageHeader title="Vender">
        {!isMobile && (
          <CustomButton
            fullWidth
            onClick={handlePrinterClick}
            startIcon={printerConnected ? <CheckCircleIcon fontSize="small" sx={{ color: "success.main" }} /> : <CancelIcon fontSize="small" sx={{ color: "error.main" }} />}
            color={printerConnected ? "success" : undefined}
          >
            {!storePrinter ? "Configurar impresora" : printerConnected ? (
              <span className="default-text">Impresora conectada</span>
            ) : "Impresora desconectada"}
          </CustomButton>
        )}
      </PageHeader>

      <SearchModeSelectors
        isMobile={isMobile}
        queryType={queryType}
        onQueryTypeChange={search.changeQueryType}
        movementType={search.movementType}
        onMovementTypeChange={search.handleMovementTypeChange}
        permissions={{ allowSale: search.allowSale, allowDistribution: search.allowDistribution, allowTransfer: search.allowTransfer }}
      />

      <Grid container spacing={1} sx={{ mb: 0.5 }}>
        <Grid item xs={12} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField size="small" fullWidth
            inputRef={inputRef}
            ref={setAnchorEl}
            type="text"
            value={isCodeMode ? search.barcode : search.query}
            placeholder={isCodeMode ? "Buscar producto por código (Ctrl+B)" : "Buscar producto por nombre (Ctrl+B)"}
            onChange={search.handleInputChange}
            onKeyDown={search.handleInputKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
            InputProps={{
              startAdornment: isTextMode && !isMobile ? (
                <InputAdornment position="start">
                  <IconButton size="small" onClick={search.handleSearchProduct} disabled={searching} sx={{ p: 0.5 }}>
                    {searching ? <CircularProgress size={18} /> : <SearchIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          {searchButton}
          {isCodeMode && isMobile && (
            <IconButton size="small" onClick={() => setScannerOpen(true)} sx={{ ...SQUARE_BUTTON_SX, bgcolor: "success.main" }}>
              <QrCodeScannerIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{
              ...SQUARE_BUTTON_SX,
              bgcolor: isInputFocused ? "primary.main" : "warning.main",
              "&:hover": { bgcolor: isInputFocused ? "primary.dark" : "warning.dark" },
            }}
          >
            {isInputFocused ? <EditIcon fontSize="small" /> : <EditOffIcon fontSize="small" />}
          </IconButton>
          {isTextMode && (
            <IconButton
              size="small"
              onClick={search.toggleKeepListOpen}
              sx={{
                ...SQUARE_BUTTON_SX,
                bgcolor: search.keepListOpen ? "primary.main" : "transparent",
                color: search.keepListOpen ? "common.white" : "text.secondary",
                "&:hover": { bgcolor: search.keepListOpen ? "primary.dark" : "action.hover" },
              }}
            >
              {search.keepListOpen ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
          )}
          {isTextMode && data.length > 0 && (
            <Chip label={`${data.length} resultados`} color="primary" size="small" sx={{ height: 36 }} />
          )}
        </Grid>

        {queryType === QUERY_TYPES.NAME && (
          <SearchSuggestions
            anchorEl={anchorEl}
            open={suggestions.open}
            loading={suggestions.loading}
            noResults={suggestions.noResults}
            suggestions={suggestions.suggestions}
            highlightedIndex={search.highlightedIndex}
            onHover={search.setHighlightedIndex}
            onSelect={search.handleSuggestionSelect}
            onClickAway={() => suggestions.setOpen(false)}
          />
        )}

        {searching && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {data.length > 0 && queryType === QUERY_TYPES.VISUAL && (
          <Grid item xs={12}>
            <ProductCarousel
              products={data}
              movementType={search.movementType}
              onSelect={(sp) => search.handleAddToCartIfAvailable(sp, stockModal)}
            />
          </Grid>
        )}

        {data.length > 0 && queryType !== QUERY_TYPES.VISUAL && (
          <Grid item xs={12}>
            <SearchResultsTable
              data={data}
              movementType={search.movementType}
              allowTransfer={search.allowTransfer}
              onAdd={(row) => search.handleAddToCartIfAvailable(row, stockModal)}
              onOpenStock={stockModal.open}
            />
          </Grid>
        )}
      </Grid>

      <BarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={search.handleScanDetected}
      />
    </>
  );
};

export default SearchProduct;
