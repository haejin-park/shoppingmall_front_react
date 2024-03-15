import React, { useEffect } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../component/ProductCard";
import { productActions } from "../redux/actions/productAction";

const ProductAll = () => {
  const dispatch = useDispatch();
  const {loading, error, products} = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(productActions.getProductList());
  }, []);
  console.log('products', products);
  return (
    <Container>
      {loading && (
        <div className="spinner-box">
        <Spinner animation="border" role="status">
          <span className="visually-hidden loading-message">Loading...</span>
        </Spinner>
      </div>
      )}
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )}
      <Row>
        {products?.map((item) => (
          <Col md={3} sm={12} key={item._id}>
            <ProductCard item={item} /> 
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductAll;
