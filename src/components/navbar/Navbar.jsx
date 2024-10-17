import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';


const CustomNavbar = () => {
    const handleLogout = () => {
        localStorage.removeItem("user")
    }

  return (
    <Navbar expand="lg" style={{backgroundColor: 'green'}}>
      <Container fluid >
        <Navbar.Brand href="#">My pos</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/nueva-venta/">Nueva venta</Nav.Link>
            <Nav.Link href="/inventario/">Inventario</Nav.Link>
            <Nav.Link href="/" onClick={handleLogout}>Salir</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default CustomNavbar
