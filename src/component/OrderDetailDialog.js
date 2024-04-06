import React, { useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import "../style/adminOrder.style.css";
import { ORDER_STATUS } from "../constants/order.constants";
import { commonOrderActions } from "../redux/actions/commonOrderAction";

const OrderDetailDialog = ({ open, handleClose }) => {
  const {selectedOrder} = useSelector((state) => state.commonOrder);
  console.log('selectedOrder',selectedOrder);
  const [orderStatus, setOrderStatus] = useState(selectedOrder.status);
  const dispatch = useDispatch();

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };
  const submitStatus = () => {
    dispatch(commonOrderActions.updateOrder(selectedOrder._id, orderStatus));
    handleClose();
  };

  if (!selectedOrder) {
    return <></>;
  }
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>예약번호: {selectedOrder.data.info.orderNum}</p>
        <p>주문날짜: {selectedOrder.data.info.itemCreatedAt.slice(0, 10)}</p>
        <p>이메일: {selectedOrder.data.userData.email}</p>
        <p>
          주소: {selectedOrder.data.info.shipTo.address + " " + selectedOrder.data.info.shipTo.city}
        </p>
        <p>
          연락처: {
           `${selectedOrder.data.info.contact.lastName + selectedOrder.data.info.contact.firstName } 
            ${selectedOrder.data.info.contact.contact}`
          }
        </p>
        <p>주문내역</p>
        <div className="overflow-x">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>상품명</th>
                <th>개별 금액</th>
                <th>수량</th>
                <th>총 금액</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.data.items.length > 0 &&
                selectedOrder.data.items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.productData.name}</td>
                    <td>{(item.price).toLocaleString()}</td>
                    <td>{item.qty}</td>
                    <td>{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              <tr>
                <td colSpan={4}>총계:</td>
                <td>{(selectedOrder.data.info.totalPrice).toLocaleString()}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Form onSubmit={submitStatus}>
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select value={orderStatus} onChange={handleStatusChange}>
              {ORDER_STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="order-button-area">
            <Button
              variant="light"
              onClick={handleClose}
              className="order-button"
            >
              닫기
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
