import { act, renderHook } from "@testing-library/react";
import { useCatalogPdf } from "./useCatalogPdf";

const mockSave = jest.fn();
const mockBuild = jest.fn();

jest.mock("./catalogPdf", () => ({ buildCatalogPdf: (...args) => mockBuild(...args) }));

it("pasa todas las opciones al generador y guarda el archivo con el nombre del catálogo", async () => {
  mockBuild.mockResolvedValue({ doc: { save: mockSave }, failedImages: 0 });
  const options = { business: "Demo", title: "Lista octubre", validUntil: "2099-12-31", products: [], withImages: false, withWholesale: true };
  const { result } = renderHook(() => useCatalogPdf());

  await act(() => result.current.download(options));

  expect(mockBuild).toHaveBeenCalledWith(options);
  expect(mockSave).toHaveBeenCalledWith(expect.stringMatching(/^catalogo-lista-octubre-\d{4}-\d{2}-\d{2}\.pdf$/));
});
