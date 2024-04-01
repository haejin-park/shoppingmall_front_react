import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { cartActions } from "../redux/actions/cartAction";
import CartProductUpdateDialog from "./CartProductUpdateDialog";

/*
카트에서 사이즈 변경 가능하게 셀렉트 박스로 변경
수량은 인풋 박스로 변경

변경 시 카트 업데이트 
*/ 

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {cartList, checkedItemList, checkedItemTotalPrice, searchKeyword, currentPage } = useSelector((state) => state.cart);
  const [totalPrice, setTotalPrice] = useState(item.productData[0]?.price * item.items.qty);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState("");
  console.log('checkedItemList',checkedItemList);

  useEffect(() => {
    setTotalPrice(item.productData[0]?.price * item.items.qty)
  },[item.productData, item.items.qty]);

  // 개별로 전체 선택 했을 때도 전체 선택 체크 되도록
  useEffect(() => {
    if(checkedItemList.length === cartList.length) {
      const totalPrice = checkedItemList.reduce((total, item) => {
        return total + item.productData[0]?.price * item.items.qty;
      },0);
      dispatch(cartActions.checkedCartItem(cartList, totalPrice, true));
    }
   },[checkedItemList, cartList, dispatch]); 

  //아이템을 지운다
  const deleteCartItem = (_id) => {
    dispatch(cartActions.deleteCartItem(_id, {searchKeyword, currentPage}));
    const updatedCheckedItemList = checkedItemList.filter(checkedItem => checkedItem.items._id !== _id);
    const totalPrice = updatedCheckedItemList.reduce((total, item) => {
      return total + item.productData[0]?.price * item.items.qty;
    },0);
    dispatch(cartActions.checkedCartItem(updatedCheckedItemList, totalPrice));
  };

  
  /*
    체크한 아이템이 checkedItemList에 있으면 
    => 체크된 아이템이 아닌것만 filter 해서 checkedItemList 디스패치
    => 체크된 아이템 금액 빼기 

    체크한 아이템이 checkedItemList에 없으면
    => 체크된 아이템 checkedItemList에 추가 
    => 체크된 아이템 금액 더하기
  */
  const onCheckItem = (item) => {
    const totalPrice = item.productData[0]?.price * item.items.qty;
    const isChecked = checkedItemList.includes(item);
    if(isChecked) {
      const updatedCheckedItemList = checkedItemList.filter(checkedItem => checkedItem !== item);
      dispatch(cartActions.checkedCartItem(updatedCheckedItemList, checkedItemTotalPrice - totalPrice, false))
    } else {  
      dispatch(cartActions.checkedCartItem([...checkedItemList, item], checkedItemTotalPrice + totalPrice))
    }
  }

  const openEditForm = (item) => {
    dispatch(cartActions.selectCartProduct(item));
    setMode('edit');
    setShowDialog(true);
  };

  return (
    <div className={`product-card-cart ${item.productData[0]?.isDeleted && 'deleted-product'} `}>
      <div className="cart-img-col">
        <Form.Check 
          className="item-checkbox" 
          onChange={() => onCheckItem(item)}
          checked={checkedItemList.includes(item)} 
        />
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
        {!item.productData[0]?.isDeleted &&
          <Button variant="dark" className="mt-1" size="sm" onClick={() => openEditForm(item)}>
            옵션 변경
          </Button>
        }
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
