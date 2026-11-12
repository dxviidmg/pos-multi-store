import { render, screen } from "@testing-library/react";
import { FormControl, InputAdornment, InputLabel, MenuItem } from "@mui/material";
import { Select, TextField } from "./Field";

describe("TextField", () => {
  it("pone el ícono según la etiqueta", () => {
    render(<TextField label="Teléfono" />);
    expect(screen.getByTestId("PhoneOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
  });

  it("no pone ícono cuando no hay etiqueta (celdas de tabla, buscadores)", () => {
    render(<TextField placeholder="Buscar..." />);
    expect(screen.queryByTestId(/Icon$/)).toBeNull();
  });

  it("respeta un startAdornment propio", () => {
    render(<TextField label="Pago con" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.queryByTestId("AttachMoneyOutlinedIcon")).toBeNull();
  });

  it("conserva el resto de InputProps, como el adorno del final", () => {
    render(<TextField label="Contraseña" InputProps={{ endAdornment: <span>ver</span> }} />);
    expect(screen.getByTestId("LockOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByText("ver")).toBeInTheDocument();
  });

  it("pasa las demás props al campo", () => {
    render(<TextField label="Nombre" value="Ana" onChange={() => {}} disabled />);
    const input = screen.getByLabelText("Nombre");
    expect(input).toHaveValue("Ana");
    expect(input).toBeDisabled();
  });

  it("no pone ícono si la etiqueta no es texto", () => {
    render(<TextField label={<b>Teléfono</b>} />);
    expect(screen.queryByTestId(/Icon$/)).toBeNull();
  });
});

describe("Select", () => {
  const renderSelect = (props) => render(
    <FormControl>
      <InputLabel id="s">Tipo de movimiento</InputLabel>
      <Select labelId="s" label="Tipo de movimiento" value="a" {...props}>
        <MenuItem value="a">Entrada</MenuItem>
      </Select>
    </FormControl>
  );

  it("pone el ícono según su label", () => {
    renderSelect();
    expect(screen.getByTestId("SwapVertOutlinedIcon")).toBeInTheDocument();
  });

  it("respeta un startAdornment propio", () => {
    renderSelect({ startAdornment: <InputAdornment position="start">★</InputAdornment> });
    expect(screen.getByText("★")).toBeInTheDocument();
    expect(screen.queryByTestId("SwapVertOutlinedIcon")).toBeNull();
  });
});
