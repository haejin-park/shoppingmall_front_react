import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CartProductCard from "../component/CartProductCard";
import OrderReceipt from "../component/OrderReceipt";
import { cartActions } from "../redux/actions/cartAction";
import "../style/cart.style.css";
import SearchBox from "../component/SearchBox";

/*
카트 페이지 해야할거
페이지 8개씩 최신 순 정렬
체크박스 추가 -> 체크한 만큼 아이템 리스트, 최종 금액 변경
옵션 변경 버튼 => 사이즈 수정하면 기존 카트 상품 지우고 새로 추가해서 기존에 사이즈가 있다면 수량이 추가되게 
갯수 수정에 따른 금액 변경 
삭제
*/

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, cartList, totalPageNum, currentPage} = useSelector((state) => state.cart);
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const [checkedItemTotalPrice,setCheckedItemTotalPrice] = useState(0);
  const [checkedItemList,setCheckedItemList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [placeholder, setPlacehorder] = useState('상품명 검색');

  useEffect(() => { 
    //url쿼리 읽어오기(query) => 쿼리 값에 맞춰서 상품리스트 가져오기
    dispatch(cartActions.getCartList({searchKeyword, currentPage}));
  }, [query, searchKeyword, currentPage, dispatch]);

    // 페이지가 변경되도록
    useEffect(() => {
      const params = searchKeyword 
      ? new URLSearchParams({searchKeyword, currentPage}) 
      : new URLSearchParams({currentPage});
      const queryString = params.toString();
      navigate(`?${queryString}`); 
    }, [searchKeyword, currentPage, navigate]);

    
  const handlePageClick = ({ selected }) => {
    dispatch(cartActions.changePage(selected + 1));
  };

  return (
    <div>
      <Container>
        <Row className="cart-row">
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
          <Col xs={12} className="product-list-col">
            <div className="cart-search-box">
              <SearchBox 
                placeholder={placeholder}
                searchValue={searchValue} 
                setSearchValue={setSearchValue}
              />
            </div>
            {cartList.length > 0? 
              cartList.map((item) => (
                <CartProductCard 
                  key={item.items._id} 
                  item={item} 
                  setCheckedItemTotalPrice={setCheckedItemTotalPrice} 
                  checkedItemList={checkedItemList}
                  setCheckedItemList={setCheckedItemList}
                />
              ))
            : 
            <div className="empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
            }
          </Col>
          <Col xs={12} className="order-receipt-col">
            <OrderReceipt 
              checkedItemTotalPrice={checkedItemTotalPrice}
              checkedItemList={checkedItemList}
            />
          </Col>
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
    </div>
  );
};

export default CartPage;
