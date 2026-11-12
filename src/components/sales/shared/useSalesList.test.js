import { act, renderHook, waitFor } from "@testing-library/react";
import { useSalesList } from "./useSalesList";
import { getSales } from "../../../api/sales";
import { showRequestError } from "../../../utils/alerts";

jest.mock("../../../api/sales", () => ({ getSales: jest.fn() }));
jest.mock("../../../utils/alerts", () => ({ showRequestError: jest.fn() }));

const deferred = () => {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
};

// Los filtros son estado en las pantallas: el objeto debe ser estable entre renders
const TODAY = { date: "2026-10-13" };
const NO_FILTERS = {};

describe("useSalesList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("pide las ventas con los filtros y las devuelve", async () => {
    getSales.mockResolvedValue({ data: [{ id: 1 }] });
    const { result } = renderHook(() => useSalesList(TODAY, "cargar las ventas"));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getSales).toHaveBeenCalledWith({ date: "2026-10-13" });
    expect(result.current.sales).toEqual([{ id: 1 }]);
  });

  it("vuelve a pedir cuando cambian los filtros", async () => {
    getSales.mockResolvedValueOnce({ data: [{ id: 1 }] }).mockResolvedValueOnce({ data: [{ id: 2 }] });
    const { result, rerender } = renderHook(({ params }) => useSalesList(params, "cargar"), {
      initialProps: { params: { date: "a" } },
    });
    await waitFor(() => expect(result.current.sales).toEqual([{ id: 1 }]));

    rerender({ params: { date: "b" } });

    await waitFor(() => expect(result.current.sales).toEqual([{ id: 2 }]));
    expect(getSales).toHaveBeenCalledTimes(2);
  });

  it("descarta la respuesta vieja si llegó después de cambiar los filtros", async () => {
    const first = deferred();
    getSales.mockReturnValueOnce(first.promise).mockResolvedValueOnce({ data: [{ id: "nueva" }] });
    const { result, rerender } = renderHook(({ params }) => useSalesList(params, "cargar"), {
      initialProps: { params: { date: "a" } },
    });

    rerender({ params: { date: "b" } });
    await waitFor(() => expect(result.current.sales).toEqual([{ id: "nueva" }]));

    await act(async () => { first.resolve({ data: [{ id: "vieja" }] }); });

    expect(result.current.sales).toEqual([{ id: "nueva" }]);
    expect(result.current.loading).toBe(false);
  });

  it("avisa el error con la acción indicada", async () => {
    const failure = new Error("boom");
    getSales.mockRejectedValue(failure);
    const { result } = renderHook(() => useSalesList(NO_FILTERS, "cargar los apartados"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(showRequestError).toHaveBeenCalledWith("cargar los apartados", failure);
    expect(result.current.sales).toEqual([]);
  });

  it("setSales actualiza una fila sin volver a pedir", async () => {
    getSales.mockResolvedValue({ data: [{ id: 1 }] });
    const { result } = renderHook(() => useSalesList(NO_FILTERS, "cargar"));
    await waitFor(() => expect(result.current.sales).toHaveLength(1));

    act(() => { result.current.setSales([{ id: 1, paid: 50 }]); });

    expect(result.current.sales).toEqual([{ id: 1, paid: 50 }]);
    expect(getSales).toHaveBeenCalledTimes(1);
  });
});
