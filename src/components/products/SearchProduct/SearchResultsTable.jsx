import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/currency";
import { MOVEMENT_TYPES } from "../../../constants";

const renderPrices = ({ product: { prices } }) =>
  prices.apply_wholesale ? (
    <>
      Men: {formatCurrency(prices.unit_price)}
      <br />
      May: {formatCurrency(prices.wholesale_price)} ({prices.min_wholesale_quantity}+)
    </>
  ) : (
    formatCurrency(prices.unit_price)
  );

/**
 * Resultados de la búsqueda por código o nombre con acciones: agregar al carrito,
 * ver stock en otras tiendas (multi-sucursal) y ver imagen.
 */
const SearchResultsTable = ({ data, movementType, allowTransfer, onAdd, onOpenStock }) => (
  <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
    <SimpleTable
      noDataComponent="Sin resultados"
      data={data}
      columns={[
        { name: "Código", selector: (row) => row.product.code },
        { name: "Marca", selector: (row) => row.product.brand_name },
        { name: "Nombre", selector: (row) => row.product.name },
        { name: "Stock", selector: (row) => row.available_stock },
        { name: "Precios", cell: renderPrices },
        {
          name: "Acciones",
          width: 180,
          cell: (row) => (
            <>
              <CustomTooltip text="Agregar al carrito">
                <CustomButton
                  onClick={() => onAdd(row)}
                  disabled={movementType === MOVEMENT_TYPES.SALE && row.available_stock === 0}
                >
                  <AddIcon />
                </CustomButton>
              </CustomTooltip>

              {allowTransfer && (
                <CustomTooltip text="Ver stock en todas las tiendas">
                  <CustomButton onClick={() => onOpenStock({ ...row, onlyRead: true })}>
                    <InventoryIcon />
                  </CustomButton>
                </CustomTooltip>
              )}

              <CustomTooltip text="Ver imagen del producto">
                <CustomButton onClick={() => onOpenStock({ ...row, showImage: true })} disabled={!row.product.image}>
                  <RemoveRedEyeIcon />
                </CustomButton>
              </CustomTooltip>
            </>
          ),
        },
      ]}
    />
  </Box>
);

export default SearchResultsTable;
