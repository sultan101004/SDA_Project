import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import { FaCalculator, FaUsers, FaPalette, FaComments } from "react-icons/fa";

const AIPlanner = () => {
  const [activeTab, setActiveTab] = useState("budget");
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState({
    eventType: "WEDDING",
    guestCount: 100,
    venueType: "indoor",
  });
  const [budgetResult, setBudgetResult] = useState(null);
  const [guestData, setGuestData] = useState({
    eventType: "WEDDING",
    budget: 50000,
    spaceType: "indoor",
  });
  const [guestResult, setGuestResult] = useState(null);
  const [themeData, setThemeData] = useState({
    eventType: "WEDDING",
    season: "summer",
    preference: "traditional",
  });
  const [themeResult, setThemeResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Event Planner. How can I help you plan your event today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const calculateBudget = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/budget", budgetData);
      setBudgetResult(response.data);
    } catch (error) {
      toast.error("Failed to calculate budget");
    } finally {
      setLoading(false);
    }
  };

  const suggestGuests = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/guest-count", guestData);
      setGuestResult(response.data);
    } catch (error) {
      toast.error("Failed to get suggestion");
    } finally {
      setLoading(false);
    }
  };

  const suggestTheme = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/theme", themeData);
      setThemeResult(response.data);
    } catch (error) {
      toast.error("Failed to get theme suggestion");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages([...chatMessages, { role: "user", content: userMessage }]);
    setChatInput("");
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/chat", {
        message: userMessage,
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: "I'm here to help! Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    "WEDDING",
    "BIRTHDAY",
    "CORPORATE",
    "ANNIVERSARY",
    "SOCIAL_GATHERING",
  ];
  const tabs = [
    { id: "budget", icon: <FaCalculator />, label: "Budget" },
    { id: "guests", icon: <FaUsers />, label: "Guests" },
    { id: "theme", icon: <FaPalette />, label: "Theme" },
    { id: "chat", icon: <FaComments />, label: "Chat" },
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
        <h2 className="section-title mb-2">AI Event Planner</h2>
        <p className="section-subtitle mb-5">
          Let our AI help you plan the perfect event
        </p>
        <Row className="mb-4">
          {tabs.map((tab) => (
            <Col key={tab.id} md={3} className="mb-3">
              <Card
                className={`text-center p-3 ${activeTab === tab.id ? "border-warning" : ""}`}
                style={{
                  cursor: "pointer",
                  background: activeTab === tab.id ? "#C9A227" : "#fff",
                  color: "#4E342E",
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                  {tab.icon}
                </div>
                <strong>{tab.label}</strong>
              </Card>
            </Col>
          ))}
        </Row>
        {activeTab === "budget" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card">
              <h4 className="mb-4">Budget Estimator</h4>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Type</Form.Label>
                    <Form.Select
                      value={budgetData.eventType}
                      onChange={(e) =>
                        setBudgetData({
                          ...budgetData,
                          eventType: e.target.value,
                        })
                      }
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Guests</Form.Label>
                    <Form.Control
                      type="number"
                      value={budgetData.guestCount}
                      onChange={(e) =>
                        setBudgetData({
                          ...budgetData,
                          guestCount: parseInt(e.target.value),
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Venue</Form.Label>
                    <Form.Select
                      value={budgetData.venueType}
                      onChange={(e) =>
                        setBudgetData({
                          ...budgetData,
                          venueType: e.target.value,
                        })
                      }
                    >
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button
                className="btn-gold"
                onClick={calculateBudget}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate"}
              </Button>
              {budgetResult && (
                <div
                  className="mt-4 p-3"
                  style={{ background: "#f8f9fa", borderRadius: "10px" }}
                >
                  <h5>Estimated: ₹{budgetResult.total?.toLocaleString()}</h5>
                  <ul>
                    <li>Venue: ₹{budgetResult.venue?.toLocaleString()}</li>
                    <li>
                      Catering: ₹{budgetResult.catering?.toLocaleString()}
                    </li>
                    <li>
                      Decorations: ₹{budgetResult.decorations?.toLocaleString()}
                    </li>
                    <li>
                      Entertainment: ₹
                      {budgetResult.entertainment?.toLocaleString()}
                    </li>
                    <li>
                      Photography: ₹{budgetResult.photography?.toLocaleString()}
                    </li>
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        )}
        {activeTab === "guests" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card">
              <h4 className="mb-4">Guest Count Suggestion</h4>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Type</Form.Label>
                    <Form.Select
                      value={guestData.eventType}
                      onChange={(e) =>
                        setGuestData({
                          ...guestData,
                          eventType: e.target.value,
                        })
                      }
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Budget (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      value={guestData.budget}
                      onChange={(e) =>
                        setGuestData({
                          ...guestData,
                          budget: parseInt(e.target.value),
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Space</Form.Label>
                    <Form.Select
                      value={guestData.spaceType}
                      onChange={(e) =>
                        setGuestData({
                          ...guestData,
                          spaceType: e.target.value,
                        })
                      }
                    >
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button
                className="btn-gold"
                onClick={suggestGuests}
                disabled={loading}
              >
                {loading ? "Getting..." : "Get Suggestion"}
              </Button>
              {guestResult && (
                <div
                  className="mt-4 p-3"
                  style={{ background: "#f8f9fa", borderRadius: "10px" }}
                >
                  <h5>Recommended: {guestResult.recommendedGuests} guests</h5>
                  <p>{guestResult.reasoning}</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
        {activeTab === "theme" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-card">
              <h4 className="mb-4">Theme Suggestion</h4>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Type</Form.Label>
                    <Form.Select
                      value={themeData.eventType}
                      onChange={(e) =>
                        setThemeData({
                          ...themeData,
                          eventType: e.target.value,
                        })
                      }
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Season</Form.Label>
                    <Form.Select
                      value={themeData.season}
                      onChange={(e) =>
                        setThemeData({ ...themeData, season: e.target.value })
                      }
                    >
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                      <option value="winter">Winter</option>
                      <option value="monsoon">Monsoon</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Style</Form.Label>
                    <Form.Select
                      value={themeData.preference}
                      onChange={(e) =>
                        setThemeData({
                          ...themeData,
                          preference: e.target.value,
                        })
                      }
                    >
                      <option value="traditional">Traditional</option>
                      <option value="modern">Modern</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="luxury">Luxury</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button
                className="btn-gold"
                onClick={suggestTheme}
                disabled={loading}
              >
                {loading ? "Getting..." : "Get Ideas"}
              </Button>
              {themeResult && (
                <div
                  className="mt-4 p-3"
                  style={{ background: "#f8f9fa", borderRadius: "10px" }}
                >
                  <h5>{themeResult.themeName}</h5>
                  <p>
                    <strong>Colors:</strong> {themeResult.colorPalette}
                  </p>
                  <p>{themeResult.description}</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              className="glass-card"
              style={{
                height: "500px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 className="mb-3">AI Chat</h4>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "15px",
                  padding: "10px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                }}
              >
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.role === "user" ? "right" : "left",
                      marginBottom: "10px",
                      padding: "10px",
                      borderRadius: "10px",
                      background: msg.role === "user" ? "#C9A227" : "#fff",
                      color: "#4E342E",
                    }}
                  >
                    <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about event planning..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  className="btn-gold ms-2"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  Send
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </Container>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AIPlanner;
