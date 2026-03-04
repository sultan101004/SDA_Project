import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(`/product/${id}/image`, {
          responseType: "blob",
        });
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        <h2 className="text-center">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Container>
        <Row className="align-items-start">
          {/* Product Image */}
          <Col lg={6} md={12} className="mb-4 mb-lg-0">
            <div className="product-image-container">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.imageName || product.name}
                  className="img-fluid"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  <span className="text-muted">No Image Available</span>
                </div>
              )}
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6} md={12}>
            <div className="product-info-container">
              <div className="product-description">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#C9A227",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.category}
                  </span>
                  <p className="release-date mb-0">
                    <small>
                      Listed:{" "}
                      <i>
                        {" "}
                        {new Date(product.releaseDate).toLocaleDateString()}
                      </i>
                    </small>
                  </p>
                </div>

                <h1
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.5rem",
                    textTransform: "capitalize",
                    letterSpacing: "1px",
                  }}
                >
                  {product.name}
                </h1>
                <p style={{ marginBottom: "1rem", color: "#666" }}>
                  <i>{product.brand}</i>
                </p>
                <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                  PRODUCT DESCRIPTION :
                </p>
                <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                  {product.description}
                </p>
              </div>

              <div className="product-price">
                <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {"₹" + product.price?.toLocaleString()}
                </span>

                <button
                  className={`cart-btn ${
                    !product.productAvailable ? "disabled-btn" : ""
                  }`}
                  onClick={handlAddToCart}
                  disabled={!product.productAvailable}
                >
                  {product.productAvailable ? "Add to Cart" : "Out of Stock"}
                </button>

                <p style={{ marginBottom: "0" }}>
                  Stock Available:{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {product.stockQuantity}
                  </span>
                </p>
              </div>

              <div className="update-button">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleEditClick}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={deleteProduct}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Product;
