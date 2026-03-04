import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaFilter } from "react-icons/fa";
import axios from "../axios";
import AppContext from "../Context/Context";
import { ToastContainer, toast } from "react-toastify";

const Products = () => {
  const { addToCart, cart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);

      // Fetch images for each product
      const imagePromises = response.data.map(async (product) => {
        if (product.imageName) {
          try {
            const imgResponse = await axios.get(
              `/product/${product.id}/image`,
              {
                responseType: "blob",
              },
            );
            return {
              id: product.id,
              imageUrl: URL.createObjectURL(imgResponse.data),
            };
          } catch (error) {
            return { id: product.id, imageUrl: null };
          }
        }
        return { id: product.id, imageUrl: null };
      });

      const images = await Promise.all(imagePromises);
      const imageMap = {};
      images.forEach((img) => {
        imageMap[img.id] = img.imageUrl;
      });
      setProductImages(imageMap);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#EFEBE9",
          paddingTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Loading products...</h2>
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
        {/* Header Section */}
        <div className="text-center mb-5">
          <h2
            style={{
              color: "#4E342E",
              marginBottom: "10px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Our Products
          </h2>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Browse our exclusive collection of event essentials
          </p>
        </div>

        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col md={6} className="mb-3 mb-md-0">
            <InputGroup>
              <InputGroup.Text
                style={{ background: "#fff", border: "1px solid #ced4da" }}
              >
                <FaSearch style={{ color: "#C9A227" }} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: "1px solid #ced4da" }}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text
                style={{ background: "#fff", border: "1px solid #ced4da" }}
              >
                <FaFilter style={{ color: "#C9A227" }} />
              </InputGroup.Text>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ border: "1px solid #ced4da" }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button
              className="btn-gold w-100"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 style={{ color: "#666" }}>No products found</h4>
            <p className="text-muted">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product, index) => (
              <Col md={4} lg={3} key={product.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="product-card h-100">
                    <div className="product-image-wrapper">
                      {productImages[product.id] ? (
                        <Card.Img
                          variant="top"
                          src={productImages[product.id]}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                      {!product.productAvailable && (
                        <div className="out-of-stock-badge">Out of Stock</div>
                      )}
                      {getCartQuantity(product.id) > 0 && (
                        <div className="in-cart-badge">
                          {getCartQuantity(product.id)} in Cart
                        </div>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Subtitle
                        className="mb-2 text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {product.brand}
                      </Card.Subtitle>
                      <Card.Title
                        className="product-title"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {product.name}
                      </Card.Title>
                      <Card.Text
                        className="text-muted small mb-2"
                        style={{ flex: 1 }}
                      >
                        {product.description?.substring(0, 80)}...
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="product-price">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <span className="stock-info">
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                      <div className="d-flex gap-2 mt-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-grow-1"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="btn-gold flex-grow-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.productAvailable}
                        >
                          <FaShoppingCart className="me-1" />
                          Add
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <ToastContainer position="top-center" />

      {/* Custom Styles */}
      <style>{`
        .product-card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .product-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f8f9fa;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .no-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          color: #6c757d;
        }
        .out-of-stock-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #dc3545;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .in-cart-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .product-title {
          color: #4E342E;
          font-weight: 600;
        }
        .product-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #C9A227;
        }
        .stock-info {
          font-size: 0.85rem;
          color: #28a745;
        }
        .btn-gold {
          background: #C9A227 !important;
          border-color: #C9A227 !important;
          color: #fff !important;
        }
        .btn-gold:hover {
          background: #b08d1f !important;
          border-color: #b08d1f !important;
        }
      `}</style>
    </div>
  );
};

export default Products;
