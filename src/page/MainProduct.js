import React, { useEffect } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import * as types from '../constants/product.constants';
import { productActions } from "../redux/actions/productAction";
import '../style/mainProduct.style.css';

const MainProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const {loading, error, mainProductList:productList, mainTotalPageNum:totalPageNum, mainCurrentPage:currentPage, mainSortBy:sortBy} = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";
  const prevUserEmail = sessionStorage.getItem("prevUserEmail");
  const currentUserEmail = sessionStorage.getItem("currentUserEmail");
  const prevMainSortBy = sessionStorage.getItem("prevMainSortBy");

  useEffect(() => { 
    if(prevUserEmail !== null && currentUserEmail !== null && prevUserEmail !== currentUserEmail) { 
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage:1, sortBy:"popularity"}));
    } else if(navigationType === "POP" && currentUserEmail === null && prevMainSortBy) {
      let sortBy = prevMainSortBy
      dispatch({type:types.SELECT_SORT_BY_MAIN_PRODUCT_LIST, payload: sortBy});
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage, sortBy}));
    } else if(navigationType !== "POP" && currentUserEmail === null) {
      dispatch(productActions.getMainProductList({searchCategory, searchKeyword, currentPage, sortBy}));
    } 
  }, [navigationType, query, searchCategory, searchKeyword, currentPage, dispatch, sortBy, prevUserEmail, currentUserEmail, prevMainSortBy]);

  useEffect(() => {
    let params = {};
    if(prevUserEmail!== null && currentUserEmail!== null && prevUserEmail !== currentUserEmail) {  
      params = new URLSearchParams({currentPage: 1}); 
    } else if(currentUserEmail === null) {
      if(searchKeyword && !searchCategory) {
        params = new URLSearchParams({searchKeyword, currentPage}) 
      } else if (!searchKeyword && searchCategory) {
        params = new URLSearchParams({searchCategory, currentPage}) 
      } else if (searchKeyword && searchCategory) {
        params = new URLSearchParams({searchCategory, searchKeyword, currentPage}) 
      } else if (!searchKeyword && !searchCategory && currentPage) {
        params = new URLSearchParams({currentPage});
      }
    } 
    const queryString = params.toString();
    navigate(`?${queryString}`); 
  }, [searchCategory, searchKeyword, currentPage, navigate, prevUserEmail, currentUserEmail]);

  const handlePageClick = ({ selected }) => {
    dispatch({type:types.CHANGE_PAGE_OF_MAIN_PRODUCT, payload:selected + 1});
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
            <div className="empty">
              <h3>조회된 상품이 없습니다.</h3>
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
