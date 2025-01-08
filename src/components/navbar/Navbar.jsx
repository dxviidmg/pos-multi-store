import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getUserData } from "../apis/utils";
import { NavDropdown } from "react-bootstrap";

const CustomNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    // Redireccionar a la página de inicio de sesión, si es necesario
    window.location.href = "/";
  };

  const user = getUserData();

  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="light">
      <Container fluid>
        <Navbar.Brand href="#">SmartVenta</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>


            {/* Opciones para tipo de tienda "T" */}
            {user?.store_type === "T" && (
              <>
                <Nav.Link href="/nueva-venta/">Vender</Nav.Link>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
                <Nav.Link href="/ventas/">Ventas</Nav.Link>
              </>
            )}

            {/* Opciones para tipo de tienda "A" */}
            {user?.store_type === "A" && (
              <>
                <Nav.Link href="/distribuir/">Distribuir</Nav.Link>
              </>
            )}

            {/* Opciones para usuarios sin tipo de tienda */}
            {user && !user.store_type && (
              <>
                <NavDropdown title="Productos">
                  <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/productos/">
                    Productos
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
              </>
            )}



            
          </Nav>

          <Nav className='ms-auto'>
          <Navbar.Text>
              Negocio: {user?.tenant}
            </Navbar.Text>
          <Navbar.Text>
              {user?.store ? user.store : "Usuario: Administrador"}
            </Navbar.Text>
          <Nav.Link  href="/" onClick={handleLogout}>
              Salir
            </Nav.Link>
    </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
