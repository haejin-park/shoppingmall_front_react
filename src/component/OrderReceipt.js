import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const OrderReceipt = () => {
  const { checkedItemList, checkedItemTotalPrice } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const [goPaymentError, setGoPaymentError] = useState(false);
  
//삭제된 상품 체크 해제시 에러 문구 사라지도록
  useEffect(() => {
    const deletedProductStats = checkedItemList.some(item => item.productData[0].isDeleted)
    if(!deletedProductStats) {
      setGoPaymentError(false);
    }
  },[checkedItemList])

//주문 하기 클릭시 삭제된 상품은 결제할 수 없도록
  const goPayment = () => {
    const deletedProductStats = checkedItemList.some(item => item.productData[0].isDeleted)
    if(deletedProductStats) {
      setGoPaymentError(true);
      return;
    }
    navigate("/payment");
    setGoPaymentError(false);
  }
  return (
    <div>
      {goPaymentError && (
        <div>
          <Alert variant="danger" className="error-message">
            삭제된 상품은 주문할 수 없습니다.
          </Alert>
        </div>
      )}
      <div className="receipt-container">
        <h3 className="receipt-title">선택 상품 내역</h3>
        <ul className="receipt-list">
          <li>
            <div className="receipt-list-box">
              <strong>선택 상품</strong>
              <div>
              {checkedItemList.map((item) => (
                <div key={item.items._id}>{item.productData[0].name}</div>
              ))}
              </div>
            </div>
          </li>
        </ul>
        <div className="receipt-total-box">
          <div>
            <strong>선택 상품 금액:</strong>
          </div>
          <div>
            <div>₩ {checkedItemTotalPrice}</div>
          </div>
        </div>
        {location.pathname.includes("/cart") && (
          <Button
            variant="dark"
            className="payment-button"
            onClick={() => goPayment()}
          >
            주문 하기
          </Button>
        )}

        <div>
          배송비는 결제 단계에 도달했을 때 확인하실 수 있습니다. 
        </div>
        <div>
          반품 가능 기간은 수령일로부터 1주일이며,
          단순 변심으로 인한 반품 및 환불 시 추가 배송비가 발생할 수 있습니다.
        </div>
      </div>
    </div>

  );
};

export default OrderReceipt;
