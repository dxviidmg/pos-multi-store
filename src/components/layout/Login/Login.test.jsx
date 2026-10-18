import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../../../theme";
import Login from "./Login";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockLoginUser = jest.fn();

jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: () => mockNavigate }));
jest.mock("../../../context/UserContext", () => ({ useUser: () => ({ login: mockLogin }) }));
jest.mock("../../../api/login", () => ({ loginUser: (...args) => mockLoginUser(...args) }));

const renderLogin = () => render(
  <ThemeProvider theme={getTheme("light")}>
    <MemoryRouter><Login /></MemoryRouter>
  </ThemeProvider>
);

// El mismo formulario se dibuja para escritorio y para móvil; comparten estado
// Con `required` la etiqueta lleva un asterisco: se busca por el inicio del texto
const field = (label) => screen.getAllByLabelText(new RegExp(`^${label}`));
const type = (label, value) => fireEvent.change(field(label)[0], { target: { value } });
const submit = () => fireEvent.click(screen.getAllByRole("button", { name: /Iniciar sesión/ })[0]);

describe("Login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("dibuja el formulario de escritorio y el de móvil con los mismos campos", () => {
    renderLogin();
    expect(field("Usuario")).toHaveLength(2);
    expect(field("Contraseña")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Crear mi negocio/ })).toHaveLength(2);
  });

  it("el botón de entrar está deshabilitado hasta llenar usuario y contraseña", () => {
    renderLogin();
    const [button] = screen.getAllByRole("button", { name: /Iniciar sesión/ });
    expect(button).toBeDisabled();
    type("Usuario", "ana");
    expect(button).toBeDisabled();
    type("Contraseña", "secreto");
    expect(button).toBeEnabled();
  });

  it("el dueño entra a /tiendas/", async () => {
    mockLoginUser.mockResolvedValue({ data: { role: "owner", token: "t" } });
    renderLogin();
    type("Usuario", "dueno");
    type("Contraseña", "x");
    submit();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/tiendas/"));
    expect(mockLoginUser).toHaveBeenCalledWith({ username: "dueno", password: "x" });
    expect(mockLogin).toHaveBeenCalledWith({ role: "owner", token: "t" });
  });

  it("otro rol entra a /vender/", async () => {
    mockLoginUser.mockResolvedValue({ data: { role: "seller" } });
    renderLogin();
    type("Usuario", "vendedor");
    type("Contraseña", "x");
    submit();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/vender/"));
  });

  it("con el acceso bloqueado va a Mi plan, sea quien sea", async () => {
    mockLoginUser.mockResolvedValue({ data: { role: "owner", access_blocked: true } });
    renderLogin();
    type("Usuario", "dueno");
    type("Contraseña", "x");
    submit();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mi-plan-actual/"));
  });

  it("con credenciales incorrectas muestra el aviso y no navega", async () => {
    mockLoginUser.mockRejectedValue({ response: { status: 400 } });
    renderLogin();
    type("Usuario", "ana");
    type("Contraseña", "mal");
    submit();

    expect((await screen.findAllByText("Usuario o contraseña incorrectos.")).length).toBeGreaterThan(0);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("mostrar la contraseña cambia el tipo del campo", () => {
    renderLogin();
    const [password] = field("Contraseña");
    expect(password).toHaveAttribute("type", "password");
    fireEvent.click(screen.getAllByRole("button", { name: "Mostrar contraseña" })[0]);
    expect(field("Contraseña")[0]).toHaveAttribute("type", "text");
  });

  it("'Crear mi negocio' lleva al registro", () => {
    renderLogin();
    fireEvent.click(screen.getAllByRole("button", { name: /Crear mi negocio/ })[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/registrarme");
  });
});
