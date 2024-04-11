import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Dropdown, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ADMIN_ORDER_STATUS, ADMIN_ORDER_STATUS_REASON, CUSTOMER_ORDER_STATUS, CUSTOMER_ORDER_STATUS_REASON } from "../constants/order.constants";
import { orderActions } from "../redux/actions/orderAction";


const OrderDetailDialog = ({ open, handleClose, mode }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useSearchParams(); 
  const searchKeyword = query.get("searchKeyword") || ''; 
  const {error, selectedOrder, currentPage} = useSelector((state) => state.order);
  const [orderStatusList, setOrderStatusList] = useState(selectedOrder.data.items.map((item) => item.status));
  const [orderStatusReasonList, setOrderStatusReasonList] = useState(selectedOrder.data.items.map((item) => item.statusReason));
  const [newOrderStatusList, setNewOrderStatusList] = useState([]);
  
  const [checkedIndexList, setCheckedIndexList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [hiddenCheckbox, setHiddenCheckbox] = useState(false);
  const [hiddenStatusDropdwon, setHiddenStatusDropdown] = useState(false);
  const [visibleReasonDropdwon, setVisibleReasonDropdown] = useState(false);

/*
주문 상태 선택 드롭 박스 보임 여부

소비자
=> item 상태 전체가 취소 요청 || 교환요청 || 반품요청 || 환불 요청 || 환불 완료 중 하나이면 체크박스, 주문 상태 선택 드롭박스가 보이게

판매자
=> item 상태 전체가 배송 완료 || 환불 완료가 아닐 때만 드롭박스 보이게
*/
  useEffect(() => {
    let bool = false;
    if(mode === "customer") {
      bool = selectedOrder.data.items.every((item) => {
        return (item.status === "취소 요청" || item.status === "교환 요청" || item.status === "반품 요청" || item.status === "환불 요청" || item.status === "환불 완료")
      });
    } else if(mode === 'admin') {
      bool = selectedOrder.data.items.every((item) => {
        return item.status === "배송 완료" || item.status === "환불 완료"
      });
    } 
    console.log('bool',bool);
    setHiddenStatusDropdown(bool);
    setHiddenCheckbox(bool);
  }, [mode, selectedOrder])

  /* 
  주문 상태 사유 선택 드롭 박스 보임 여부
  체크된게 있고 새로운 주문 상태가 있을 경우 

  소비자 
  => 보이게 

  관리자
  => 새로운 주문 상태 리스트 newOrderStatusList에 
  index가 checkIndexList에 포함되어있고 
  상태가 환불 요청일 때만 드롭다운 보이게
  */
  useEffect(() => {
    if (checkedIndexList.length === 0 || newOrderStatusList.length === 0) {
      setVisibleReasonDropdown(false);
      return;
    } 

    if(mode === "customer") {
      setVisibleReasonDropdown(true);
    } else if(mode === 'admin') {
      const visibleReasonDropdown = newOrderStatusList.some((status, index) => {
        return checkedIndexList.includes(index) && status === "환불 요청";
        }  
      );
      setVisibleReasonDropdown(visibleReasonDropdown);
    }
  
  },[mode, checkedIndexList, newOrderStatusList]); 

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
    if (checkedIndexList.length === 0) {
      return;
    }
    const newStatus = value;
    const updatedOrderStatusList = orderStatusList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newStatus;
      }
      return status;
    });

    //새로운 주문 상태만 있는 리스트
    const newOrderStatusList = selectedOrder.data.items.map((_v, index) => {
      if (checkedIndexList.includes(index)) {
        return newStatus;
      }
      return "";
    });
    setOrderStatusList(updatedOrderStatusList);
    setNewOrderStatusList(newOrderStatusList);
  };

  const selectOrderStatusReason = (value) => {
    if (checkedIndexList.length === 0) {
      return;
    }
    const newReason = value;
    const updatedOrderStatusReasonList = orderStatusReasonList.map((status, index) => {
      if (checkedIndexList.includes(index)) {
        return newReason;
      }
      return status;
    });
    setOrderStatusReasonList(updatedOrderStatusReasonList);
  };

  const updateOrder = () => {
    const orderItemIdList = selectedOrder.data.items.map((item) => item._id);
    orderStatusList.forEach(item => {
      if(item === '') return;
    })

    dispatch(orderActions.updateOrder(selectedOrder.data._id, orderItemIdList, orderStatusList, orderStatusReasonList, {searchKeyword, currentPage}, mode));
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
                {!hiddenCheckbox && 
                  <th>
                    <Form.Check 
                      disabled={     
                        selectedOrder.data.items.some((item, index) => (
                        (mode === "customer" && (item.status === '취소 요청' || item.status === '교환 요청' || item.status === '반품 요청' ||  item.status === '환불 요청' ||  item.status === '환불 완료'))
                        || (mode === "admin" && (item.status === '배송 완료' || item.status === '환불 완료'))
                      ))}
                      onChange={() => onCheckAllItem()} 
                      checked={checkedAll}
                    />
                  </th>
                }
                <th>ID</th>
                <th>상품명</th>
                <th>주문 상태</th>
                <th>사유</th>
                <th>개별 금액</th>
                <th>수량</th>
                <th>총 금액</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.data.items.length > 0 &&
                selectedOrder.data.items.map((item, index) => (
                  <tr key={item._id}>
                    {!hiddenCheckbox && 
                      <td>
                        <Form.Check 
                          disabled={
                            (mode === "customer" && (item.status === '취소 요청' || item.status === '교환 요청' || item.status === '반품 요청' ||  item.status === '환불 요청' ||  item.status === '환불 완료'))
                            || (mode === "admin" && (item.status === '배송 완료' || item.status === '환불 완료'))
                          }
                          onChange={() => onCheckItem(index)}
                          checked={checkedIndexList.includes(index) || checkedAll} 
                        />
                      </td>
                    }
                    <td>{item._id}</td>
                    <td>{item.productData.name}</td>
                    <td>{orderStatusList[index]}</td>
                    <td>{orderStatusReasonList[index]}</td>
                    <td>{(item.price).toLocaleString()}</td>
                    <td>{item.qty}</td>
                    <td>{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              <tr>
                <th colSpan={!hiddenCheckbox ? 7 : 6}>총계:</th>
                <td>{(selectedOrder.data.info.totalPrice).toLocaleString()}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        {!hiddenStatusDropdwon && 
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
            <Dropdown.Menu className="order-status-drop-down-menu">
            {/*     
              선택한 주문 초기 상태에서 체크한 index에 해당하고

              소비자일 때  disabled
              - !상품 준비 중 => 취소 요청 disabled
              - !배송중, !배송 완료  => 교환 요청 || 반품 요청 disabled

              관리자일 때 disabled
              - !상품 준비중, !교환 요청 => 배송중 disabled
              - !배송중 => 배송완료 disabled
              - !상품 준비 중, !취소 요청, !교환 요청, !반품 요청 => 환불 요청 disabled
              - !환불 요청 => 환불 완료 disabled
            */}
              {mode === "customer" 
                ? CUSTOMER_ORDER_STATUS.map((status, idx) => (
                  <Dropdown.Item 
                    disabled={selectedOrder.data.items.some((item, index) => {
                      return checkedIndexList.includes(index) && (
                      (item.status !== "상품 준비 중" && status === "취소 요청") || 
                      ((item.status !== "배송 중" && item.status !== "배송 완료") && (status === "교환 요청" || status === "반품 요청"))
                      )})}
                    key={idx} 
                    eventKey={status}
                  >
                    {status}
                  </Dropdown.Item>
                ))
                : ADMIN_ORDER_STATUS.map((status, idx) => (
                  <Dropdown.Item 
                    disabled={selectedOrder.data.items.some((item, index) => {
                      return checkedIndexList.includes(index) && (
                      ((item.status !== "상품 준비 중" && item.status !== "교환 요청") && status === "배송 중") ||
                      (item.status !== "배송 중" && status === "배송 완료") ||
                      ((item.status !== "상품 준비 중" && item.status !== "취소 요청" && item.status !== "교환 요청" && item.status !== "반품 요청") && status === "환불 요청") ||
                      (item.status !== "환불 요청" && status === "환불 완료")
                      )})}
                    key={idx} 
                    eventKey={status}
                  >
                    {status}
                  </Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        }
        {visibleReasonDropdwon &&  
          <Dropdown
            className="order-status-drop-down"
            align="start"
            onSelect={(value) => selectOrderStatusReason(value)}
          >
          <Dropdown.Toggle
            className="order-status-drop-down-toggle"
            id="dropdown-basic"
            align="start"
          >
            주문 상태 사유 선택
          </Dropdown.Toggle>
          <Dropdown.Menu className="order-status-drop-down-menu">
            {mode === "customer" 
              ? CUSTOMER_ORDER_STATUS_REASON.map((reason, idx) => (
                <Dropdown.Item 
                  disabled={newOrderStatusList.includes("취소 요청") && (reason === "판매자 귀책 사유:상품 파손" || reason === "판매자 귀책 사유:오배송")}
                  key={idx} 
                  eventKey={reason}
                >
                  {reason}
                </Dropdown.Item>
              ))
              : ADMIN_ORDER_STATUS_REASON.map((reason, idx) => (
                <Dropdown.Item key={idx} eventKey={reason}>
                  {reason}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
        }
      <div className="order-button-area">
        <Col>
          <Button onClick={handleClose} className="order-detail-dialog-close-btn">
            닫기
          </Button>
        </Col>
        <Col>
          <Button onClick={updateOrder} disabled={newOrderStatusList.every(item => item === "") || selectedOrder.data.items.every((item, index) => item.status === orderStatusList[index])}>저장</Button>
        </Col>
      </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
