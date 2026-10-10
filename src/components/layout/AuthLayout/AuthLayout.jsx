import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import CheckIcon from "@mui/icons-material/Check";
import LogoWhite from "../../../assets/images/logo-white.svg";
import { colors } from "../../../theme/colors";

const FEATURES = [
  { Icon: StorefrontOutlinedIcon, title: "Todas tus tiendas", text: "Ventas y caja de cada sucursal en un solo lugar." },
  { Icon: Inventory2OutlinedIcon, title: "Inventario al día", text: "Existencias y alertas de stock en tiempo real." },
  { Icon: SwapHorizOutlinedIcon, title: "Traspasos simples", text: "Mueve producto entre sucursales sin hojas de cálculo." },
];

const brandPanelSx = {
  display: { xs: "none", md: "flex" },
  flex: "0 0 44%", maxWidth: 560,
  position: "sticky", top: 0, height: "100dvh",
  flexDirection: "column", justifyContent: "space-between",
  p: { md: 5, lg: 7 },
  bgcolor: colors.sidebar,
  color: colors.white,
  overflow: "hidden",
  // Brillo suave y trama de puntos: dan profundidad sin competir con el contenido
  backgroundImage: [
    `radial-gradient(520px circle at 85% 8%, ${alpha(colors.secondary, 0.22)}, transparent 60%)`,
    `radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)`,
  ].join(","),
  backgroundSize: "auto, 22px 22px",
};

/** Lista vertical de pasos (registro): completado, actual y pendiente. */
const Stepper = ({ activeStep, stepLabels }) => (
  <Box component="ol" aria-label="Progreso del registro" sx={{ listStyle: "none", m: 0, p: 0 }}>
    {stepLabels.map((label, i) => {
      const done = i < activeStep;
      const current = i === activeStep;
      return (
        <Box component="li" key={label} aria-current={current ? "step" : undefined}
          sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5, position: "relative" }}>
          {i < stepLabels.length - 1 && (
            <Box sx={{
              position: "absolute", left: 15, top: 44, height: 22, width: 2,
              bgcolor: alpha(colors.white, done ? 0.6 : 0.18),
            }} />
          )}
          <Box sx={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: 700,
            bgcolor: current ? colors.accent : done ? alpha(colors.white, 0.9) : "transparent",
            color: current || done ? colors.onAccent : alpha(colors.white, 0.8),
            border: "2px solid",
            borderColor: current ? colors.accent : done ? alpha(colors.white, 0.9) : alpha(colors.white, 0.35),
          }}>
            {done ? <CheckIcon sx={{ fontSize: 18 }} /> : i + 1}
          </Box>
          <Typography sx={{
            fontSize: "0.95rem", fontWeight: current ? 700 : 500,
            color: current ? colors.white : alpha(colors.white, 0.78),
          }}>
            {label}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

/** Pasos horizontales (registro móvil): completado, actual y pendiente. */
const HorizontalStepper = ({ activeStep, stepLabels }) => (
  <Box component="ol" aria-label="Progreso del registro"
    sx={{ listStyle: "none", m: 0, p: 0, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
    {stepLabels.map((label, i) => {
      const done = i < activeStep;
      const current = i === activeStep;
      return (
        <React.Fragment key={label}>
          <Box component="li" aria-current={current ? "step" : undefined}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", fontWeight: 700,
              bgcolor: current ? colors.accent : done ? alpha(colors.white, 0.9) : "transparent",
              color: current || done ? colors.onAccent : alpha(colors.white, 0.8),
              border: "2px solid",
              borderColor: current ? colors.accent : done ? alpha(colors.white, 0.9) : alpha(colors.white, 0.35),
            }}>
              {done ? <CheckIcon sx={{ fontSize: 18 }} /> : i + 1}
            </Box>
            <Typography sx={{
              fontSize: "0.8rem", fontWeight: current ? 700 : 500, whiteSpace: "nowrap",
              color: current ? colors.white : alpha(colors.white, 0.78),
            }}>
              {label}
            </Typography>
          </Box>
          {i < stepLabels.length - 1 && (
            <Box aria-hidden sx={{
              flex: 1, maxWidth: 48, height: 2, mt: "15px", mx: 1,
              bgcolor: alpha(colors.white, done ? 0.6 : 0.18),
            }} />
          )}
        </React.Fragment>
      );
    })}
  </Box>
);

/**
 * Estructura común de login y registro: panel de marca (#0B1B4D) + panel de formulario.
 * Con `stepLabels` el panel de marca muestra el progreso en lugar de los beneficios.
 * En xs (móvil): logo + pasos horizontales arriba + formulario abajo (app-style).
 */
const AuthLayout = ({ children, headline, subtitle, activeStep, stepLabels }) => (
  <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: { xs: "column", md: "row" }, bgcolor: { xs: colors.sidebar, md: "background.default" } }}>
    <Box component="aside" sx={brandPanelSx}>
      <Box component="img" src={LogoWhite} alt="SmartVenta" sx={{ width: '100%', height: "auto" }} />

      <Box>
        <Typography component="p" sx={{
          fontSize: { md: "1.9rem", lg: "2.3rem" }, fontWeight: 800, lineHeight: 1.15,
          letterSpacing: "-0.02em", mb: 1.5, color: colors.white,
        }}>
          {headline}
        </Typography>
        <Typography sx={{ color: alpha(colors.white, 0.8), lineHeight: 1.6, maxWidth: 420, mb: 4 }}>
          {subtitle}
        </Typography>

        {stepLabels ? (
          <Stepper activeStep={activeStep} stepLabels={stepLabels} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {FEATURES.map(({ Icon, title, text }) => (
              <Box key={title} sx={{ display: "flex", gap: 2 }}>
                <Box aria-hidden sx={{
                  width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: alpha(colors.white, 0.08), color: colors.accent,
                  border: `1px solid ${alpha(colors.white, 0.12)}`,
                }}>
                  <Icon fontSize="small" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: alpha(colors.white, 0.75), lineHeight: 1.5 }}>{text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Typography sx={{ fontSize: "0.75rem", color: alpha(colors.white, 0.6) }}>
        © {new Date().getFullYear()} SmartVenta
      </Typography>
    </Box>

    <Box component="main" sx={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      px: { xs: 2, sm: 6 }, py: { xs: 4, md: 6 },
      bgcolor: { xs: colors.sidebar, md: "background.default" },
    }}>
      {/* Desktop: tarjeta blanca con estilos */}
      <Box sx={{ 
        display: { xs: "none", md: "block" },
        width: "100%", 
        maxWidth: 440,
      }}>
        {children}
      </Box>

      {/* Móvil: logo + título + pasos + formulario, centrado vertical */}
      <Box sx={{ 
        display: { xs: "block", md: "none" },
        width: "100%", 
        maxWidth: 360,
        mx: "auto",
      }}>
        {stepLabels && (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2.5 }}>
              <Box component="img" src={LogoWhite} alt="SmartVenta"
                width={144} height="auto" sx={{ width: '100%', height: "auto" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.white, mb: 0.5, textAlign: "center" }}>
              {headline}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha(colors.white, 0.8), mb: 3, textAlign: "center" }}>
              {subtitle}
            </Typography>
            <HorizontalStepper activeStep={activeStep} stepLabels={stepLabels} />
          </>
        )}
        {children}
      </Box>
    </Box>
  </Box>
);

export default AuthLayout;
