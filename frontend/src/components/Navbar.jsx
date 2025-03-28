import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaPlusCircle } from "react-icons/fa";

function CustomNavbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Event Booking
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as="span" className="text-light">
                  Привет, {user.email}!
                </Nav.Link>
                <Nav.Link as={Link} to="/create-event">
                  <FaPlusCircle className="me-1" /> Создать событие
                </Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-1" /> Войти
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Регистрация
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;