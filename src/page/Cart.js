import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as types from '../constants/cart.constants';
import CartProductCard from "../component/CartProductCard";
import OrderReceipt from "../component/OrderReceipt";
import SearchBox from "../component/SearchBox";
import { cartActions } from "../redux/actions/cartAction";
import "../style/cart.style.css";

/*
카트 페이지 해야할거
페이지 8개씩 최신 순 정렬
체크박스 추가 -> 체크한 만큼 아이템 리스트, 최종 금액 변경
옵션 변경 버튼 => 사이즈 수정하면 기존 카트 상품 지우고 새로 추가해서 기존에 사이즈가 있다면 수량이 추가되게 
갯수 수정에 따른 금액 변경 
삭제
*/

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, cartList, checkedItemList, checkedAll, totalPageNum, currentPage} = useSelector((state) => state.cart);
  const [query, setQuery] = useSearchParams();
  const searchKeyword = query.get("searchKeyword") || "";
  const [searchValue, setSearchValue] = useState("");
  const [placeholder, setPlacehorder] = useState('상품명 검색');
  const [deletedStatus, setDeletedStatus] = useState(false);
  const [deletedItemIdList, setDeletedItemIdList] = useState([]);
  const [deleteAllError, setDeleteAllError] = useState(false);

  useEffect(() => { 
    //url쿼리 읽어오기(query) => 쿼리 값에 맞춰서 상품리스트 가져오기
    dispatch(cartActions.getCartList({searchKeyword, currentPage}));
  }, [query, searchKeyword, currentPage, dispatch]);

  // 개별로 전체 선택 했을 때도 전체 선택 체크 되도록
  useEffect(() => {
    if(checkedItemList.length === cartList.length) {
      dispatch({type:types.CHECKED_ALL, payload:true});
    } else {
      dispatch({type:types.CHECKED_ALL, payload:false});
    }
    },[checkedItemList, cartList, dispatch]); 
  
  useEffect(() => {
    if(checkedItemList.length > 0) {
      setDeleteAllError(false);
    }
  }, [checkedItemList]);

  // 페이지가 변경되도록
  useEffect(() => {
    const params = searchKeyword 
    ? new URLSearchParams({searchKeyword, currentPage}) 
    : new URLSearchParams({currentPage});
    const queryString = params.toString();
    navigate(`?${queryString}`); 
  }, [searchKeyword, currentPage, navigate]);
  
  useEffect(() => {
    let deletedProductStatus = cartList?.some(item => item.productData[0].isDeleted);
    setDeletedStatus(deletedProductStatus);

    let deletedItemIdList = cartList
      .filter(item => item.productData[0].isDeleted)
      .map(item => item.items._id);

    setDeletedItemIdList(deletedItemIdList);
  },[cartList, setDeletedStatus]);
    
  const handlePageClick = ({ selected }) => {
    dispatch({type:types.CHANGE_PAGE_OF_CART, payload:selected + 1});
  };


  //삭제 후 체크된 상품 필터링
  const filteredCheckedItemList = (deleteItemIdList) => {
    const updatedCheckedItemList = checkedItemList.filter((checkedItem) => {
      return !deleteItemIdList.includes(checkedItem.items._id);
    });
    const totalPrice = updatedCheckedItemList.reduce((total, item) => {
      return total + item.productData[0]?.price * item.items.qty;
    },0);
    dispatch({type:types.CHECKED_CART_ITEM, payload:{checkedItemList:updatedCheckedItemList, checkedItemTotalPrice:totalPrice}});
  }

  //선택한 상품 삭제
  const deleteCartItemList = (checkedItemIdList) => {
    if(checkedItemIdList.length <= 0) {
      setDeleteAllError(true);
      return; 
    }
    if(checkedItemIdList) { //체크된 상품 삭제
      dispatch(cartActions.deleteCartItemList(checkedItemIdList,{searchKeyword, currentPage}));
      filteredCheckedItemList(checkedItemIdList);
    } 
  }

  //더이상 판매하지 않는 삭제된 상품 삭제
  const deleteDeletedProductList = () => { 
    if(deleteCartItemList) {
      dispatch(cartActions.deleteCartItemList(deletedItemIdList,{searchKeyword, currentPage}));
      filteredCheckedItemList(deletedItemIdList); 
    }
  }

/* 
전체 선택
체크시 모두 선택 되어있으면 (길이가 같으면) 해제
체크시 체크 박스 리스트 길이와 카트 리스트 길이가 다르면 
체크박스를 선택하면 checkedItemList에 cartList가 담긴다
cartList전체 합으로 totalPrice를 구해서 checkedItemTotalPrice를 계산한다
*/

  const onCheckAllItem = () =>  {
    if(checkedItemList.length === cartList.length) {
      dispatch({type:types.CHECKED_CART_ITEM, payload:{checkedItemList:[], checkedItemTotalPrice:0}});

    } else {
      const totalPrice = cartList.reduce((total, item) => {
        return total + item.productData[0]?.price * item.items.qty;
      },0);
      dispatch({type:types.CHECKED_CART_ITEM, payload:{checkedItemList:[...cartList], checkedItemTotalPrice:totalPrice}});

    }
  };

  
  return (
    <div>
      <Container className="cart-page-container">
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
            <div className="common-search-box">
              <SearchBox 
                placeholder={placeholder}
                searchValue={searchValue} 
                setSearchValue={setSearchValue}
              />
            </div>
            {cartList.length > 0 ?
              <>
                {deleteAllError && (
                  <Alert variant="danger" className="error-message">
                    삭제할 상품을 선택해주세요
                  </Alert>
                )}
                <div className="select-and-delete-box">
                  <Form.Check 
                    label="전체 선택" 
                    onChange={() => onCheckAllItem()} 
                    checked={checkedAll}
                  />
                  <Button variant="dark" className="mt-1" size="sm" onClick={() => deleteCartItemList(checkedItemList.map(item => item.items._id))}>
                    선택 삭제
                  </Button>
                </div>
                {deletedStatus &&
                  <div className="deleted-product">
                    <div className="deleted-product-message-and-btn">
                      <div className="deleted-product-message">
                        <strong>더이상 판매하지 않는 상품입니다. </strong>
                        <strong>해당 상품을 삭제하시겠습니까?</strong>
                      </div>
                      <Button className="delete-cart-item-btn" variant="dark" size="sm" onClick={() => deleteDeletedProductList(checkedItemList.map(item => item.items._id))}>
                        삭제
                      </Button>
                    </div>
                    {cartList.map((item,index) => (
                      item.productData[0].isDeleted && 
                      <CartProductCard 
                        key={`${item.items.productId}_${item.items.size}`} 
                        item={item}
                        checkedAll={checkedAll}
                      />
                    ))}
                  </div>
                }
                {cartList.map((item) => (
                  !item.productData[0].isDeleted &&
                  <CartProductCard 
                    key={item.items._id} 
                    item={item} 
                    checkedAll={checkedAll}
                  />
                ))}
              </>
            : 
            <div className="empty">
              <h3>카트가 비어있습니다.</h3>
              <div>상품을 담아주세요!</div>
            </div>
            }
          </Col>
          <Col xs={12} className="order-receipt-col">
            <OrderReceipt cartOrderStatus={true}/>
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

export default Cart;
