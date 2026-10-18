import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../../../theme";
import ProductCatalog from "./ProductCatalog";

const mockDownload = jest.fn();
const mockGetProducts = jest.fn();

jest.mock("../../../context/UserContext", () => ({ useUser: () => ({ user: { role: "owner", tenant_name: "Mi Negocio" } }) }));
jest.mock("../../../api/products", () => ({ getProducts: (...args) => mockGetProducts(...args) }));
jest.mock("../shared/useCatalogOptions", () => ({
  useCatalogOptions: () => ({
    brands: [{ id: "1", name: "Marca A", product_count: 2 }],
    departments: [{ id: "9", name: "Abarrotes", product_count: 1 }],
    loaded: true,
  }),
}));
jest.mock("./useCatalogPdf", () => ({ useCatalogPdf: () => ({ generating: false, download: mockDownload }) }));
jest.mock("../../ui/DataTable/DataTable", () => ({ columns, data, noDataComponent, selectedIds, setSelectedRows }) => (
  data.length === 0 ? <p>{noDataComponent}</p> : (
    <table><tbody>
      {data.map((row) => (
        <tr key={row.id}>
          <td>
            <input
              type="checkbox"
              aria-label={`Incluir ${row.name}`}
              checked={selectedIds.includes(row.id)}
              onChange={(e) => setSelectedRows(data.filter((item) => (item.id === row.id ? e.target.checked : selectedIds.includes(item.id))))}
            />
          </td>
          {columns.map((c) => <td key={c.name}>{c.selector(row)}</td>)}
        </tr>
      ))}
    </tbody></table>
  )
));

const renderPage = () => render(
  <ThemeProvider theme={getTheme("light")}>
    <MemoryRouter><ProductCatalog /></MemoryRouter>
  </ThemeProvider>
);

beforeEach(() => {
  mockDownload.mockClear();
  mockGetProducts.mockResolvedValue({ data: [{ id: 1, code: "A1", name: "Leche", unit_price: 20, stock: 5, image: "x.jpg" }, { id: 2, code: "B2", name: "Agotado", unit_price: 9, stock: 0, image: null }] });
});

describe("ProductCatalog", () => {
  it("sin selección invita a elegir y deshabilita el PDF", () => {
    renderPage();
    expect(screen.getByText("Elige una marca o un departamento para ver sus productos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Descargar PDF/ })).toBeDisabled();
  });

  it("al elegir una marca lista sus productos y descarga el PDF", async () => {
    renderPage();
    fireEvent.mouseDown(screen.getByLabelText("Marca"));
    fireEvent.click(await screen.findByText("Marca A (2)"));

    expect(await screen.findByText("Leche")).toBeInTheDocument();
    expect(mockGetProducts).toHaveBeenCalledWith({ brand_id: "1" });

    const button = screen.getByRole("button", { name: /Descargar PDF/ });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Nombre del catálogo/), { target: { value: " Lista octubre " } });
    fireEvent.change(screen.getByLabelText(/Válido hasta/), { target: { value: "2099-12-31" } });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);
    expect(mockDownload).toHaveBeenCalledWith({
      business: "Mi Negocio",
      title: "Lista octubre",
      validUntil: "2099-12-31",
      products: [{ id: 1, code: "A1", name: "Leche", unit_price: 20, stock: 5, image: "x.jpg" }],
      withImages: true,
      withWholesale: true,
    });
  });

  it("muestra la cobertura de imágenes y los productos sin stock solo si se piden", async () => {
    renderPage();
    fireEvent.mouseDown(screen.getByLabelText("Marca"));
    fireEvent.click(await screen.findByText("Marca A (2)"));

    expect(await screen.findByText(/1 de 1 productos tienen imagen \(100 %\)/)).toBeInTheDocument();
    expect(screen.getByText(/1 de 2 productos no tienen stock \(50 %\)/)).toBeInTheDocument();
    expect(screen.queryByText("Agotado")).not.toBeInTheDocument();
    expect(screen.getByText(/0 de 1 productos tienen precio de mayoreo \(0 %\)/)).toBeInTheDocument();
    expect(screen.getByLabelText("Incluir imágenes")).toBeDisabled();

    fireEvent.click(screen.getByLabelText("Incluir productos sin stock"));
    expect(await screen.findByText("Agotado")).toBeInTheDocument();
    expect(screen.getByText(/1 de 2 productos tienen imagen \(50 %\)/)).toBeInTheDocument();
    expect(screen.getByLabelText("Incluir imágenes")).toBeEnabled();
  });

  it("un producto desmarcado no entra al PDF ni a los porcentajes", async () => {
    renderPage();
    fireEvent.click(screen.getByLabelText("Incluir productos sin stock"));
    fireEvent.mouseDown(screen.getByLabelText("Marca"));
    fireEvent.click(await screen.findByText("Marca A (2)"));
    fireEvent.change(screen.getByLabelText(/Nombre del catálogo/), { target: { value: "Lista" } });
    fireEvent.change(screen.getByLabelText(/Válido hasta/), { target: { value: "2099-12-31" } });

    expect(await screen.findByText(/1 de 2 productos tienen imagen \(50 %\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Incluir Agotado"));
    expect(await screen.findByText(/1 de 1 productos tienen imagen \(100 %\)/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Descargar PDF/ }));
    expect(mockDownload).toHaveBeenCalledWith(expect.objectContaining({
      products: [expect.objectContaining({ id: 1 })],
    }));
  });
});
