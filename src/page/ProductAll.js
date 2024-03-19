import React, { useEffect } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { commonFnActions } from "../redux/actions/commonFnAction";
import { productActions } from "../redux/actions/productAction";
import "../style/productAll.style.css";
const ProductAll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const {loading, error, productList, totalPageNum} = useSelector((state) => state.product);
  const {searchQuery, page} = useSelector((state) => state.fn);

  useEffect(() => { 
    dispatch(productActions.getProductList({...searchQuery, page}));
  }, [query, page, searchQuery, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(searchQuery); 
    const queryString = decodeURIComponent(params.toString());
    navigate("?"+queryString);
  }, [searchQuery, navigate]);

  const handlePageClick = ({ selected }) => {
    dispatch(commonFnActions.changePage(selected + 1));
  };

  return (
    <div>
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
              forcePage={page - 1}
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
    </div>
    
  );
};

export default ProductAll;
