import React, { useEffect } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { productActions } from "../redux/actions/productAction";

const ProductAll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const {loading, error, products, searchQuery} = useSelector((state) => state.product);
  
  useEffect(() => {
    dispatch(productActions.getProductList({...searchQuery}));
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery); 
    const queryString = decodeURIComponent(params.toString());
    navigate("?"+queryString);
  }, [searchQuery]);

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
