import StorefrontIcon from "@mui/icons-material/Storefront";
import PrintIcon from "@mui/icons-material/Print";
import WifiIcon from "@mui/icons-material/Wifi";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

export const STORE_UPDATE = "store-update";
export const INTEGRATION_CONSULT = "integration-consult";

export const SERVICES = [
  {
    icon: <StorefrontIcon />,
    title: "Quiero tener x tiendas y y almacenes",
    price: null,
    tag: "Consultar precios",
    notes: "Agrega una nueva tienda o almacén a tu cuenta.",
    action: STORE_UPDATE,
    actionLabel: "Actualizar",
  },
  {
    icon: <PrintIcon />,
    title: "Impresora vía USB",
    price: 0,
    notes: "Implementación de 1 a 2 semanas, según disponibilidad.",
  },
  {
    icon: <WifiIcon />,
    title: "Impresora vía WiFi",
    price: 100,
    notes: "Implementación de 2 a 4 semanas, según disponibilidad.",
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: "Integración con terceros",
    price: null,
    tag: "Precio variable",
    notes: "El precio y la fecha de entrega varía según disponibilidad y complejidad",
    action: INTEGRATION_CONSULT,
    actionLabel: "Consultar",
  },
];
