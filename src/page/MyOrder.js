import React, { useEffect, useState } from "react";
import { Alert, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderStatusCard from "../component/OrderStatusCard";
import SearchBox from "../component/SearchBox";
import { myOrderActions } from "../redux/actions/myOrderAction";
import "../style/orderStatus.style.css";

const MyOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, orderList, totalPageNum, currentPage} = useSelector((state) => state.myOrder);
  const [query, setQuery] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const [searchValue, setSearchValue] = useState("");
  const [placeholder, setPlacehorder] = useState('상품명 검색');

  //오더리스트 들고오기
  useEffect(() => {
    dispatch(myOrderActions.getOrderList({searchKeyword, currentPage}));
  }, [query, searchKeyword, currentPage, dispatch]);

  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`)
  }, [searchKeyword, currentPage, navigate]);

  const handlePageClick = ({ selected }) => {
    dispatch(myOrderActions.changePage(selected + 1));
  };

  // 오더리스트가 없다면? 주문한 상품이 없습니다 메세지 보여주기
  return (
    <Container className="status-card-container">
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
        <div className="common-search-box">
          <SearchBox 
            placeholder={placeholder}
            searchValue={searchValue} 
            setSearchValue={setSearchValue}
          />
        </div>
      </Row>
      <Row>
        {orderList.length <= 0
          ? 
            <div className="empty">
              <h3>주문한 상품이 없습니다.</h3>
            </div>
          : orderList?.map((item, index) => (<OrderStatusCard key={index} item={item}/>))
        }
      </Row>
      <Row>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={8}
          pageCount={totalPageNum}
          forcePage={currentPage - 1} // 1페이지면 여긴 2가됨 (한개씩 +1 되므로 -1해줘야함)
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
          className="display-center list-style-none mt-2"
        />
      </Row>
    </Container>
  );
};

export default MyOrder;
