import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import CustomTooltip from "../../ui/Tooltip";
import noPhoto from "../../../assets/images/noPhoto.webp";

/** Botón de ícono para la barra de acciones de `GridCardBase`. */
export const GridCardAction = ({ text, onClick, Icon }) => (
  <CustomTooltip text={text}>
    <IconButton size="small" onClick={onClick} sx={{ color: "primary.main" }}>
      <Icon fontSize="small" />
    </IconButton>
  </CustomTooltip>
);

/**
 * Tarjeta de producto para vistas de galería: imagen, marca, nombre, líneas de datos
 * (`children`, normalmente `LabelValue`) y barra de acciones opcional (`actions`).
 * Con `onClick`, la imagen y los datos son clickeables.
 */
const GridCardBase = ({ image, name, brandName, onClick, children, actions }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.2s ease",
      "&:hover": {
        boxShadow: 3,
        borderColor: "primary.light",
      },
    }}
  >
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        height: 140,
        overflow: "hidden",
        bgcolor: "action.hover",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": {
          "& .grid-card-image": { transform: "scale(1.04)" },
        },
      }}
    >
      <Box
        component="img"
        className="grid-card-image"
        src={image || noPhoto}
        alt={name || "Producto"}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = noPhoto; }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.3s ease",
        }}
      />
    </Box>

    <Box
      onClick={onClick}
      sx={{
        px: 1.5,
        pt: 1.25,
        pb: 0.75,
        flex: 1,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        ...(onClick && { "&:hover": { bgcolor: "action.hover" } }),
      }}
    >
      {brandName && (
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: 500,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0.5,
          }}
        >
          {brandName}
        </Typography>
      )}

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "text.primary",
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          mb: 0.75,
        }}
      >
        {name || "Producto"}
      </Typography>

      {children}
    </Box>

    {actions && (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          px: 1,
          pb: 1,
          justifyContent: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 0.75,
        }}
      >
        {actions}
      </Stack>
    )}
  </Box>
);

export default GridCardBase;
