import React from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";

const MyPage = () => {
  const dispatch = useDispatch();

  //오더리스트 들고오기

  // 오더리스트가 없다면? 주문한 상품이 없습니다 메세지 보여주기
  return (
    <Container className="status-card-container">
      <OrderStatusCard />
    </Container>
  );
};

export default MyPage;
