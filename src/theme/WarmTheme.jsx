import { useMemo } from "react";
import { Box } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { getTheme } from "./theme";
import { getCssVariables } from "./cssVariables";

// Espejo del padding de <main> en MainLayout, para que el fondo cálido llegue a los bordes
const BLEED = { xs: 1.5, sm: 2, md: 3 };
const negative = (value) => Object.fromEntries(Object.entries(value).map(([key, size]) => [key, -size]));

/**
 * Pantalla con la paleta cálida (neutros arena, azul de la app y ámbar de detalle). Anida un tema propio
 * y publica sus variables CSS solo dentro de este bloque; el resto de la app no cambia.
 * Los modales y menús que se abren en portales deben renderizarse fuera de este bloque.
 */
const WarmTheme = ({ children }) => {
  const { mode } = useTheme().palette;
  const theme = useMemo(() => getTheme(mode, "warm"), [mode]);
  const variables = useMemo(() => getCssVariables(mode, "warm"), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          ...variables,
          bgcolor: "background.default",
          color: "text.primary",
          mx: negative(BLEED), mt: negative(BLEED), mb: negative(BLEED),
          px: BLEED, pt: BLEED, pb: BLEED,
          minHeight: "calc(100vh - 64px)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default WarmTheme;
