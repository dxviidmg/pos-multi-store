import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { getFieldIcon } from "./fieldIcons";

describe("getFieldIcon", () => {
  it.each([
    ["Contraseña", LockOutlinedIcon],
    ["Nueva contraseña", LockOutlinedIcon],
    ["Teléfono", PhoneOutlinedIcon],
    ["Nombre", PersonOutlineIcon],
    ["Apellidos", PersonOutlineIcon],
    ["Monto", AttachMoneyOutlinedIcon],
    ["Precio mayoreo", AttachMoneyOutlinedIcon],
    ["Fecha de inicio", CalendarTodayOutlinedIcon],
    ["Folio", TagOutlinedIcon],
    ["# Venta", TagOutlinedIcon],
    ["Tipo de movimiento", SwapVertOutlinedIcon],
    ["Referencia de pago", ReceiptLongOutlinedIcon],
  ])("%s usa el ícono esperado", (label, Icon) => {
    expect(getFieldIcon(label)).toBe(Icon);
  });

  it("no distingue acentos ni mayúsculas", () => {
    expect(getFieldIcon("TELÉFONO")).toBe(PhoneOutlinedIcon);
    expect(getFieldIcon("telefono")).toBe(PhoneOutlinedIcon);
  });

  it("las reglas más específicas ganan a las generales", () => {
    // "devolución" sola sería dinero, pero el motivo es texto libre
    expect(getFieldIcon("Motivo de devolución")).toBe(NotesOutlinedIcon);
    expect(getFieldIcon("Usuario y contraseña")).toBe(LockOutlinedIcon);
    expect(getFieldIcon("Nombre del negocio")).toBe(StorefrontOutlinedIcon);
  });

  it("una etiqueta sin regla recibe el lápiz", () => {
    expect(getFieldIcon("Algo muy raro")).toBe(EditOutlinedIcon);
  });
});
