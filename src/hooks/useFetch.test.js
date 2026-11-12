import { act, renderHook } from "@testing-library/react";
import { useFetch, useFetchWithRetry } from "./useFetch";

jest.mock("../utils/logger", () => ({ logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() } }));

const abortError = () => Object.assign(new Error("timeout"), { name: "CanceledError" });

describe("useFetch", () => {
  it("no pide nada hasta que se llama a refetch", () => {
    const fetchFn = jest.fn();
    renderHook(() => useFetch(fetchFn));
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("guarda los datos y los devuelve", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: { id: 1 } });
    const { result } = renderHook(() => useFetch(fetchFn));

    let returned;
    await act(async () => { returned = await result.current.refetch({ code: "A1" }); });

    expect(fetchFn).toHaveBeenCalledWith({ code: "A1" }, expect.objectContaining({ signal: expect.anything() }));
    expect(returned).toEqual({ id: 1 });
    expect(result.current).toMatchObject({ data: { id: 1 }, loading: false, error: null });
  });

  it("ante un error devuelve el valor inicial y guarda el error", async () => {
    const failure = new Error("boom");
    const fetchFn = jest.fn().mockRejectedValue(failure);
    const { result } = renderHook(() => useFetch(fetchFn, { initialData: [] }));

    let returned;
    await act(async () => { returned = await result.current.refetch(); });

    expect(returned).toEqual([]);
    expect(result.current).toMatchObject({ data: [], loading: false, error: failure });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});

// Entre intentos el hook espera 1 s reales
describe("useFetchWithRetry", () => {
  it("reintenta cuando la petición se cancela por tiempo y termina bien", async () => {
    const fetchFn = jest.fn()
      .mockRejectedValueOnce(abortError())
      .mockResolvedValueOnce({ data: "ok" });
    const { result } = renderHook(() => useFetchWithRetry(fetchFn));

    await act(async () => { await result.current.refetch(); });

    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(result.current.data).toBe("ok");
  });

  it("no reintenta errores que no son de tiempo", async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error("404"));
    const { result } = renderHook(() => useFetchWithRetry(fetchFn));

    await act(async () => { await result.current.refetch(); });

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeTruthy();
  });

  it("se rinde tras los reintentos máximos", async () => {
    const fetchFn = jest.fn().mockRejectedValue(abortError());
    const { result } = renderHook(() => useFetchWithRetry(fetchFn, { maxRetries: 1 }));

    await act(async () => { await result.current.refetch(); });

    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeTruthy();
  });
});
