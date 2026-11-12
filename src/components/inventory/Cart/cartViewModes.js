import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";

// Vistas del carrito en escritorio (en móvil siempre se usan tarjetas)
export const CART_VIEW = { TABLE: "table", CARDS: "cards" };

export const CART_VIEW_OPTIONS = [
  { value: CART_VIEW.TABLE, label: "Vista de tabla", Icon: ViewAgendaIcon },
  { value: CART_VIEW.CARDS, label: "Vista de tarjetas", Icon: ViewWeekIcon },
];
