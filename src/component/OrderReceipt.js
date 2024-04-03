import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { myOrderActions } from "../redux/actions/myOrderAction";

const OrderReceipt = ({cartOrderStatus}) => {
  const { cartList, checkedItemList, checkedItemTotalPrice } = useSelector((state) => state.cart);
  const { orderList, totalPrice } = useSelector((state) => state.myOrder);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deletedProductError, setDeletedProductError] = useState(false);
  
//삭제된 상품 체크 해제시 에러 문구 사라지도록
  useEffect(() => {
    const deletedProductStats = checkedItemList.some(item => item.productData[0].isDeleted)
    if(!deletedProductStats) {
      setDeletedProductError(false);
    }
  },[checkedItemList])

//주문 하기 클릭시 삭제된 상품은 결제할 수 없도록
  const goOrder = () => {
    const deletedProductStats = checkedItemList.some(item => item.productData[0].isDeleted)
    if(deletedProductStats) {
      setDeletedProductError(true);
      return;
    }
    dispatch(myOrderActions.saveOrderItem(checkedItemList, checkedItemTotalPrice, cartOrderStatus));
    navigate("/order");
    setDeletedProductError(false);
  }
  return (
    <div className="receipt-container">
      {deletedProductError && (
        <div>
          <Alert variant="danger" className="error-message">
            삭제된 상품은 주문할 수 없습니다.
          </Alert>
        </div>
      )}
      <div>
        <h3 className="receipt-title">선택 상품 내역</h3>
        <ul className="receipt-list">
          <li>
            <div className="receipt-list-box">
              <strong>선택 상품</strong>
              <div>
                {checkedItemList.length > 0
                  ? checkedItemList.map((item) => (<div key={item.items._id}>{item.productData[0].name}</div>)) 
                  : orderList.map((item, index) => (<div key={index}>{item.productData[0].name}</div>)) 
                }
              </div>
            </div>
          </li>
        </ul>
        <div className="receipt-total-box">
          <div>
            <strong>선택 상품 금액:</strong>
          </div>
          <div>
            <div>₩ {checkedItemTotalPrice || totalPrice}</div>
          </div>
        </div>
        {location.pathname.includes("/cart") && cartList.length > 0 &&
        (
          <Button
            variant="dark"
            className="payment-button"
            onClick={() => goOrder()}
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
