import React from "react";
import {
  Popper,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

/**
 * Desplegable de sugerencias tipo autocompletado para el modo "Nombre o marca".
 * Se ancla al input de búsqueda y muestra hasta 5 sugerencias.
 */
const SearchSuggestions = ({
  anchorEl,
  open,
  loading,
  noResults,
  suggestions = [],
  highlightedIndex,
  onHover,
  onSelect,
  onClickAway,
}) => {
  if (!open || !anchorEl) return null;

  const width = anchorEl.clientWidth || undefined;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      style={{ zIndex: 1300, width }}
      modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 2, gap: 1 }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Buscando…
              </Typography>
            </Box>
          ) : noResults ? (
            <Box sx={{ py: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Sin resultados
              </Typography>
            </Box>
          ) : (
            <MenuList role="listbox" dense sx={{ py: 0.5, maxHeight: 320, overflowY: "auto" }}>
              {suggestions.map((sp, index) => {
                const product = sp.product || {};
                const isHighlighted = index === highlightedIndex;

                return (
                  <MenuItem
                    key={sp.id ?? index}
                    role="option"
                    aria-selected={isHighlighted}
                    selected={isHighlighted}
                    onMouseEnter={() => onHover?.(index)}
                    onClick={() => onSelect?.(sp)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1, display: "flex", alignItems: "baseline", gap: 1 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      {product.brand_name && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {product.brand_name}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                );
              })}
            </MenuList>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default SearchSuggestions;
