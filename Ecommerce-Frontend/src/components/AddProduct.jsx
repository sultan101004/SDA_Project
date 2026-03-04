import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" }),
    );

    axios
      .post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        alert("Product added successfully");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div className="form-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="center-form">
              <h2 className="text-center mb-4" style={{ color: "#4E342E" }}>
                Add New Product
              </h2>
              <form onSubmit={submitHandler}>
                <Row className="g-3">
                  <Col md={6}>
                    <label className="form-label">
                      <strong>Product Name</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      onChange={handleInputChange}
                      value={product.name}
                      name="name"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <label className="form-label">
                      <strong>Brand</strong>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className="form-control"
                      placeholder="Enter brand name"
                      value={product.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </Col>
                  <Col xs={12}>
                    <label className="form-label">
                      <strong>Description</strong>
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Add product description"
                      value={product.description}
                      name="description"
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <label className="form-label">
                      <strong>Price (₹)</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      onChange={handleInputChange}
                      value={product.price}
                      name="price"
                      required
                    />
                  </Col>
                  <Col md={4}>
                    <label className="form-label">
                      <strong>Category</strong>
                    </label>
                    <select
                      className="form-select"
                      value={product.category}
                      onChange={handleInputChange}
                      name="category"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Headphone">Headphone</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Toys">Toys</option>
                      <option value="Fashion">Fashion</option>
                    </select>
                  </Col>
                  <Col md={4}>
                    <label className="form-label">
                      <strong>Stock Quantity</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Available stock"
                      onChange={handleInputChange}
                      value={product.stockQuantity}
                      name="stockQuantity"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <label className="form-label">
                      <strong>Release Date</strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={product.releaseDate}
                      name="releaseDate"
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col md={6}>
                    <label className="form-label">
                      <strong>Product Image</strong>
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Col>
                  <Col xs={12}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="productAvailable"
                        id="gridCheck"
                        checked={product.productAvailable}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            productAvailable: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label">
                        Product Available for Sale
                      </label>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <Button type="submit" className="btn-gold w-100">
                      Add Product
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddProduct;
