import "./App.css";
import React from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Products from "./components/Products";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import { AuthProvider } from "./Context/AuthContext";
import UpdateProduct from "./components/UpdateProduct";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Feedback from "./components/Feedback";
import AIPlanner from "./components/AIPlanner";
import AdminDashboard from "./components/AdminDashboard";
import { Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Simple placeholder components for missing routes
const About = () => (
  <div
    style={{
      padding: "100px 20px 50px",
      minHeight: "100vh",
      background: "#EFEBE9",
    }}
  >
    <Container>
      <Card className="glass-card p-5 text-center">
        <h2 style={{ color: "#4E342E", marginBottom: "20px" }}>About Us</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          We are a premier event management company specializing in weddings,
          corporate events, birthday parties, and social gatherings. With years
          of experience, we bring your vision to life.
        </p>
      </Card>
    </Container>
  </div>
);

const Services = () => (
  <div
    style={{
      padding: "100px 20px 50px",
      minHeight: "100vh",
      background: "#EFEBE9",
    }}
  >
    <Container>
      <Card className="glass-card p-5 text-center">
        <h2 style={{ color: "#4E342E", marginBottom: "20px" }}>Our Services</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          We offer comprehensive event planning services including venue
          selection, catering, decorations, entertainment, and more. Let us make
          your event unforgettable.
        </p>
      </Card>
    </Container>
  </div>
);

const Packages = () => (
  <div
    style={{
      padding: "100px 20px 50px",
      minHeight: "100vh",
      background: "#EFEBE9",
    }}
  >
    <Container>
      <Card className="glass-card p-5 text-center">
        <h2 style={{ color: "#4E342E", marginBottom: "20px" }}>Our Packages</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Choose from our carefully curated event packages tailored to fit your
          budget and preferences. Visit our{" "}
          <Link to="/booking" style={{ color: "#C9A227" }}>
            Booking page
          </Link>{" "}
          to get started.
        </p>
      </Card>
    </Container>
  </div>
);

const Contact = () => (
  <div
    style={{
      padding: "100px 20px 50px",
      minHeight: "100vh",
      background: "#EFEBE9",
    }}
  >
    <Container>
      <Card className="glass-card p-5 text-center">
        <h2 style={{ color: "#4E342E", marginBottom: "20px" }}>Contact Us</h2>
        <p style={{ fontSize: "1.1rem", color: "#666" }}>
          Email: info@evento.com
          <br />
          Phone: +91 9876543210
          <br />
          Address: 123 Event Lane, Mumbai
        </p>
      </Card>
    </Container>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/update/:id" element={<UpdateProduct />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
