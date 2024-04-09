import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import * as types from '../constants/product.constants';
import { mainProductActions } from "../redux/actions/mainProductAction";
import '../style/mainProduct.style.css';

const MainProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, productList, totalPageNum, currentPage} = useSelector((state) => state.mainProduct);
  const [sortBy, setSortBy] = useState("orderOfPurchase");
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const searchCategory = query.get("searchCategory") || "";
  const prevUserEmail = sessionStorage.getItem("prevUserEmail");
  const currentUserEmail = sessionStorage.getItem("currentUserEmail");

/*
  이전 user email로 메인 3페이지에서 로그아웃 후 => 다른 user email로 로그인하면 메인 1페이지 이동하도록
  1페이지 이동은 로그인 시 한번만 실행 되도록 loginAction에서 메인 이동 후 prevUserEmail, currentUserEmail 삭제
  로그아웃 한 상태에서도 검색 되도록 currentUserEmail === null일 때 조회 가능하게
*/

  //리스트 조회시 페이지 번호 변경되도록
  useEffect(() => { 
    if(prevUserEmail !== null && currentUserEmail !== null && prevUserEmail !== currentUserEmail) { 
      dispatch(mainProductActions.getProductList({searchCategory, searchKeyword, currentPage:1, sortBy}));
    } else if(currentUserEmail === null) {
      dispatch(mainProductActions.getProductList({searchCategory, searchKeyword, currentPage, sortBy}));
    }
  }, [query, searchCategory, searchKeyword, currentPage, dispatch, sortBy, prevUserEmail, currentUserEmail]);

  // 페이지 url 변경되도록
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
