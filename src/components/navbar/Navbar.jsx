import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getUserData } from "../apis/utils";
import { NavDropdown } from "react-bootstrap";
import Logo from "../../assets/images/Logo.png";
import { useNavigate } from "react-router-dom";

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
    console.log(user)

    const updatedData = JSON.stringify(user);
    
    // Save the updated string back to localStorage
    localStorage.setItem('user', updatedData);

    navigate("/tiendas/")
    window.location.reload();

  };

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <img
          src={Logo}
          width="100"
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
                <Nav.Link href="/inventario/">Inventario</Nav.Link>
                <NavDropdown title="Ventas">
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
                {user.is_owner && (
                  <Nav.Link onClick={handleBack}>Regresar</Nav.Link>
                )}
              </>
            )}

            {/* Opciones para usuarios sin tipo de tienda */}
            {user && !user.store_type && (
              <>
                <Nav.Link href="/tiendas/">Tiendas</Nav.Link>
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

          <Nav className="ms-auto">
            <Nav.Link>Negocio: {user?.tenant_name}</Nav.Link>
            <Nav.Link>
              {user.store_name ? user.store_name : "Usuario: Owner"}
            </Nav.Link>
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
