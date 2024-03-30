import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductUpdateDialog from "./CartProductUpdateDialog";
import { useNavigate } from "react-router";
import { cartActions } from "../redux/actions/cartAction";

/*
카트에서 사이즈 변경 가능하게 셀렉트 박스로 변경
수량은 인풋 박스로 변경

변경 시 카트 업데이트 
*/ 

const CartProductCard = ({ 
  item,  
  setCheckedItemTotalPrice, 
  checkedItemList, 
  setCheckedItemList
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchKeyword, currentPage } = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(item.productData[0]?.price * item.items.qty);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("");

  useEffect(() => {
    setTotalPrice(item.productData[0]?.price * item.items.qty)
  },[item.productData, item.items.qty]);

  //아이템을 지운다
  const deleteCartItem = (_id) => {
    dispatch(cartActions.deleteCartItem(_id, {searchKeyword, currentPage}));
  };
/*
  아이템 체크시 선택된 아이템 배열에 추가 
  선택된 아이템 금액 합계 배열에 선택된 아이템 합계 추가 

  이미 선택된 아이템인지 확인 some
  선택된 아이템이 맞다면 
  => 체크된 아이템이 아닌것만 filter
  => 체크된 아이템 금액 빼기 
*/
  const onCheckItem = (item) => {
    let totalPrice = item.productData[0]?.price * item.items.qty;
    const isChecked = checkedItemList.some(checkedItem => checkedItem === item);
    if(isChecked) {
      const updatedCheckedItemList = checkedItemList.filter(checkedItem => checkedItem !== item);
      setCheckedItemList(updatedCheckedItemList);
      setCheckedItemTotalPrice(prevTotalPrice => prevTotalPrice - totalPrice);
    } else {  
      setCheckedItemTotalPrice(prevTotalPrice => prevTotalPrice + totalPrice);
      setCheckedItemList([...checkedItemList, item]);
    }
  }

  const openEditForm = (item) => {
    dispatch(cartActions.selectCartProduct(item));
    setMode('edit');
    setShowDialog(true);
  };

  return (
    <div className="product-card-cart">
      <div className="cart-img-col">
        <Form.Check className="item-checkbox" onClick={() => onCheckItem(item)}/>
        <img
          src={item.productData[0]?.image}
          alt={item.productData[0]?.name}
          width={112}
        />
      </div>
      <div className="cart-product-info-col">
        <div className="display-flex space-between">
          <h5>{item.productData[0]?.name}</h5>
          <button className="trash-button">
            <FontAwesomeIcon
              icon={faTrash}
              width={24}
              onClick={() => deleteCartItem(item.items._id)}
            />
          </button>
        </div>
        <div>
          <strong>₩ {item.productData[0]?.price}</strong>
        </div>
        <div>Size: {item.items.size}</div>
        <div>Quantity:{item.items.qty}</div>
        <div>Total: {totalPrice}</div>
        <Button variant="dark" className="mt-1" size="sm" onClick={() => openEditForm(item)}>
          옵션 변경
        </Button>
      </div>
      <CartProductUpdateDialog
        mode={mode}
        setMode={setMode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        cartProductId={item.items.productId}
      />
    </div>
  );
};

export default CartProductCard;
