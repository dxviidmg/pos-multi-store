import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getUserData } from "../apis/utils";
import { NavDropdown } from "react-bootstrap";
import Logo from "../../assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // Redireccionar a la página de inicio de sesión, si es necesario
    window.location.href = "/";
  };

  const handleBack = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.store_type = "";
    user.store_name = "";
    user.store_id = "";

    const updatedData = JSON.stringify(user);

    // Save the updated string back to localStorage
    localStorage.setItem("user", updatedData);

    navigate("/tiendas/");
    window.location.reload();
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <img
          src={Logo}
          width="120"
          height="50"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {/* Opciones para tipo de tienda "T" */}
            {user.store_type === "T" && (
              <>
                <Nav.Link href="/vender/">Vender</Nav.Link>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
                <NavDropdown title="Productos" className="custom-dropdown">
                  <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/productos/">
                    Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/importar-productos/">
                    Importar Productos
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/inventario/">Inventario</Nav.Link>
                <NavDropdown title="Ventas" className="custom-dropdown">
                  <NavDropdown.Item href="/resumen-caja/">
                    Resumen
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/ventas/">Ventas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/importar-ventas/">
                    Importar ventas
                  </NavDropdown.Item>
                </NavDropdown>
                {user.is_owner && (
                  <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
                )}
              </>
            )}

            {/* Opciones para tipo de tienda "A" */}
            {user?.store_type === "A" && (
              <>
                <Nav.Link href="/distribuir/">Distribuir</Nav.Link>
                <Nav.Link href="/inventario/">Inventario</Nav.Link>
                {user.is_owner && (
                  <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
                )}
              </>
            )}

            {/* Opciones para usuarios sin tipo de tienda */}
            {user && !user.store_type && (
              <>
                <Nav.Link href="/tiendas/">Tiendas</Nav.Link>
                <NavDropdown title="Productos" className="custom-dropdown">
                  <NavDropdown.Item href="/marcas/">Marcas</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/productos/">
                    Productos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/importar-productos/">
                    Importar Productos
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/clientes/">Clientes</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            <NavDropdown title="Información de sesión" className="custom-dropdown">
              <NavDropdown.Item>Negocio: {user?.tenant_name}</NavDropdown.Item>

              {user.store_name && (
                <NavDropdown.Item>
                  {user.store_type_display} {user.store_name}
                </NavDropdown.Item>
              )}

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
