import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "../axios";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    eventType: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("/api/feedback");
      setFeedbackList(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/feedback", formData);
      toast.success("Thank you for your feedback!");
      setFormData({ name: "", eventType: "", rating: 5, comment: "" });
      fetchFeedback();
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypes = [
    "WEDDING",
    "BIRTHDAY",
    "CORPORATE",
    "ANNIVERSARY",
    "SOCIAL_GATHERING",
  ];

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
        <h2 className="section-title mb-2">Share Your Experience</h2>
        <p className="section-subtitle mb-5">We value your feedback</p>
        <Row>
          <Col lg={6} className="mb-4">
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="mb-4">Leave Feedback</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRating(star)}
                        style={{
                          cursor: "pointer",
                          color: star <= formData.rating ? "#C9A227" : "#ddd",
                          fontSize: "1.8rem",
                          marginRight: "5px",
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Your Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Tell us about your experience..."
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="btn-gold w-100"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </Form>
            </motion.div>
          </Col>
          <Col lg={6}>
            <h4 className="mb-4">Recent Reviews</h4>
            {loading ? (
              <p>Loading...</p>
            ) : feedbackList.length === 0 ? (
              <p className="text-muted">
                No feedback yet. Be the first to review!
              </p>
            ) : (
              feedbackList.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.id}
                  className="testimonial-card mb-3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{item.name}</strong>
                      <br />
                      <small className="text-muted">
                        {item.eventType?.replace("_", " ")}
                      </small>
                    </div>
                    <div className="star-rating">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="mb-0">{item.comment}</p>
                </motion.div>
              ))
            )}
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Feedback;
