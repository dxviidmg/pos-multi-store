import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../../../theme";
import StoreList from "./StoreList";

const mockUser = { role: "owner", store_type: null, store_id: null, multistore: true, first_name: "David" };
const mockStores = {
  stores: [
    { id: 1, name: "Principal", has_all_products: true, printer: null, manager: null, cash_summary: { total_day: 0, EF: 0, TA: 0, TR: 0 } },
    { id: 2, name: "Secundaria", has_all_products: false, printer: null, manager: null, cash_summary: { total_day: 0, EF: 0, TA: 0, TR: 0 } },
  ],
  totals: { total_day: 0, total_sales: 0, profit: 0, EF: 0, TA: 0, TR: 0 },
};
const mockUseStores = jest.fn();
const mockCanCreate = jest.fn();

jest.mock("../../../context/UserContext", () => ({ useUser: () => ({ user: mockUser }) }));
jest.mock("../../../hooks/useStores", () => ({ useStores: (...args) => mockUseStores(...args) }));
jest.mock("../../../hooks/useTenantInfo", () => ({ useTenantInfo: () => ({ data: { product_count: 120, notices: [] }, isLoading: false }) }));
jest.mock("../../../hooks/useDepartments", () => ({ useDepartments: () => ({ data: [{ id: 5, name: "Abarrotes", product_count: 10 }] }) }));
jest.mock("../../../hooks/useSwitchStore", () => ({ useSwitchStore: () => ({ switchStore: jest.fn() }) }));
jest.mock("../../../hooks/useCanCreateStore", () => ({ useCanCreateStore: () => ({ data: mockCanCreate(), refetch: jest.fn() }) }));
jest.mock("../../../hooks/useUserManagement", () => ({ useUserManagement: () => ({ handleOpenEditUser: jest.fn(), handleOpenChangePassword: jest.fn() }) }));
jest.mock("../../../api/stores", () => ({ getInvestment: jest.fn() }));
jest.mock("../../ui/UserModals/UserManagementModals", () => () => null);
jest.mock("./StorePaymentModal", () => () => null);
jest.mock("./CreateStoreModal", () => () => null);
// DataGrid no pinta filas en jsdom (no tiene alto): se sustituye por una tabla simple
jest.mock("../../ui/DataTable/DataTable", () => ({ columns, data }) => (
  <table>
    <thead><tr>{columns.map((c) => <th key={c.name}>{c.name}</th>)}</tr></thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id}>{columns.map((c) => <td key={c.name}>{c.cell ? c.cell(row) : c.selector?.(row)}</td>)}</tr>
      ))}
    </tbody>
  </table>
));

const renderPage = () => render(
  <ThemeProvider theme={getTheme("light")}>
    <MemoryRouter><StoreList /></MemoryRouter>
  </ThemeProvider>
);

beforeEach(() => {
  mockUseStores.mockReturnValue({ data: mockStores, isLoading: false });
  mockCanCreate.mockReturnValue({ can_create: true });
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 9, 13, 9, 0, 0));
});

afterEach(() => jest.useRealTimers());

describe("StoreList", () => {
  it("muestra el saludo, el título y las tarjetas de métricas", () => {
    renderPage();
    expect(screen.getByText("Buenos días, David")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tiendas" })).toBeInTheDocument();
    expect(screen.getByText("Monto vendido hoy")).toBeInTheDocument();
    expect(screen.getByText("Aún no hay ventas hoy")).toBeInTheDocument();
    expect(screen.getByText("Tickets cobrados en el periodo")).toBeInTheDocument();
    expect(screen.getByText("Aparece con tu primera venta")).toBeInTheDocument();
    expect(screen.getByText("Registrados en tu catálogo")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("desglosa el monto por forma de pago", () => {
    renderPage();
    ["Efectivo", "Tarjeta", "Transferencia"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it("lista las tiendas y pide los datos de hoy", () => {
    renderPage();
    expect(screen.getByText("Principal")).toBeInTheDocument();
    expect(screen.getByText("Secundaria")).toBeInTheDocument();
    expect(mockUseStores).toHaveBeenCalledWith(expect.objectContaining({
      start_date: "2026-10-13", end_date: "2026-10-13", store_type: "T",
    }));
  });

  it("cambiar el periodo pide otro rango de fechas", () => {
    renderPage();
    fireEvent.mouseDown(screen.getByText(/Periodo:/));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("Ayer"));
    expect(mockUseStores).toHaveBeenLastCalledWith(expect.objectContaining({
      start_date: "2026-10-12", end_date: "2026-10-12",
    }));
    expect(screen.getByText("Monto vendido ayer")).toBeInTheDocument();
  });

  it("la pestaña Almacenes cambia el título y el tipo de sucursal", () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Almacenes" }));
    expect(screen.getByRole("heading", { name: "Almacenes" })).toBeInTheDocument();
    expect(mockUseStores).toHaveBeenLastCalledWith(expect.objectContaining({ store_type: "A" }));
  });

  it("las pastillas de vista traen un contador y filtran el catálogo incompleto", () => {
    renderPage();
    const incomplete = screen.getByRole("tab", { name: /Catálogo incompleto/ });
    fireEvent.click(incomplete);
    expect(screen.queryByText("Principal")).toBeNull();
    expect(screen.getByText("Secundaria")).toBeInTheDocument();
  });

  it("con el plan al límite, 'Crear tienda' queda deshabilitado", () => {
    mockCanCreate.mockReturnValue({ can_create: false });
    renderPage();
    expect(screen.getByRole("button", { name: /Crear tienda/ })).toBeDisabled();
  });

  it("'Ampliar plan' lleva a Mi plan", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /Ampliar plan/ })).toHaveAttribute("href", "/mi-plan-actual/");
  });
});
