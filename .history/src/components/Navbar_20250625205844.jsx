import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, isAdmin } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
          Living Dead Design Co.
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
            <Nav.Link as={Link} to="/custom">Custom</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
            
            {user ? (
              <Nav.Link as={Link} to="/account">Account</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">Sign In / Sign Up</Nav.Link>
            )}
            
            <Nav.Link as={Link} to="/cart">🛒</Nav.Link>
            {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
