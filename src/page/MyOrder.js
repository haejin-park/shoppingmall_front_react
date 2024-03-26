import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { myOrderActions } from "../redux/actions/myOrderAction";

const MyOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error, orderList, totalPageNum, currentPage} = useSelector((state) => state.adminOrder);
  const [query, setQuery] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 

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

  // 오더리스트가 없다면? 주문한 상품이 없습니다 메세지 보여주기
  return (
    <Container className="status-card-container">
      <OrderStatusCard />
    </Container>
  );
};

export default MyOrder;
