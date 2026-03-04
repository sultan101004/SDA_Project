import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar as BSNavbar, Button } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import AppContext from "../Context/Context";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cart } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <BSNavbar
      expand="lg"
      fixed="top"
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          ✨ Evento
        </BSNavbar.Brand>

        <button
          className="navbar-toggler"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#C9A227",
            fontSize: "1.5rem",
          }}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        <BSNavbar.Collapse in={mobileOpen}>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/packages"
              onClick={() => setMobileOpen(false)}
            >
              Packages
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/booking"
              onClick={() => setMobileOpen(false)}
            >
              Book Now
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/ai-planner"
              onClick={() => setMobileOpen(false)}
            >
              AI Planner
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/feedback"
              onClick={() => setMobileOpen(false)}
            >
              Feedback
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              onClick={() => setMobileOpen(false)}
            >
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="position-relative"
            >
              <FaShoppingCart className="me-1" />
              Cart
              {cart.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Nav.Link>

            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="text-warning">
                Admin Dashboard
              </Nav.Link>
            )}

            {user ? (
              <div className="d-flex align-items-center ms-3">
                <span className="text-white me-2">
                  <FaUser className="me-1" />
                  {user.name}
                </span>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </Button>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-3">
                <Button variant="warning" className="btn-gold">
                  Login
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
