import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Offcanvas } from "react-bootstrap";
import { getUserData } from "../apis/utils";
import Logo from "../../assets/images/logo.jpg";
import "./navbar.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const user = getUserData();
  const expand = false;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBack = () => {
    const updatedUser = { ...user, store_type: "", store_name: "", store_id: "" };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/tiendas/");
    window.location.reload();
  };

  // Define enlaces por tipo de usuario/store
  const linksByType = {
    T: [
      { label: "Vender", href: "/vender/" },
      { label: "Clientes", href: "/clientes/", hidden: user.role === "seller" },
      { label: "Distribuciones", href: "/distribuciones/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Productos", href: "/productos/" },
          { label: "Importar Productos", href: "/importar-productos/" },
          { divider: true },
          { label: "Inventario", href: "/inventario/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { divider: true },
          { label: "Logs", href: "/logs/" },
        ],
      },
      {
        label: "Ventas",
        dropdown: [
          { label: "Corte de caja", href: "/corte-caja/", hidden: user.role === "seller" },
          { label: "Movimientos de caja", href: "/movimientos/", hidden: user.role === "seller" },
          { label: "Ventas", href: "/ventas/" },
          { divider: true },
          { label: "Importar ventas", href: "/importar-ventas/" },
        ],
      },
    ],
    A: [
      { label: "Distribuir", href: "/distribuir/" },
      { label: "Distribuciones", href: "/distribuciones/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Productos", href: "/productos/" },
          { label: "Importar Productos", href: "/importar-productos/" },
          { divider: true },
          { label: "Inventario", href: "/inventario/" },
          { label: "Importar inventario", href: "/importar-inventario/" },
          { divider: true },
          { label: "Logs", href: "/logs/" },
        ],
      },
    ],
    G: [
      { label: "Tiendas", href: "/tiendas/" },
      {
        label: "Productos",
        dropdown: [
          { label: "Marcas", href: "/marcas/" },
          { label: "Departamentos", href: "/departamentos/" },
          { label: "Reasignación", href: "/reasignacion/" },
          { divider: true },
          { label: "Productos", href: "/productos/" },
          { label: "Importar Productos", href: "/importar-productos/" },
        ],
      },
      {
        label: "Dashboard",
        dropdown: [
          { label: "General", href: "/tablero/" },
          { label: "Auditoria", href: "/tablero-auditoria/" },
        ],
      },
      { label: "Clientes", href: "/clientes/" },
      ...(user.sellers > 0 ? [{ label: "Vendedores", href: "/vendedores/" }] : []),
      { label: "Mensualidades", href: "/pagos/" },
      { label: "Otros servicios", href: "/servicios/" },
    ],
  };

  const renderLinks = () => {
    const type = user.store_type === "T" ? "T" : user.store_type === "A" ? "A" : "G";
    return linksByType[type].map((item, idx) => {
      if (item.hidden) return null;
      if (item.dropdown) {
        return (
          <NavDropdown key={idx} title={item.label} className="custom-dropdown">
            {item.dropdown.map((d, i) =>
              d.divider ? (
                <NavDropdown.Divider key={i} />
              ) : d.hidden ? null : (
                <NavDropdown.Item key={i} href={d.href}>
                  {d.label}
                </NavDropdown.Item>
              )
            )}
          </NavDropdown>
        );
      }
      return (
        <Nav.Link key={idx} href={item.href} onClick={item.onClick}>
          {item.label}
        </Nav.Link>
      );
    });
  };

  return (
    <Navbar key={expand} expand={expand} className="mb-3 custom-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
          <img
            src={Logo}
            width="100"
            height="40"
            className="d-inline-block align-top"
            alt="Logo"
            aria-controls={`offcanvasNavbar-expand-${expand}`}
          />
        </Navbar.Toggle>

        <div className="d-flex align-items-center gap-3">
          <NavDropdown
            title={user.store_name || user.tenant_name}
            className="custom-dropdown"
          >
            <NavDropdown.Item>Negocio: {user.tenant_name}</NavDropdown.Item>
            <NavDropdown.Item>Usuario: {user.full_name}</NavDropdown.Item>
          </NavDropdown>

          {user.role === "owner" && user.store_id && (
            <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
          )}

          <Nav.Link href="/" onClick={handleLogout}>
            Salir
          </Nav.Link>
        </div>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="start"
        >
          <Offcanvas.Header closeButton className="custom-navbar">
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="custom-navbar">
            <Nav className="justify-content-end flex-grow-1 pe-3">{renderLinks()}</Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
