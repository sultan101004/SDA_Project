import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../axios";
import { AuthContext } from "../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [packages, setPackages] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [errors, setErrors] = useState({});

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
    if (formData.eventId && events.length > 0) {
      const event = events.find((e) => e.id === parseInt(formData.eventId));
      if (event) {
        setSelectedEvent(event);
        fetchPackagesByEventType(event.eventType);
      }
    }
  }, [formData.eventId, events]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [eventsRes, venuesRes] = await Promise.all([
        axios.get("/api/events/active"),
        axios.get("/api/venues/active"),
      ]);
      setEvents(eventsRes.data);
      setVenues(venuesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load events and venues. Please refresh the page.");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchPackagesByEventType = async (eventType) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/packages/event/${eventType}`);
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages for this event type.");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEventSelect = (event) => {
    setFormData({ ...formData, eventId: event.id, packageId: "" });
    setSelectedEvent(event);
    setSelectedPackage(null);
    setErrors({ ...errors, eventId: "" });
  };

  const handleVenueSelect = (e) => {
    const venueId = e.target.value;
    setFormData({ ...formData, venueId: venueId });
    const venue = venues.find((v) => v.id === parseInt(venueId));
    setSelectedVenue(venue || null);
    setErrors({ ...errors, venueId: "" });
  };

  const handlePackageSelect = (e) => {
    const packageId = e.target.value;
    setFormData({ ...formData, packageId: packageId });
    const pkg = packages.find((p) => p.id === parseInt(packageId));
    setSelectedPackage(pkg || null);
    setErrors({ ...errors, packageId: "" });
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.eventId) {
        newErrors.eventId = "Please select an event type";
        isValid = false;
      }
    }

    if (currentStep === 4) {
      if (!formData.eventDate) {
        newErrors.eventDate = "Please select an event date";
        isValid = false;
      }
      if (!formData.customerName || formData.customerName.trim() === "") {
        newErrors.customerName = "Please enter your name";
        isValid = false;
      }
      if (!formData.customerEmail || formData.customerEmail.trim() === "") {
        newErrors.customerEmail = "Please enter your email";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
        newErrors.customerEmail = "Please enter a valid email";
        isValid = false;
      }
      if (!formData.customerPhone || formData.customerPhone.trim() === "") {
        newErrors.customerPhone = "Please enter your phone number";
        isValid = false;
      }
      if (!formData.guestCount || formData.guestCount < 10) {
        newErrors.guestCount = "Guest count must be at least 10";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    if (!token) {
      toast.error("Please login to book an event");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        eventId: parseInt(formData.eventId),
        venueId: formData.venueId ? parseInt(formData.venueId) : null,
        packageId: formData.packageId ? parseInt(formData.packageId) : null,
        eventDate: formData.eventDate,
        guestCount: parseInt(formData.guestCount),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        specialRequests: formData.specialRequests,
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
        setSelectedEvent(null);
        setSelectedVenue(null);
        setSelectedPackage(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate estimated price
  const calculateTotal = () => {
    let total = 0;
    if (selectedEvent) {
      total += selectedEvent.basePrice || 0;
    }
    if (selectedVenue) {
      total += (selectedVenue.pricePerHour || 0) * 4; // Assume 4 hours
    }
    if (selectedPackage) {
      total += selectedPackage.price || 0;
    }
    return total;
  };

  const progress = (step / 4) * 100;

  if (dataLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EFEBE9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <Spinner animation="border" variant="warning" size="lg" />
        <span style={{ marginLeft: "10px", color: "#4E342E" }}>
          Loading booking options...
        </span>
      </div>
    );
  }

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="section-title"
            style={{
              marginBottom: "30px",
              color: "#4E342E",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
            }}
          >
            Book Your Event
          </h2>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="booking-steps-container mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="booking-steps">
            {[
              { num: 1, label: "Event" },
              { num: 2, label: "Venue" },
              { num: 3, label: "Package" },
              { num: 4, label: "Details" },
            ].map((s, i) => (
              <div
                key={s.num}
                className={`booking-step ${step >= s.num ? "active" : ""} ${
                  step > s.num ? "completed" : ""
                }`}
              >
                <div className="booking-step-number">
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className="booking-step-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <ProgressBar
          now={progress}
          style={{ height: "5px", marginBottom: "30px" }}
          variant="warning"
          animated
        />

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
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
                      <h4
                        className="mb-4"
                        style={{
                          color: "#4E342E",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        Select Your Event Type
                      </h4>
                      {errors.eventId && (
                        <Alert variant="danger">{errors.eventId}</Alert>
                      )}
                      <Row>
                        {events.map((event) => (
                          <Col md={6} key={event.id} className="mb-3">
                            <Card
                              className={`event-card cursor-pointer ${
                                formData.eventId === event.id
                                  ? "border-warning selected"
                                  : ""
                              }`}
                              onClick={() => handleEventSelect(event)}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border:
                                  formData.eventId === event.id
                                    ? "2px solid #C9A227"
                                    : "1px solid #ddd",
                              }}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  event.imageUrl ||
                                  "https://via.placeholder.com/300x150?text=Event"
                                }
                                height="150"
                                style={{ objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/300x150?text=Event";
                                }}
                              />
                              <Card.Body>
                                <Card.Title style={{ color: "#4E342E" }}>
                                  {event.name}
                                </Card.Title>
                                <p
                                  className="text-warning"
                                  style={{
                                    color: "#C9A227",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ₹{(event.basePrice || 0).toLocaleString()}
                                </p>
                                <small style={{ color: "#666" }}>
                                  {event.description?.substring(0, 60)}...
                                </small>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      {events.length === 0 && (
                        <Alert variant="info">
                          No events available at the moment. Please check back
                          later.
                        </Alert>
                      )}
                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          className="btn-gold"
                          onClick={handleNext}
                          disabled={!formData.eventId}
                          style={{
                            background:
                              formData.eventId === ""
                                ? "#ccc"
                                : "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)",
                            border: "none",
                            padding: "12px 35px",
                          }}
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
                      <h4
                        className="mb-4"
                        style={{
                          color: "#4E342E",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        Select Venue (Optional)
                      </h4>
                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#4E342E" }}>
                          Choose a venue from our partners
                        </Form.Label>
                        <Form.Select
                          name="venueId"
                          value={formData.venueId}
                          onChange={handleVenueSelect}
                          style={{ borderColor: "#C9A227" }}
                        >
                          <option value="">-- No Venue Required --</option>
                          {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                              {venue.name} - {venue.address} (₹
                              {(venue.pricePerHour || 0).toLocaleString()}/hr)
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      {selectedVenue && (
                        <Card
                          className="mt-3"
                          style={{ border: "1px solid #C9A227" }}
                        >
                          <Card.Body>
                            <h5 style={{ color: "#4E342E" }}>
                              {selectedVenue.name}
                            </h5>
                            <p style={{ color: "#666" }}>
                              {selectedVenue.description}
                            </p>
                            <p style={{ color: "#C9A227", fontWeight: "bold" }}>
                              Capacity: {selectedVenue.capacity} guests
                            </p>
                          </Card.Body>
                        </Card>
                      )}

                      <div className="d-flex justify-content-between mt-4">
                        <Button
                          variant="secondary"
                          onClick={handleBack}
                          style={{ padding: "10px 25px" }}
                        >
                          ← Back
                        </Button>
                        <Button
                          className="btn-gold"
                          onClick={handleNext}
                          style={{
                            background:
                              "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)",
                            border: "none",
                            padding: "10px 35px",
                          }}
                        >
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
                      <h4
                        className="mb-4"
                        style={{
                          color: "#4E342E",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        Select Package (Optional)
                      </h4>
                      {loading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" variant="warning" />
                        </div>
                      ) : (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Choose a package
                            </Form.Label>
                            <Form.Select
                              name="packageId"
                              value={formData.packageId}
                              onChange={handlePackageSelect}
                              style={{ borderColor: "#C9A227" }}
                            >
                              <option value="">
                                -- No Package Required --
                              </option>
                              {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} - ₹
                                  {(pkg.price || 0).toLocaleString()}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          {selectedPackage && (
                            <Card
                              className="mt-3"
                              style={{ border: "1px solid #C9A227" }}
                            >
                              <Card.Body>
                                <h5 style={{ color: "#4E342E" }}>
                                  {selectedPackage.name}
                                </h5>
                                <p style={{ color: "#666" }}>
                                  {selectedPackage.description}
                                </p>
                                <p
                                  style={{
                                    color: "#C9A227",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ₹
                                  {(
                                    selectedPackage.price || 0
                                  ).toLocaleString()}
                                </p>
                                {selectedPackage.features && (
                                  <div className="mt-2">
                                    <strong style={{ color: "#4E342E" }}>
                                      Features:
                                    </strong>
                                    <p
                                      style={{
                                        color: "#666",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {selectedPackage.features}
                                    </p>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          )}

                          {packages.length === 0 && (
                            <Alert variant="info">
                              No packages available for this event type.
                            </Alert>
                          )}
                        </>
                      )}

                      <div className="d-flex justify-content-between mt-4">
                        <Button
                          variant="secondary"
                          onClick={handleBack}
                          style={{ padding: "10px 25px" }}
                        >
                          ← Back
                        </Button>
                        <Button
                          className="btn-gold"
                          onClick={handleNext}
                          style={{
                            background:
                              "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)",
                            border: "none",
                            padding: "10px 35px",
                          }}
                        >
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
                      <h4
                        className="mb-4"
                        style={{
                          color: "#4E342E",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        Event Details
                      </h4>

                      {/* Booking Summary */}
                      <Card
                        className="mb-4"
                        style={{
                          background:
                            "linear-gradient(135deg, #4E342E 0%, #6D4C41 100%)",
                          color: "white",
                        }}
                      >
                        <Card.Body>
                          <h5
                            style={{ color: "#C9A227", marginBottom: "15px" }}
                          >
                            Booking Summary
                          </h5>
                          <p>
                            <strong>Event:</strong> {selectedEvent?.name}
                          </p>
                          {selectedVenue && (
                            <p>
                              <strong>Venue:</strong> {selectedVenue.name}
                            </p>
                          )}
                          {selectedPackage && (
                            <p>
                              <strong>Package:</strong> {selectedPackage.name}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "1.2rem",
                              color: "#C9A227",
                              fontWeight: "bold",
                              marginTop: "10px",
                              borderTop: "1px solid rgba(255,255,255,0.2)",
                              paddingTop: "10px",
                            }}
                          >
                            Estimated Total: ₹
                            {calculateTotal().toLocaleString()}
                          </p>
                        </Card.Body>
                      </Card>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Event Date *
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="eventDate"
                              value={formData.eventDate}
                              onChange={handleChange}
                              min={
                                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                  .toISOString()
                                  .split("T")[0]
                              }
                              style={{
                                borderColor: errors.eventDate
                                  ? "red"
                                  : "#C9A227",
                              }}
                              required
                            />
                            {errors.eventDate && (
                              <small style={{ color: "red" }}>
                                {errors.eventDate}
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Number of Guests *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="guestCount"
                              value={formData.guestCount}
                              onChange={handleChange}
                              min="10"
                              max="500"
                              style={{
                                borderColor: errors.guestCount
                                  ? "red"
                                  : "#C9A227",
                              }}
                              required
                            />
                            {errors.guestCount && (
                              <small style={{ color: "red" }}>
                                {errors.guestCount}
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <h5
                        className="mt-4 mb-3"
                        style={{
                          color: "#4E342E",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      >
                        Contact Information
                      </h5>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Name *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="customerName"
                              value={formData.customerName}
                              onChange={handleChange}
                              placeholder="Your full name"
                              style={{
                                borderColor: errors.customerName
                                  ? "red"
                                  : "#C9A227",
                              }}
                              required
                            />
                            {errors.customerName && (
                              <small style={{ color: "red" }}>
                                {errors.customerName}
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Email *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="customerEmail"
                              value={formData.customerEmail}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              style={{
                                borderColor: errors.customerEmail
                                  ? "red"
                                  : "#C9A227",
                              }}
                              required
                            />
                            {errors.customerEmail && (
                              <small style={{ color: "red" }}>
                                {errors.customerEmail}
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: "#4E342E" }}>
                              Phone *
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="customerPhone"
                              value={formData.customerPhone}
                              onChange={handleChange}
                              placeholder="10-digit phone number"
                              style={{
                                borderColor: errors.customerPhone
                                  ? "red"
                                  : "#C9A227",
                              }}
                              required
                            />
                            {errors.customerPhone && (
                              <small style={{ color: "red" }}>
                                {errors.customerPhone}
                              </small>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#4E342E" }}>
                          Special Requests
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          placeholder="Any special requirements or requests..."
                          style={{ borderColor: "#C9A227" }}
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between mt-4">
                        <Button
                          variant="secondary"
                          onClick={handleBack}
                          disabled={submitting}
                          style={{ padding: "10px 25px" }}
                        >
                          ← Back
                        </Button>
                        <Button
                          className="btn-gold"
                          type="submit"
                          disabled={submitting}
                          style={{
                            background: submitting
                              ? "#ccc"
                              : "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)",
                            border: "none",
                            padding: "12px 40px",
                          }}
                        >
                          {submitting ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: "8px" }}
                              />
                              Submitting...
                            </>
                          ) : (
                            "Submit Booking"
                          )}
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Booking;
