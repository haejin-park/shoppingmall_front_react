import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Dropdown, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_ORDER_STATUS, CUSTOMER_ORDER_STATUS } from "../constants/order.constants";
import { orderActions } from "../redux/actions/orderAction";
import "../style/adminOrder.style.css";
import { useSearchParams } from "react-router-dom";

const OrderDetailDialog = ({ open, handleClose, mode }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const {error, selectedOrder, currentPage} = useSelector((state) => state.order);
  const [orderStatusList, setOrderStatusList] = useState(selectedOrder.data.items.map((item) => item.status));
  const [checkedIndexList, setCheckedIndexList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  /*
  추가해야할거
  체크박스

  바꿔야할거
  셀렉트박스 => 드롭다운

  parmas로 보낼거(order조회시 필요) 
  selectedOrder.data._id

  body로 보낼거
  items 각각의 _id와 status 리스트
  */

  // index로 개별체크박스, 전체 체크박스 리스트 만들기
  useEffect(() => {
    checkedIndexList.length === selectedOrder.data.items.length? setCheckedAll(true) : setCheckedAll(false);
  },[checkedIndexList, selectedOrder, dispatch]); 

  const onCheckItem = (index) => {
    const isChecked = checkedIndexList.includes(index);
    if(isChecked) {
      const updatedCheckedIndexList = checkedIndexList.filter(checkedIndex => checkedIndex !== index);
      setCheckedIndexList(updatedCheckedIndexList)
    } else {  
      setCheckedIndexList([...checkedIndexList, index])    
    }
  }

  const onCheckAllItem = () =>  {
    if(checkedIndexList.length === selectedOrder.data.items.length) {
      setCheckedIndexList([]);
    } else {
      let updateCheckedIndexList = []; 
      selectedOrder.data.items.forEach((_v, index) => updateCheckedIndexList.push(index));
      setCheckedIndexList(updateCheckedIndexList);
    }
  };

  // 체크박스 index에 해당하는 주문상태 리스트 업데이트
  const selectOrderStatus = (value) => {
    const newStatus = value;
    const updatedOrderStatusList = orderStatusList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newStatus;
      }
      return status;
    });
    setOrderStatusList(updatedOrderStatusList);
  };


  const updateStatus = () => {
    const orderItemIdList = selectedOrder.data.items.map((item) => item._id);
    orderStatusList.forEach(item => {
      if(item === '') return;
    })
    dispatch(orderActions.updateOrder(selectedOrder.data._id, orderItemIdList, orderStatusList, {searchKeyword, currentPage}, mode));
    handleClose();
  };
  
  if (!selectedOrder) {
    return <></>;
  }
  return (
    <Modal show={open} onHide={handleClose} className="order-detail-dialog">
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )} 
      <Modal.Header closeButton>
        <Modal.Title><strong>주문 상세</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col className="order-detail-dialog-order-info-col">
              <p><strong>예약번호: </strong>{selectedOrder.data.info.orderNum}</p>
            </Col>
            <Col>
              <p><strong>주문날짜: </strong>{selectedOrder.data.info.itemCreatedAt.slice(0, 10)}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><strong>이메일: </strong>{selectedOrder.data.userData.email}</p>        
            </Col>
            <Col>
              <p><strong>받는 사람: </strong>{selectedOrder.data.info.contact.lastName + selectedOrder.data.info.contact.firstName }</p>        
            </Col>
          </Row>
          <Row>
            <Col>
              <p><strong>연락처: </strong>{selectedOrder.data.info.contact.contact}</p>        
            </Col>
            <Col>
              <p><strong>주소: </strong>{selectedOrder.data.info.shipTo.address + " " + selectedOrder.data.info.shipTo.city}</p>        
            </Col>
          </Row>
          <p className="order-detail-dialog-items"><strong>주문 내역</strong></p>
          <div className="overflow-x">
            <Table>
              <thead>
                <tr>
                  <th>
                    <Form.Check 
                      onChange={() => onCheckAllItem()} 
                      checked={checkedAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>상품명</th>
                  <th>주문 상태</th>
                  <th>개별 금액</th>
                  <th>수량</th>
                  <th>총 금액</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.data.items.length > 0 &&
                  selectedOrder.data.items.map((item, index) => (
                    <tr key={item._id}>
                      <td>
                      <Form.Check 
                        onChange={() => onCheckItem(index)}
                        checked={checkedIndexList.includes(index) || checkedAll} 
                      />
                      </td>
                      <td>{item._id}</td>
                      <td>{item.productData.name}</td>
                      <td>{orderStatusList[index]}</td>
                      <td>{(item.price).toLocaleString()}</td>
                      <td>{item.qty}</td>
                      <td>{(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={6}>총계:</td>
                  <td>{(selectedOrder.data.info.totalPrice).toLocaleString()}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <Dropdown
          className="order-status-drop-down"
          align="start"
          onSelect={(value) => selectOrderStatus(value)}
        >
          <Dropdown.Toggle
            className="order-status-drop-down-toggle"
            id="dropdown-basic"
            align="start"
          >
            주문 상태 선택
          </Dropdown.Toggle>
          <Dropdown.Menu className="size-drop-down">
            {mode === "customer" 
              ? CUSTOMER_ORDER_STATUS.map((item, idx) => (
                <Dropdown.Item key={idx} eventKey={item.toLowerCase()}>
                  {item}
                </Dropdown.Item>
              ))
              : ADMIN_ORDER_STATUS.map((item, idx) => (
                <Dropdown.Item key={idx} eventKey={item.toLowerCase()}>
                  {item}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>    
      <div className="order-button-area">
        <Col>
          <Button onClick={handleClose} className="order-detail-dialog-close-btn">
            닫기
          </Button>
        </Col>
        <Col>
          <Button onClick={updateStatus} disabled={orderStatusList.some(item => item === "")}>저장</Button>
        </Col>
      </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
