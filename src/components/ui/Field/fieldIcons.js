import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// Ícono de cada campo según su etiqueta (sin acentos ni mayúsculas); el primero que coincide gana.
const FIELD_ICONS = [
  [/contrasena/, LockOutlinedIcon],
  [/clave/, VpnKeyOutlinedIcon],
  [/correo|email/, EmailOutlinedIcon],
  [/telefono/, PhoneOutlinedIcon],
  [/direccion/, PlaceOutlinedIcon],
  [/referencia/, ReceiptLongOutlinedIcon],
  [/motivo|descripcion|concepto|pregunta|notas/, NotesOutlinedIcon],
  [/negocio|tienda|sucursal|almacen|nombre corto/, StorefrontOutlinedIcon],
  [/destino|origen/, SwapHorizOutlinedIcon],
  [/movimiento/, SwapVertOutlinedIcon],
  [/fecha|creacion|rango|periodo|\bano\b|\bmes\b/, CalendarTodayOutlinedIcon],
  [/descuento|porcentaje/, LocalOfferOutlinedIcon],
  [/costo|precio|monto|total|pagado|deuda|pago con|cambio|cobrar|devolucion/, AttachMoneyOutlinedIcon],
  [/codigo|folio|#/, TagOutlinedIcon],
  [/meses/, HistoryOutlinedIcon],
  [/factor/, CalculateOutlinedIcon],
  [/cantidad|stock|producto/, Inventory2OutlinedIcon],
  [/marca/, BrandingWatermarkOutlinedIcon],
  [/departamento/, CategoryOutlinedIcon],
  [/unidad/, StraightenOutlinedIcon],
  [/buscar|busqueda/, SearchOutlinedIcon],
  [/nombre|apellido|cliente|vendedor|administrador|usuario/, PersonOutlineIcon],
  [/estado|tipo|accion|modo|visualizacion|patron/, TuneOutlinedIcon],
];

const normalize = (label) => label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Ícono para una etiqueta de campo (si no hay coincidencia, un lápiz). */
export const getFieldIcon = (label) => {
  const text = normalize(label);
  return FIELD_ICONS.find(([pattern]) => pattern.test(text))?.[1] ?? EditOutlinedIcon;
};
