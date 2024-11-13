import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getUserData } from "../apis/utils";
import { NavDropdown } from "react-bootstrap";

const CustomNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
  };

  const user = getUserData();
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#3b83bd" }}>
      <Container fluid>
        <Navbar.Brand href="#">My POS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Navbar.Text>
              {getUserData().store
                ? getUserData().store
                : "Usuario: Administrador"}
            </Navbar.Text>
            {user && user.store ? (
              <>
                <Nav.Link href="/nueva-venta/">Vender</Nav.Link>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
                <Nav.Link href="/ventas/">Ventas</Nav.Link>
              </>
            ) : (
              <>
                <NavDropdown title="Productos" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/productos/">
                    Productos
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
              </>
            )}
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
