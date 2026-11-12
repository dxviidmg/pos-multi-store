import { act, renderHook, waitFor } from "@testing-library/react";
import { useStoreScopedList } from "./useStoreScopedList";
import { logger } from "../utils/logger";

jest.mock("../utils/logger", () => ({ logger: { error: jest.fn() } }));

describe("useStoreScopedList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("carga la lista al montar", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: [{ id: 1 }] });
    const { result } = renderHook(() => useStoreScopedList(fetchFn, "falló"));

    await waitFor(() => expect(result.current.items).toEqual([{ id: 1 }]));
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("recarga cuando cambia la sucursal", async () => {
    const fetchFn = jest.fn()
      .mockResolvedValueOnce({ data: ["a"] })
      .mockResolvedValueOnce({ data: ["b"] });
    const { result } = renderHook(() => useStoreScopedList(fetchFn, "falló"));
    await waitFor(() => expect(result.current.items).toEqual(["a"]));

    await act(async () => { window.dispatchEvent(new Event("store-changed")); });

    await waitFor(() => expect(result.current.items).toEqual(["b"]));
  });

  it("refresh vuelve a pedir la lista", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useStoreScopedList(fetchFn, "falló"));
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1));

    await act(async () => { await result.current.refresh(); });

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("ante un error lo registra y conserva la lista anterior", async () => {
    const failure = new Error("boom");
    const fetchFn = jest.fn().mockResolvedValueOnce({ data: ["a"] }).mockRejectedValueOnce(failure);
    const { result } = renderHook(() => useStoreScopedList(fetchFn, "No se pudo cargar"));
    await waitFor(() => expect(result.current.items).toEqual(["a"]));

    await act(async () => { await result.current.refresh(); });

    expect(logger.error).toHaveBeenCalledWith("No se pudo cargar", failure);
    expect(result.current.items).toEqual(["a"]);
  });

  it("deja de escuchar la sucursal al desmontar", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: [] });
    const { unmount } = renderHook(() => useStoreScopedList(fetchFn, "falló"));
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1));

    unmount();
    window.dispatchEvent(new Event("store-changed"));

    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});
