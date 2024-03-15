import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../component/ProductCard";

const ProductAll = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.product.error);
  
  return (
    <Container>
      <Row>
        <Col md={3} sm={12}>
          <ProductCard />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductAll;
