import React, { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
const OrderTable = ({ header, orderList, openEditForm }) => {
  console.log('orderList',orderList);
  const [orderStatus, setOrderStatus] = useState('');
  const [badgeStatus, setBadgeStatus] = useState('');

  useEffect(() => {
    orderList.forEach((order) => {
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
    })
    
  }, [orderList]);
  
  
  return (
    <div className="overflow-x">
      {orderList.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title) => (
                <th key={title}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderList.flatMap((order, index) => (
                <tr key={order.data._id} onClick={() => openEditForm(order)}>
                <td>{index}</td>
                <td>{order.data.info.orderNum}</td>
                <td>{order.data.info.itemCreatedAt.slice(0, 10)}</td>
                <td>{order.data.userData.email}</td>
                {order.data.items.length > 0 && 
                  order.data.items.map((item) => (
                    <td key={item._id}>
                      {`${item.productData.name}외 ${order.data.items.length - 1}개`}
                    </td>
                  ))} 
                <td>{order.data.info.shipTo.address + " " + order.data.info.shipTo.city}</td>
                <td>{(order.data.info.totalPrice).toLocaleString()}</td>
                <td>
                  <Badge bg={badgeBg[badgeStatus]}>{orderStatus}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        ) : (
        <div className="empty">
          <h3>조회된 주문이 없습니다</h3>
        </div>
        )}
    </div>
  );
};
export default OrderTable;
