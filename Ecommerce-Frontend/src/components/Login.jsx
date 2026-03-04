import React, { useState, useContext } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
        );
      }

      if (result.success) {
        toast.success(
          isLogin ? "Login successful!" : "Registration successful!",
        );
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4E342E 0%, #6D4C41 100%)",
        paddingTop: "80px",
        paddingBottom: "50px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card" style={{ padding: "40px" }}>
                <h2
                  className="text-center mb-4"
                  style={{
                    color: "#4E342E",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-center text-muted mb-4">
                  {isLogin
                    ? "Login to manage your events"
                    : "Join us to plan your perfect event"}
                </p>

                <Form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required={!isLogin}
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  {!isLogin && (
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  )}

                  <Button type="submit" className="btn-gold w-100 mb-3">
                    {isLogin ? "Login" : "Register"}
                  </Button>
                </Form>

                <p className="text-center mt-3">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Link
                    to="#"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ color: "#C9A227", fontWeight: "600" }}
                  >
                    {isLogin ? "Register here" : "Login here"}
                  </Link>
                </p>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;
