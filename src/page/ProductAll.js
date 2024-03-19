import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { productActions } from "../redux/actions/productAction";
import ReactPaginate from "react-paginate";
import "../style/productAll.style.css";
const ProductAll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const {loading, error, productList, searchQuery, totalPageNum} = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
      dispatch(productActions.getProductList({...searchQuery, page:currentPage}));
  }, [query, currentPage, searchQuery, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery); 
    const queryString = decodeURIComponent(params.toString());
    navigate("?"+queryString);
  }, [searchQuery, navigate]);


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1)
  };

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
      {productList.length === 0 ?(
        <div>
          <Alert variant="danger" className="error-message">
            조회된 상품이 없습니다.
          </Alert>
        </div>
      ) : (
        productList?.map((item) => (
          <Col md={3} sm={12} key={item._id}>
            <ProductCard item={item} /> 
          </Col>
        ))
      )}
      </Row>
      <Row className="productall-paginate-row">
        <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={8}
            pageCount={totalPageNum}
            forcePage={currentPage - 1}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            className="display-center list-style-none"
          />
      </Row>
    </Container>
  );
};

export default ProductAll;
