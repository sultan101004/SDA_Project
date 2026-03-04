import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "../axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgRating: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, feedbackRes, statsRes] = await Promise.all([
        axios.get("/api/bookings"),
        axios.get("/api/feedback"),
        axios.get("/api/bookings/stats"),
      ]);
      setBookings(bookingsRes.data);
      setFeedback(feedbackRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status?status=${status}`);
      fetchData();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const bookingStatusColors = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
    COMPLETED: "info",
  };
  const pieData = {
    labels: ["Wedding", "Birthday", "Corporate", "Anniversary", "Social"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "#4E342E",
          "#A1887F",
          "#C9A227",
          "#6D4C41",
          "#8D6E63",
        ],
      },
    ],
  };
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: "#C9A227",
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#EFEBE9",
        paddingTop: "70px",
      }}
    >
      <div
        style={{
          width: "250px",
          position: "fixed",
          height: "100vh",
          overflowY: "auto",
          padding: "20px",
          background: "#4E342E",
        }}
      >
        <h4
          style={{
            color: "#C9A227",
            marginBottom: "30px",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Admin Panel
        </h4>
        <div
          style={{
            color: activeTab === "dashboard" ? "#C9A227" : "#fff",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            background:
              activeTab === "dashboard"
                ? "rgba(201,162,39,0.2)"
                : "transparent",
            marginBottom: "10px",
          }}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </div>
        <div
          style={{
            color: activeTab === "bookings" ? "#C9A227" : "#fff",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            background:
              activeTab === "bookings" ? "rgba(201,162,39,0.2)" : "transparent",
            marginBottom: "10px",
          }}
          onClick={() => setActiveTab("bookings")}
        >
          Manage Bookings
        </div>
        <div
          style={{
            color: activeTab === "feedback" ? "#C9A227" : "#fff",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            background:
              activeTab === "feedback" ? "rgba(201,162,39,0.2)" : "transparent",
          }}
          onClick={() => setActiveTab("feedback")}
        >
          Manage Feedback
        </div>
      </div>
      <div
        style={{
          marginLeft: "250px",
          padding: "20px",
          width: "calc(100% - 250px)",
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
            color: "#4E342E",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {activeTab === "dashboard"
            ? "Dashboard"
            : activeTab === "bookings"
              ? "Manage Bookings"
              : "Manage Feedback"}
        </h2>

        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Row className="mb-4">
              <Col md={3}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <h6>Total Bookings</h6>
                  <h3 style={{ color: "#4E342E" }}>{stats.totalBookings}</h3>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <h6>Total Revenue</h6>
                  <h3 style={{ color: "#C9A227" }}>
                    ₹{stats.totalRevenue?.toLocaleString() || 0}
                  </h3>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <h6>Average Rating</h6>
                  <h3 style={{ color: "#A1887F" }}>
                    {stats.avgRating?.toFixed(1) || "0.0"}
                  </h3>
                </Card>
              </Col>
              <Col md={3}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                  }}
                >
                  <h6>Pending</h6>
                  <h3 style={{ color: "#6D4C41" }}>{stats.pendingBookings}</h3>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6} style={{ marginBottom: "20px" }}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <h5 style={{ marginBottom: "15px" }}>
                    Bookings by Event Type
                  </h5>
                  <Pie data={pieData} />
                </Card>
              </Col>
              <Col md={6} style={{ marginBottom: "20px" }}>
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <h5 style={{ marginBottom: "15px" }}>Monthly Bookings</h5>
                  <Bar data={barData} />
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              style={{
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>
                        {booking.customerName}
                        <br />
                        <small>{booking.customerEmail}</small>
                      </td>
                      <td>{booking.eventName || "N/A"}</td>
                      <td>
                        {booking.eventDate
                          ? new Date(booking.eventDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{booking.guestCount}</td>
                      <td>₹{booking.totalPrice?.toLocaleString() || 0}</td>
                      <td>
                        <Badge
                          bg={
                            bookingStatusColors[booking.status] || "secondary"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              style={{ marginRight: "5px" }}
                              onClick={() =>
                                updateBookingStatus(booking.id, "APPROVED")
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                updateBookingStatus(booking.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {booking.status === "APPROVED" && (
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() =>
                              updateBookingStatus(booking.id, "COMPLETED")
                            }
                          >
                            Complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </motion.div>
        )}

        {activeTab === "feedback" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              style={{
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Event Type</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.map((fb) => (
                    <tr key={fb.id}>
                      <td>{fb.id}</td>
                      <td>{fb.name}</td>
                      <td>{fb.eventType}</td>
                      <td>{"★".repeat(fb.rating)}</td>
                      <td>{fb.comment?.substring(0, 50)}...</td>
                      <td>
                        {fb.createdAt
                          ? new Date(fb.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteFeedback(fb.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
