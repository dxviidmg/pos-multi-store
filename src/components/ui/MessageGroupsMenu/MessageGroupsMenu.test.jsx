import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import InboxIcon from "@mui/icons-material/Inbox";
import MessageGroupsMenu from "./MessageGroupsMenu";

const renderMenu = (fetchFn) => render(
  <MessageGroupsMenu
    icon={<InboxIcon />}
    title="Movimientos pendientes"
    fetchFn={fetchFn}
    errorMessage="falló"
    emptyIcon={InboxIcon}
    emptyText="Sin pendientes"
  />
);

describe("MessageGroupsMenu", () => {
  it("suma los mensajes de todos los grupos en el contador", async () => {
    const groups = [
      { title: "Traspasos", messages: ["T-1 pendiente", "T-2 pendiente"] },
      { title: "Distribuciones", messages: ["D-1 pendiente"] },
    ];
    renderMenu(jest.fn().mockResolvedValue({ data: groups }));

    expect(await screen.findByText("3")).toBeInTheDocument();
  });

  it("muestra los grupos con sus mensajes al abrir el menú", async () => {
    const groups = [{ title: "Traspasos", messages: ["T-1 pendiente"] }];
    renderMenu(jest.fn().mockResolvedValue({ data: groups }));
    await screen.findByText("1");

    fireEvent.click(screen.getByRole("button", { name: /Movimientos pendientes/ }));

    expect(await screen.findByText("Traspasos")).toBeInTheDocument();
    expect(screen.getByText("• T-1 pendiente")).toBeInTheDocument();
  });

  it("sin grupos muestra el texto de vacío", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: [] });
    renderMenu(fetchFn);
    await waitFor(() => expect(fetchFn).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: /Movimientos pendientes/ }));

    expect(await screen.findByText("Sin pendientes")).toBeInTheDocument();
  });
});
