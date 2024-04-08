import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../style/order.style.css";

const OrderComplete = () => {
  const {orderNum} = useSelector((state) => state.order);
  const navigate = useNavigate();
  //만약 주문번호가 없는상태로 주문 완료 페이지에 왔다면 다시 이전페이지로 돌아가기
  useEffect(() => {
    if(!orderNum) navigate(-1);
  },[orderNum, navigate])
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>주문이 완료됬습니다!</h2>
      <div>주문번호:{orderNum}</div>
      <div>
        주문 확인은 내 주문에서 확인해주세요
        <div className="go-my-order">
          <Link to={"/my/order"}>내 주문 바로가기</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderComplete;
