import { formatCurrency, formatNumber, roundUpCustom } from "./currency";

describe("formatNumber", () => {
  it("separa miles y no muestra decimales por defecto", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
    expect(formatNumber(2.6)).toBe("3");
  });

  it("acepta decimales con maximumFractionDigits", () => {
    expect(formatNumber(2.5, { maximumFractionDigits: 3 })).toBe("2.5");
    expect(formatNumber(1234.56789, { maximumFractionDigits: 3 })).toBe("1,234.568");
  });

  it("trata valores vacíos como cero", () => {
    expect(formatNumber(undefined)).toBe("0");
    expect(formatNumber(null)).toBe("0");
    expect(formatNumber("abc")).toBe("0");
  });
});

describe("formatCurrency", () => {
  it("usa el formato $1,234.00", () => {
    expect(formatCurrency(1234)).toBe("$1,234.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("roundUpCustom", () => {
  it.each([
    [10, 10],
    [10.2, 10.5],
    [10.5, 10.5],
    [10.51, 11],
    [10.99, 11],
  ])("%s se cobra como %s", (value, expected) => {
    expect(roundUpCustom(value)).toBe(expected);
  });
});
