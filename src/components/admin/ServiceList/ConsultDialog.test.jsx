import { fireEvent, render, screen } from "@testing-library/react";
import ConsultDialog from "./ConsultDialog";
import { INTEGRATION_CONSULT, STORE_UPDATE } from "./services";

const storeUpdate = { title: "Quiero tener x tiendas y y almacenes", action: STORE_UPDATE };
const integration = { title: "Integración con terceros", action: INTEGRATION_CONSULT };

describe("ConsultDialog", () => {
  let openSpy;

  beforeEach(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => openSpy.mockRestore());

  describe("ampliar sucursales", () => {
    const setup = (onClose = jest.fn()) => {
      render(<ConsultDialog service={storeUpdate} current={{ stores: 1, warehouses: 0 }} onClose={onClose} />);
      return onClose;
    };

    it("muestra lo que tiene hoy y arranca con esas cantidades", () => {
      setup();
      expect(screen.getByText("1 tienda y 0 almacenes")).toBeInTheDocument();
      expect(screen.getByLabelText("Cantidad de tiendas")).toHaveValue(1);
      expect(screen.getByLabelText("Cantidad de almacenes")).toHaveValue(0);
    });

    it("no deja enviar hasta pedir más de algún tipo", () => {
      setup();
      const send = screen.getByRole("button", { name: /Enviar/ });
      expect(send).toBeDisabled();

      fireEvent.change(screen.getByLabelText("Cantidad de almacenes"), { target: { value: "2" } });
      expect(send).toBeEnabled();
    });

    it("muestra el total de sucursales que pide", () => {
      setup();
      fireEvent.change(screen.getByLabelText("Cantidad de tiendas"), { target: { value: "3" } });
      expect(screen.getByText("3 sucursales")).toBeInTheDocument();
    });

    it("abre WhatsApp con el mensaje y se cierra al enviar", () => {
      const onClose = setup();
      fireEvent.change(screen.getByLabelText("Cantidad de tiendas"), { target: { value: "3" } });
      fireEvent.click(screen.getByRole("button", { name: /Enviar/ }));

      expect(openSpy).toHaveBeenCalledTimes(1);
      const [url, target] = openSpy.mock.calls[0];
      expect(url).toContain("api.whatsapp.com/send");
      expect(decodeURIComponent(url)).toContain("quiero tener 3 tiendas y 0 almacenes");
      expect(target).toBe("_blank");
      expect(onClose).toHaveBeenCalled();
    });

    it("Cancelar cierra sin abrir WhatsApp", () => {
      const onClose = setup();
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(onClose).toHaveBeenCalled();
      expect(openSpy).not.toHaveBeenCalled();
    });
  });

  describe("consulta libre", () => {
    it("pide el texto y solo deja enviar cuando no está vacío", () => {
      render(<ConsultDialog service={integration} current={{ stores: 0, warehouses: 0 }} onClose={jest.fn()} />);
      const send = screen.getByRole("button", { name: /Enviar/ });
      const field = screen.getByRole("textbox", { name: "¿Qué deseas preguntar?" });

      expect(send).toBeDisabled();
      fireEvent.change(field, { target: { value: "   " } });
      expect(send).toBeDisabled();
      fireEvent.change(field, { target: { value: "¿Cuánto cuesta?" } });
      expect(send).toBeEnabled();

      fireEvent.click(send);
      expect(decodeURIComponent(openSpy.mock.calls[0][0])).toContain(
        "solicitar cambios en Integración con terceros: ¿Cuánto cuesta?"
      );
    });
  });
});
