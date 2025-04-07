import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { getUserData } from "../apis/utils";
import Logo from "../../assets/images/logo.jpg";
import "./navbar.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBack = () => {
    const updatedUser = {
      ...user,
      store_type: "",
      store_name: "",
      store_id: "",
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/tiendas/");
    window.location.reload();
  };

  const renderStoreLinks = () => (
    <>
      <Nav.Link href="/vender/">Vender</Nav.Link>
      <Nav.Link href="/clientes/" hidden={user.role === "seller"}>
        Clientes
      </Nav.Link>
      <NavDropdown
        title="Productos"
        className="custom-dropdown"
        hidden={user.role === "seller"}
      >
        <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
        <NavDropdown.Item href="/departamentos/">
          Departamentos
        </NavDropdown.Item>
        <NavDropdown.Item href="/reasignacion/">Reasignación</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/productos/">Productos</NavDropdown.Item>
        <NavDropdown.Item href="/importar-productos/">
          Importar Productos
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/inventario/">Inventario</NavDropdown.Item>
        <NavDropdown.Item href="/importar-inventario/">Importar inventario</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/logs/">Logs</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Ventas" className="custom-dropdown">
        <NavDropdown.Item href="/resumen-caja/" hidden={user.role === "seller"}>
          Resumen
        </NavDropdown.Item>
        <NavDropdown.Item href="/movimientos/" hidden={user.role === "seller"}>
          Movimientos de caja
        </NavDropdown.Item>
        <NavDropdown.Item href="/ventas/">Ventas</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/importar-ventas/">
          Importar ventas
        </NavDropdown.Item>
      </NavDropdown>
      {user.role === "owner" && (
        <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
      )}
    </>
  );

  const renderStorageLinks = () => (
    <>
      <Nav.Link href="/distribuir/">Distribuir</Nav.Link>
      <Nav.Link href="/inventario/">Inventario</Nav.Link>
      <Nav.Link href="/logs/">Logs</Nav.Link>
      {user.role === "owner" && (
        <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
      )}
    </>
  );

  const renderGeneralLinks = () => (
    <>
      <Nav.Link href="/tiendas/">Tiendas</Nav.Link>
      <NavDropdown title="Productos" className="custom-dropdown">
        <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
        <NavDropdown.Item href="/departamentos/">
          Departamentos
        </NavDropdown.Item>
        <NavDropdown.Item href="/reasignacion/">Reasignación</NavDropdown.Item>
        <NavDropdown.Divider />

        <NavDropdown.Item href="/productos/">Productos</NavDropdown.Item>
        <NavDropdown.Item href="/importar-productos/">
          Importar Productos
        </NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="/clientes/">Clientes</Nav.Link>
      {user.sellers > 0 && <Nav.Link href="/vendedores/">Vendedores</Nav.Link>}
      <Nav.Link href="/pagos/">Mensualidades</Nav.Link>
      <Nav.Link href="/servicios/">Otros servicios</Nav.Link>
    </>
  );

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <img
          src={Logo}
          width="120"
          height="50"
          className="d-inline-block align-top"
          alt="Logo"
        />
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {user.store_type === "T" && renderStoreLinks()}
            {user.store_type === "A" && renderStorageLinks()}
            {user && !user.store_type && renderGeneralLinks()}
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown
              title={user.store_name || user.tenant_name}
              className="custom-dropdown"
            >
              <NavDropdown.Item>Negocio: {user.tenant_name}</NavDropdown.Item>
              <NavDropdown.Item>Usuario: {user.full_name}</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/" onClick={handleLogout}>
              Salir
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
