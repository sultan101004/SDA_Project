import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);

        setProduct(response.data);

        const responseImage = await axios.get(`/product/${id}/image`, {
          responseType: "blob",
        });
        const imageFile = await converUrlToFile(
          responseImage.data,
          response.data.imageName,
        );
        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProductData = new FormData();
    updatedProductData.append("imageFile", image);
    updatedProductData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" }),
    );

    axios
      .put(`/product/${id}`, updatedProductData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", response.data);
        alert("Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="form-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="center-form">
              <h2 className="text-center mb-4" style={{ color: "#4E342E" }}>
                Update Product
              </h2>
              <form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <label className="form-label">
                      <strong>Product Name</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={updateProduct.name}
                      onChange={handleChange}
                      name="name"
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
                      value={updateProduct.brand}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col xs={12}>
                    <label className="form-label">
                      <strong>Description</strong>
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      onChange={handleChange}
                      value={updateProduct.description}
                      rows="3"
                    />
                  </Col>
                  <Col md={4}>
                    <label className="form-label">
                      <strong>Price (₹)</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={handleChange}
                      value={updateProduct.price}
                      name="price"
                    />
                  </Col>
                  <Col md={4}>
                    <label className="form-label">
                      <strong>Category</strong>
                    </label>
                    <select
                      className="form-select"
                      value={updateProduct.category}
                      onChange={handleChange}
                      name="category"
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
                      onChange={handleChange}
                      value={updateProduct.stockQuantity}
                      name="stockQuantity"
                    />
                  </Col>
                  <Col xs={12}>
                    <label className="form-label">
                      <strong>Product Image</strong>
                    </label>
                    <div className="mb-2">
                      <img
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : "https://via.placeholder.com/200"
                        }
                        alt={product.imageName || "Product"}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
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
                        checked={updateProduct.productAvailable}
                        onChange={(e) =>
                          setUpdateProduct({
                            ...updateProduct,
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
                      Update Product
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

export default UpdateProduct;
