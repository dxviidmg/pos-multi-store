import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../../../theme";
import AppHeader from "./AppHeader";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: () => mockNavigate }));
jest.mock("../../ui/PageHelp/PageHelp", () => () => <span data-testid="page-help" />);
jest.mock("../../ui/NotificationsMenu/NotificationsMenu", () => () => <span data-testid="notifications" />);
jest.mock("../../ui/PendingMenu/PendingMenu", () => () => <span data-testid="pending" />);
jest.mock("../../ui/DuplicateSalesMenu/DuplicateSalesMenu", () => () => <span data-testid="duplicates" />);
jest.mock("../../ui/StockRequestMenu/StockRequestMenu", () => () => <span data-testid="stock-requests" />);

const owner = { role: "owner", tenant_name: "Demo", store_name: "Principal", store_id: 1 };
const seller = { role: "seller", tenant_name: "Demo", store_name: "Principal", store_id: 1 };

const setup = (user, overrides = {}) => {
  const handlers = { onToggleDrawer: jest.fn(), onToggleTheme: jest.fn(), onBack: jest.fn(), onLogout: jest.fn() };
  render(
    <ThemeProvider theme={getTheme("light")}>
      <MemoryRouter>
        <AppHeader user={user} open={false} themeMode="light" {...handlers} {...overrides} />
      </MemoryRouter>
    </ThemeProvider>
  );
  return handlers;
};

describe("AppHeader", () => {
  beforeEach(() => jest.clearAllMocks());

  it("muestra el negocio y la sucursal; sin sucursal, solo el negocio", () => {
    setup(owner);
    expect(screen.getByText("Demo - Principal")).toBeInTheDocument();
  });

  it("sin sucursal activa muestra solo el nombre del negocio", () => {
    setup({ ...owner, store_name: null, store_id: null });
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Regresar" })).toBeNull();
  });

  it("los botones del header llaman a sus acciones", () => {
    const handlers = setup(owner);
    fireEvent.click(screen.getByRole("button", { name: "Menú" }));
    fireEvent.click(screen.getByRole("button", { name: "Cambiar tema" }));
    fireEvent.click(screen.getByRole("button", { name: "Regresar" }));
    expect(handlers.onToggleDrawer).toHaveBeenCalledTimes(1);
    expect(handlers.onToggleTheme).toHaveBeenCalledTimes(1);
    expect(handlers.onBack).toHaveBeenCalledTimes(1);
  });

  it("solo el dueño dentro de una sucursal ve 'Regresar'", () => {
    setup({ ...owner, role: "admin" });
    expect(screen.queryByRole("button", { name: "Regresar" })).toBeNull();
  });

  it("el vendedor no ve los avisos de duplicadas, ajustes ni notificaciones", () => {
    setup(seller);
    expect(screen.getByTestId("pending")).toBeInTheDocument();
    expect(screen.queryByTestId("duplicates")).toBeNull();
    expect(screen.queryByTestId("stock-requests")).toBeNull();
    expect(screen.queryByTestId("notifications")).toBeNull();
  });

  it("administrador y dueño ven todos los avisos", () => {
    setup(owner);
    ["pending", "duplicates", "stock-requests", "notifications"].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });

  it("el menú del usuario lleva al perfil y cierra sesión", () => {
    const handlers = setup(owner);

    fireEvent.click(screen.getByText("P"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Perfil" }));
    expect(mockNavigate).toHaveBeenCalledWith("/perfil");

    fireEvent.click(screen.getByText("P"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Cerrar sesión" }));
    expect(handlers.onLogout).toHaveBeenCalledTimes(1);
  });
});
