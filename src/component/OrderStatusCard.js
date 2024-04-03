import React from "react";
import { Badge } from "react-bootstrap";
import { dateFormat } from "../utils/date";

const OrderStatusCard = ({item}) => {
  return (
    <div className="status-card">
      <div className="order-img-and-col">
        <div className="order-img-col">
          <img
            src={item.productData[0].image}
            alt={item.productData[0].name}
            height={96}
          />
        </div>
        <div className="order-info-col">
          <div>
            <strong>주문번호: {item.items.orderNum}</strong>
          </div>
          <div>주문 일시: {dateFormat(item.items.itemCreatedAt)}</div>
          <div>상품명: {item.productData[0].name}</div>
          <div>총 주문 금액: ₩ {item.items.price}</div>
        </div>
      </div>
      <div className="order-status-col">
        <div className="order-status">주문상태</div>
        <Badge bg="warning">{item.items.status}</Badge>
      </div>
    </div>
  );
};

export default OrderStatusCard;
