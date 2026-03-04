import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../axios";
import { AuthContext } from "../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [packages, setPackages] = useState([]);

  const [formData, setFormData] = useState({
    eventId: searchParams.get("event") || "",
    venueId: "",
    packageId: "",
    eventDate: "",
    guestCount: 50,
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    specialRequests: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.eventId) {
      fetchPackages(formData.eventId);
    }
  }, [formData.eventId]);

  const fetchData = async () => {
    try {
      const [eventsRes, venuesRes] = await Promise.all([
        axios.get("/api/events/active"),
        axios.get("/api/venues/active"),
      ]);
      setEvents(eventsRes.data);
      setVenues(venuesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPackages = async (eventId) => {
    try {
      const response = await axios.get(`/api/packages/event/${eventId}`);
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        eventId: parseInt(formData.eventId),
        venueId: formData.venueId ? parseInt(formData.venueId) : null,
        packageId: formData.packageId ? parseInt(formData.packageId) : null,
        guestCount: parseInt(formData.guestCount),
      };

      await axios.post("/api/bookings", bookingData);
      toast.success(
        "Booking submitted successfully! We will contact you soon.",
      );
      setTimeout(() => {
        setStep(1);
        setFormData({
          eventId: "",
          venueId: "",
          packageId: "",
          eventDate: "",
          guestCount: 50,
          customerName: user?.name || "",
          customerEmail: user?.email || "",
          customerPhone: user?.phone || "",
          specialRequests: "",
        });
      }, 2000);
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#EFEBE9",
        paddingTop: "80px",
        paddingBottom: "50px",
      }}
    >
      <Container>
        <h2 className="section-title" style={{ marginBottom: "30px" }}>
          Book Your Event
        </h2>

        {/* Progress Steps */}
        <div className="booking-steps mb-5">
          {[
            { num: 1, label: "Event" },
            { num: 2, label: "Venue" },
            { num: 3, label: "Package" },
            { num: 4, label: "Details" },
          ].map((s, i) => (
            <div
              key={s.num}
              className={`booking-step ${step >= s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}
            >
              <div className="booking-step-number">
                {step > s.num ? "✓" : s.num}
              </div>
              <span className="d-none d-md-inline">{s.label}</span>
            </div>
          ))}
        </div>

        <ProgressBar
          now={progress}
          style={{ height: "5px", marginBottom: "30px" }}
          variant="warning"
        />

        <Row className="justify-content-center">
          <Col md={8}>
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="mb-4">Select Your Event Type</h4>
                      <Row>
                        {events.map((event) => (
                          <Col md={6} key={event.id} className="mb-3">
                            <Card
                              className={`luxury-card cursor-pointer ${formData.eventId === event.id ? "border-warning" : ""}`}
                              onClick={() =>
                                setFormData({ ...formData, eventId: event.id })
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <Card.Img
                                variant="top"
                                src={event.imageUrl}
                                height="150"
                                style={{ objectFit: "cover" }}
                              />
                              <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <p className="text-warning">
                                  ₹{event.basePrice?.toLocaleString()}
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          className="btn-gold"
                          onClick={handleNext}
                          disabled={!formData.eventId}
                        >
                          Next →
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="mb-4">Select Venue (Optional)</h4>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Choose a venue from our partners
                        </Form.Label>
                        <Form.Select
                          name="venueId"
                          value={formData.venueId}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Venue --</option>
                          {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                              {venue.name} - {venue.address} (₹
                              {venue.pricePerHour}/hr)
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="secondary" onClick={handleBack}>
                          ← Back
                        </Button>
                        <Button className="btn-gold" onClick={handleNext}>
                          Next →
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="mb-4">Select Package (Optional)</h4>
                      <Form.Group className="mb-3">
                        <Form.Label>Choose a package</Form.Label>
                        <Form.Select
                          name="packageId"
                          value={formData.packageId}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Package --</option>
                          {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.name} - ₹{pkg.price?.toLocaleString()}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="secondary" onClick={handleBack}>
                          ← Back
                        </Button>
                        <Button className="btn-gold" onClick={handleNext}>
                          Next →
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h4 className="mb-4">Event Details</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Event Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleChange}
                              min={new Date().toISOString().split("T")[0]}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Number of Guests</Form.Label>
                            <Form.Control
                              type="number"
                              name="guestCount"
                              value={formData.guestCount}
                              onChange={handleChange}
                              min="10"
                              max="500"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Contact Information</h5>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="customerName"
                              value={formData.customerName}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="customerEmail"
                              value={formData.customerEmail}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              type="tel"
                              name="customerPhone"
                              value={formData.customerPhone}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Special Requests</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          placeholder="Any special requirements or requests..."
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="secondary" onClick={handleBack}>
                          ← Back
                        </Button>
                        <Button
                          className="btn-gold"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit Booking"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Booking;
