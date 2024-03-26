import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { mainProductActions } from "../redux/actions/mainProductAction";
import '../style/mainProduct.style.css';

const MainProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, productList, totalPageNum, currentPage} = useSelector((state) => state.mainProduct);
  const [sortBy, setSortBy] = useState("orderOfPurchase");
  const [query, setQuery] = useSearchParams();
  const navigationType = useNavigationType();
  const searchKeyword = query.get("searchKeyword") || "";
  
  useEffect(() => { 
      dispatch(mainProductActions.getProductList({searchKeyword, currentPage}, sortBy));
    }, [query, searchKeyword, currentPage, dispatch, sortBy]);

  // 페이지가 변경되도록
  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`); 

  }, [searchKeyword, currentPage, navigate, navigationType]);

  const handlePageClick = ({ selected }) => {
    dispatch(mainProductActions.changePage(selected + 1));
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
        <Row className="paginate-row">
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
    </div>
  )
}

export default MainProduct
