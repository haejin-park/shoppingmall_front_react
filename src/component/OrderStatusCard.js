import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { dateFormat } from "../utils/date";

// 상태 우선 순위를 가지고 리스트에는 하나만 보여주고,상세 클릭하면 각각 보여주기 
const OrderStatusCard = ({order}) => {
  const [orderStatus, setOrderStatus] = useState('');
  const [badgeStatus, setBadgeStatus] = useState('');

  useEffect(() => {
    let orderStatus = '';
    if(order.data.items.every((item) => item.status === 'refund')){
      orderStatus = '전체 환불 완료';
      setBadgeStatus('refund')
    } else if(order.data.items.some((item) => item.status === 'refund')){
      orderStatus = '부분 환불 완료';
      setBadgeStatus('refund')
    } else if(order.data.items.every((item) => item.status === 'cancel')){
      orderStatus = '전체 취소 요청';
      setBadgeStatus('cancel')
    } else if(order.data.items.some((item) => item.status === 'cancel')){
      orderStatus = '부분 취소 요청';
      setBadgeStatus('cancel')
    } else if(order.data.items.every((item) => item.status === 'delivered')){
      orderStatus = '전체 배송 완료';
      setBadgeStatus('delivered')
    } else if(order.data.items.some((item) => item.status === 'delivered')){
      orderStatus = '부분 배송 완료';
      setBadgeStatus('delivered')
    } else if(order.data.items.every((item) => item.status === 'shipping')){
      orderStatus = '전체 배송 중';
      setBadgeStatus('shipping')
    } else if(order.data.items.some((item) => item.status === 'shipping')){
      orderStatus = '부분 배송 중';
      setBadgeStatus('shipping')
    } else if(order.data.items.every((item) => item.status === 'preparing')){
      orderStatus = '상품 준비 중';
      setBadgeStatus('preparing')
    }
    setOrderStatus(orderStatus);
  }, [order.data.items]);
  

  return (
    <div className="status-card">
      <div className="order-img-and-col">
        <div className="order-img-col">
          <img
            src={order.data.items[0].productData.image}
            alt={order.data.items[0].productData.name}
            height={96}
          />
        </div>
        <div className="order-info-col">
          <div><strong>주문번호: {order.data.info.orderNum}</strong></div>
          <div>주문 일시: {dateFormat(order.data.info.itemCreatedAt)}</div>
          <div>상품명: {`${order.data.items[0].productData.name}외 ${order.data.items.length - 1}건`}</div>
          <div>총 주문 금액: ₩ {order.data.info.totalPrice}</div>
        </div>
      </div>
      <div className="order-status-col">
        <div className="order-status">주문상태</div>
        <Badge bg={badgeBg[badgeStatus]}>{orderStatus}</Badge>
      </div>
    </div>
  );
};

export default OrderStatusCard;
