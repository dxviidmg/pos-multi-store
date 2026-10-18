import { PERIODS, getGreeting, getPeriodRange } from "./storeInsights";

const at = (hour) => new Date(2026, 9, 13, hour, 30, 0);

describe("getGreeting", () => {
  it("saluda según la hora", () => {
    expect(getGreeting({ first_name: "David" }, at(8))).toBe("Buenos días, David");
    expect(getGreeting({ first_name: "David" }, at(15))).toBe("Buenas tardes, David");
    expect(getGreeting({ first_name: "David" }, at(21))).toBe("Buenas noches, David");
  });

  it("cambia de saludo a las 12:00 y a las 19:00", () => {
    expect(getGreeting({ first_name: "Ana" }, at(11))).toBe("Buenos días, Ana");
    expect(getGreeting({ first_name: "Ana" }, at(12))).toBe("Buenas tardes, Ana");
    expect(getGreeting({ first_name: "Ana" }, at(18))).toBe("Buenas tardes, Ana");
    expect(getGreeting({ first_name: "Ana" }, at(19))).toBe("Buenas noches, Ana");
  });

  it("usa el usuario con la primera letra en mayúscula si no hay nombre", () => {
    expect(getGreeting({ username: "david" }, at(9))).toBe("Buenos días, David");
  });

  it("sin nombre, solo el saludo", () => {
    expect(getGreeting({}, at(9))).toBe("Buenos días");
    expect(getGreeting(null, at(9))).toBe("Buenos días");
  });
});

describe("getPeriodRange", () => {
  const now = new Date(2026, 9, 13, 10, 0, 0); // 13 de octubre de 2026

  it("hoy y el rango sin fijar son el día de hoy", () => {
    expect(getPeriodRange("today", now)).toEqual({ start_date: "2026-10-13", end_date: "2026-10-13" });
    expect(getPeriodRange("custom", now)).toEqual({ start_date: "2026-10-13", end_date: "2026-10-13" });
  });

  it("ayer", () => {
    expect(getPeriodRange("yesterday", now)).toEqual({ start_date: "2026-10-12", end_date: "2026-10-12" });
  });

  it("últimos 7 días incluyen hoy", () => {
    expect(getPeriodRange("week", now)).toEqual({ start_date: "2026-10-07", end_date: "2026-10-13" });
  });

  it("este mes empieza el día 1", () => {
    expect(getPeriodRange("month", now)).toEqual({ start_date: "2026-10-01", end_date: "2026-10-13" });
  });

  it("cruza el cambio de mes y de año al restar días", () => {
    const newYear = new Date(2027, 0, 2, 10, 0, 0);
    expect(getPeriodRange("yesterday", newYear)).toEqual({ start_date: "2027-01-01", end_date: "2027-01-01" });
    expect(getPeriodRange("week", newYear)).toEqual({ start_date: "2026-12-27", end_date: "2027-01-02" });
  });

  it("no modifica la fecha recibida", () => {
    const original = new Date(2026, 9, 13, 10, 0, 0);
    getPeriodRange("week", original);
    expect(original.getDate()).toBe(13);
  });
});

describe("PERIODS", () => {
  it("cada periodo tiene etiqueta y forma de nombrarse en una frase", () => {
    Object.values(PERIODS).forEach(({ label, noun }) => {
      expect(label).toBeTruthy();
      expect(noun).toBeTruthy();
    });
  });
});
