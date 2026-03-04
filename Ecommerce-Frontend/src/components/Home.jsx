import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../axios";
import {
  FaRing,
  FaBirthdayCake,
  FaBuilding,
  FaGlassCheers,
  FaUsers,
  FaStar,
} from "react-icons/fa";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, feedbackRes] = await Promise.all([
        axios.get("/api/events/active"),
        axios.get("/api/feedback"),
      ]);
      setEvents(eventsRes.data);
      setFeedback(feedbackRes.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "WEDDING":
        return <FaRing />;
      case "BIRTHDAY":
        return <FaBirthdayCake />;
      case "CORPORATE":
        return <FaBuilding />;
      case "ANNIVERSARY":
        return <FaGlassCheers />;
      case "SOCIAL_GATHERING":
        return <FaUsers />;
      default:
        return <FaStar />;
    }
  };

  const services = [
    {
      icon: <FaRing />,
      title: "Wedding Planning",
      description:
        "Make your special day unforgettable with our comprehensive wedding planning services.",
    },
    {
      icon: <FaBirthdayCake />,
      title: "Birthday Parties",
      description:
        "Fun-filled birthday celebrations for all ages with customizable themes.",
    },
    {
      icon: <FaBuilding />,
      title: "Corporate Events",
      description:
        "Professional corporate events including conferences, seminars, and team building.",
    },
    {
      icon: <FaGlassCheers />,
      title: "Anniversary Celebrations",
      description: "Elegant celebrations for your special milestones.",
    },
    {
      icon: <FaUsers />,
      title: "Social Gatherings",
      description: "Casual gatherings for friends and family reunions.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Create Unforgettable Moments
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your dream event starts here. From weddings to corporate gatherings,
            we bring your vision to life with elegance and excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/booking">
              <Button className="btn-gold me-3">Book Your Event</Button>
            </Link>
            <Link to="/packages">
              <Button className="btn-outline-gold">View Packages</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <Container>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive event management solutions for every occasion
          </p>
          <Row>
            {services.map((service, index) => (
              <Col md={4} key={index} className="mb-4">
                <motion.div
                  className="service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="luxury-card-title">{service.title}</h3>
                  <p>{service.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Event Types Section */}
      <section className="section" style={{ backgroundColor: "#fff" }}>
        <Container>
          <h2 className="section-title">Event Types</h2>
          <p className="section-subtitle">Choose your perfect event type</p>
          <Row>
            {events.map((event, index) => (
              <Col md={4} key={event.id} className="mb-4">
                <motion.div
                  className="luxury-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={
                      event.imageUrl || "https://via.placeholder.com/400x250"
                    }
                    alt={event.name}
                    className="luxury-card-img"
                  />
                  <div className="luxury-card-body">
                    <h3 className="luxury-card-title">{event.name}</h3>
                    <p className="text-muted mb-3">
                      {event.description?.substring(0, 100)}...
                    </p>
                    <p className="luxury-card-price">
                      Starting from ₹{event.basePrice?.toLocaleString()}
                    </p>
                    <Link to={`/booking?event=${event.id}`}>
                      <Button className="btn-gold w-100">Book Now</Button>
                    </Link>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <Container>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Real feedback from our valued customers
          </p>
          <Row>
            {feedback.map((item, index) => (
              <Col md={4} key={item.id} className="mb-4">
                <motion.div
                  className="testimonial-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="star-rating mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="testimonial-text">"{item.comment}"</p>
                  <p className="testimonial-author">- {item.name}</p>
                  <small className="text-muted">{item.eventType}</small>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, #4E342E 0%, #6D4C41 100%)",
        }}
      >
        <Container className="text-center">
          <h2 style={{ color: "#C9A227", marginBottom: "20px" }}>
            Ready to Plan Your Event?
          </h2>
          <p
            style={{ color: "#fff", marginBottom: "30px", fontSize: "1.2rem" }}
          >
            Let our AI-powered planner help you create the perfect event
          </p>
          <Link to="/ai-planner">
            <Button className="btn-gold btn-lg">Start Planning</Button>
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h4 className="footer-title">Evento</h4>
              <p className="text-light">
                Creating unforgettable moments for weddings, parties, and
                corporate events since 2010.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about" className="footer-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="footer-link">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="footer-link">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact
                  </Link>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h4 className="footer-title">Contact Us</h4>
              <p className="text-light">
                Email: info@evento.com
                <br />
                Phone: +91 9876543210
                <br />
                Address: 123 Event Lane, Mumbai
              </p>
            </Col>
          </Row>
          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          <p className="text-center text-light mb-0">
            © 2024 Evento. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
