import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const TOKEN_KEY = "token"; // <-- change if you used a different key

export default function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAuthed = !!localStorage.getItem(TOKEN_KEY);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard">💰 Finance Tracker</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {isAuthed && (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/budgets">Budgets</Nav.Link>
                <Nav.Link as={NavLink} to="/categories">Categories</Nav.Link>
              <Nav.Link as={NavLink} to="/expenses">Expenses</Nav.Link>
              <Nav.Link as={NavLink} to="/income">Income</Nav.Link>
              <Nav.Link as={NavLink} to="/reports">Reports</Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {!isAuthed ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
